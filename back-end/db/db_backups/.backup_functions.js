//# Import //
import { exec } from 'child_process'
import fs, { write } from 'fs'
import Registry from 'winreg'
import util from 'util'
import readline from 'readline'

import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile, writeFile, mkdir, accessFile, remove } from '../../helpers/Fs/fsHelpers.js'

import get_root from '../root_credentials.js'

//# Variáveis Globais //

//.. DIRS //
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const backup_path = join(__dirname, `full_backups/fullbackup.xb.7z`)
const backup_logs = join(__dirname, '../backup_logs')

const restore_backups = join(__dirname, './restore_backups')
//.. DATABASE //
const info_db = await get_infodb()
const service_name = info_db[2]

//.. MISCELLANEOUS //
const execPromise = util.promisify(exec)

//# Funções Globais //

function get_infodb() {
    const MariaDB_reg = new Registry({
        hive: Registry.HKLM,
        key: '\\SYSTEM\\CurrentControlSet\\Services\\MariaDB'
    })
    return new Promise((resolve, rejects) => {
        MariaDB_reg.get('ImagePath', (error, result) => {
            if (error) return rejects(error)
            const info_db = result.value
                .match(/"([^"]*)"/g)
                .map(path => path.replace(/"/g, '').replace(/^--defaults-file=/, ''));
            resolve(info_db)
        })
    })
}
async function database_service(option) {
    if (option !== 'start' && option !== 'stop') {
        throw new Error(`Parâmetro '${option}' da função 'database_service' inválida`)
    }

    const query_service = `sc query ${service_name}`
    const service_command = `net ${option} ${service_name}`
    const exec_console = option === 'start' ? 'iniciar' : 'parar'
    let attempts = 0

    async function exec_command() {
        if (attempts >= 3) throw new Error(`Falha ao ${exec_console} Serviço '${service_name}'`)

        const { error, stdout } = await execPromise(query_service)
        if (error) throw error

        const isRunning = stdout.toString().includes('RUNNING')
        if ((option === 'start' && isRunning) || (option === 'stop' && !isRunning)) {
            return console.log(`;------- Success ${exec_console} Serviço '${service_name}' -------;`)
        }
        await execPromise(service_command)
        attempts++
        console.log(`${exec_console} Serviço '${service_name}', Tentativa; ${attempts}`);
        return await exec_command()
    }
    await exec_command()
}

//# Exportações //

export async function restore_backup() {
    //# Variáveis //

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const datadir = join(info_db[1], '..')
    const temp_datadir = join(datadir, '../temp_datadir')

    const keep_dir = join(datadir, `../keep`)
    const essentials_files = ['my.ini', 'sys', 'performance_schema']

    //# Funções //

    async function prepare_restore() {
        //.. Verify 'restore_backups' Path //
        if (!await accessFile(restore_backups, fs.constants.F_OK, { console_error: false })) await mkdir(restore_backups)
        await remove(restore_backups, { emptyfolder: true })

        const extract_command = `cd ${restore_backups} && 7z e ${backup_path} -so | mbstream -x`
        const prepare_command = `mariabackup --prepare --target-dir=${restore_backups}`
        //.. Extract //
        const { error } = await execPromise(extract_command)
        if (error) throw error
        console.log(`;------- Success extrair backup -------;`);

        //.. Prepare //
        if (!error) {
            const { error } = await execPromise(prepare_command)
            if (error) throw error
            console.log(`;------- Success preparar restauração backup -------;`);
        }
    }
    async function move_files(config = {}) {
        const { keep, data, temp_data } = config
        const { filesDir, files = fs.readdirSync(filesDir), remove_filesDir = false } = config

        //.. Move //
        async function move(newDir) {
            return files.map(async (name) => {
                return fs.promises.rename(join(filesDir, name), join(newDir, name))
            })
        }

        //.. Verification //
        if (!keep && !data && !temp_data) {
            throw new Error(`Nenhum diretório especificado em 'move_files'`);
        }
        if (!filesDir) {
            throw new Error(`Valores obrigatórios faltando em 'move_files'`)
        }

        //.. Conditions //
        if (keep) {
            if (!await accessFile(keep_dir, fs.constants.F_OK, { console_error: false })) await mkdir(keep_dir)
            await Promise.all(await move(keep_dir))
        } else if (data) {
            await Promise.all(await move(datadir))
        } else {
            if (!await accessFile(temp_datadir, fs.constants.F_OK, { console_error: false })) {
                if (!await mkdir(temp_datadir)) throw new Error(`Falha ao criar pasta 'temp_datadir'`)
            }
            await Promise.all(await move(temp_datadir))
        }
        if (remove_filesDir) await remove(filesDir, { recursive: true })
    }
    async function copyback_backup() {
        const copyback_restore = `mariabackup --copy-back --target-dir=${restore_backups} --datadir=${datadir}`
        const { error } = await execPromise(copyback_restore)
        if (error) throw error
        console.log(`;------- Success copyback backup -------;`);
    }

    try {
        //.. Preparation To Restore //
        await prepare_restore()
        await database_service('stop')
        await move_files({ keep: true, filesDir: datadir, files: essentials_files })
        await move_files({ temp_data: true, filesDir: datadir })

        //.. Executing Restore //
        await copyback_backup()
        await move_files({
            data: true,
            filesDir: keep_dir,
            remove_filesDir: true
        })
        await remove(temp_datadir, { recursive: true })

        rl.question(`Deseja Iniciar o Serviço '${service_name}' Novamente? (s/n)`, async (user_input) => {
            if (user_input.toLowerCase() === 's') await database_service('start')
            rl.close()
        })

    } catch (error) {
        console.error(error)
        if (await accessFile(temp_datadir, fs.constants.F_OK, { console_error: false })) {
            await remove(datadir, { emptyfolder: true })
            await move_files({
                data: true,
                filesDir: temp_datadir,
                remove_filesDir: true
            })
        }
        if (await accessFile(keep_dir, fs.constants.F_OK, { console_error: false })) {
            await move_files({
                data: true,
                filesDir: keep_dir,
                remove_filesDir: true
            })
        }
    }
}

export async function backup_db(db_name) {

    //# Variáveis //

    const backup_dbs = `${db_name} mysql`
    const { username, password } = await get_root()
    const backup_tempfile = `${backup_path}.tmp`
    const backup_command = `mariabackup --user=${username} --password=${password} --backup --stream=xbstream --databases="${backup_dbs}" | 7z a -si "${backup_path}"`

    //# Funções //
    async function backup_s3() {
        const file_content = fs.readFileSync(backup_path)
        const upload_params = {
            credentials_secret_name: 'credentials-user//access_bucket---mysql-db.backups//',
            params: {
                Bucket: 'mysql-db.backups',
                Key: `${db_name}/fullbackup`,
                Body: file_content
            }
        }
        try {
            await upload_s3(upload_params)
            console.log(`;------- Success 'backup_s3' -------;`)
        } catch (error) {
            throw error
        }
    }
    async function backup_exec() {
        //.. Funções 'backup_exec' //
        //, check_db //
        async function check_db() {
            const execs = {
                check: {
                    cmd: `mariadb-check -c --all-databases --user=${username} --password=${password}`
                },
                optimize: {
                    cmd: `mariadb-check -o --all-databases --user=${username} --password=${password}`
                }
            }

            for (let key in execs) {
                const { cmd } = execs[key]
                const filename = `${key}err.log`

                try {
                    const { stdout } = await execPromise(cmd)
                    if (stdout.includes('Error')) {
                        await writeFile(`${backup_logs}/${filename}`, stdout)
                        throw new Error(stdout)
                    }
                } catch (err) {
                    const frmttd_err = JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
                    if (frmttd_err.includes('cmd')) await writeFile(`${backup_logs}/exec_${filename}.log`, frmttd_err)
                    throw err
                }
            }
        }

        try {
            await copyFile(backup_path, backup_tempfile)
            await unlinkFile(backup_path)

            await database_service('stop')
            await database_service('start')

            const check_error = await check_db()
            if (check_error) throw check_error

            const { error } = await execPromise(backup_command)
            if (error) throw error

            console.log(`;------- Success 'backup_exec' ${db_name} -------;`);
            await unlinkFile(backup_tempfile)
        } catch (error) {

            await copyFile(backup_tempfile, backup_path)
            await unlinkFile(backup_tempfile)

            throw error
        }
    }

    try {
        await backup_exec()
        await backup_s3()
    } catch (error) {
        console.error(error)
    }
}



