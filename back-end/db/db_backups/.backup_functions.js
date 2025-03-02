//# Import //
import { exec } from 'child_process'
import fs from 'fs'
import Registry from 'winreg'
import util, { promisify } from 'util'
import readline from 'readline'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile, writeFile, mkdir, accessFile, remove, renameFile } from '../../helpers/Fs/fsHelpers.js'

import get_root from '../root_credentials.js'

//# Variáveis Globais //
//.. DATABASE //
const info_db = await get_infodb()
const service_name = info_db[2]

//.. DIRS //
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

//-- Backup //
const rawbackup_path = join(__dirname, `temp_backups`)
const backup_path = join(__dirname, `backups/fullbackup.7z`)
const backup_logs = join(__dirname, '../backup_logs')
const prepare_dir = join(__dirname, 'prepare_backup')
//-- Restore //
const datadir = join(info_db[1], '..')
const keepdir = join(datadir, '../keep')
const temp_datadir = join(datadir, '../temp_data')
//.. RL //
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
//-- Em Resumo, Quando eu chamar 'promisify()' para a função 'rl.question', ela vai ser "promisificada" de forma diferente.
//-- O [promisify.custom] cria uma forma customizada, dessa função ser transformada em promise. sendo necessário nesse caso,
//-- porque, a função 'rl.question' não pode ser transformada em promise da forma tradicional com 'promisify()'.
rl.question[promisify.custom] = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    })
}
const rlPromise = promisify(rl.question)

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
    const essentials_files = ['sys', 'performance_schema']

    //# Funções //

    async function prepare_restore() {
        //.. Verify 'prepare_dir' Path //
        if (!await accessFile(prepare_dir, fs.constants.F_OK, { console_error: false })) await mkdir(prepare_dir)
        await remove(prepare_dir, { emptyfolder: true })

        const extract_command = `cd ${prepare_dir} && 7z x ${backup_path}`
        const prepare_command = `mariabackup --prepare --target-dir=${prepare_dir}`
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
        //.. Variables //
        const {
            filesDir,
            newDir,
            files = fs.readdirSync(filesDir),
            remove_filesDir = false,
            return_boolean = false
        } = config
        const dirs = {
            temp_data: temp_datadir,
            data: datadir,
            keep: keepdir
        }
        const current_dir = dirs[newDir]

        //.. Functions //
        async function move(newDir) {
            return files.map(async (name) => {
                return fs.promises.rename(join(filesDir, name), join(newDir, name))
            })
        }

        //.. Verification //
        if (!filesDir && !newDir) throw new Error(`Valores obrigatórios faltando em 'move_files'`)
        if (!current_dir) throw new Error(`Diretório inválido especificado em move_files; '${newDir}'`);

        //.. Conditions //
        if (newDir === 'temp_data' || newDir === 'keep') {
            if (!await accessFile(current_dir, fs.constants.F_OK, { console_error: false })) {
                await mkdir(current_dir)
            } else {
                await remove(current_dir, { emptyfolder: true, console_error: false })
            }
        }

        if (newDir === 'data' && !await accessFile(datadir, fs.constants.F_OK, { console_error: false })) {
            throw new Error(`Error mover arquivos para o diretório 'datadir' ele não existe`)
        }

        try {
            await Promise.all(await move(current_dir))
            if (remove_filesDir) await remove(filesDir, { recursive: true })
            if (return_boolean) return true
        } catch (error) {
            console.error(error.message)
            if (return_boolean) return false
            throw error
        }
    }
    async function copyback_backup() {
        const copyback_restore = `mariabackup --copy-back --target-dir=${prepare_dir} --datadir=${datadir}`
        const { error } = await execPromise(copyback_restore)
        if (error) throw error
        console.log(`;------- Success copyback backup -------;`);
    }

    try {
        //.. Verification //
        if (!await accessFile(backup_path, fs.constants.F_OK, { console_error: false })) {
            throw new Error('o arquivo de backup não existe. (nome do arquivo precisa ser "fullbackup")')
        }
        //.. Preparation To Restore //
        await prepare_restore()
        await database_service('stop')
        if (!await move_files({
            newDir: 'keep',
            filesDir: datadir,
            files: essentials_files,
            return_boolean: true
        })) {
            const user_input = await rlPromise(`Deseja Continuar Mesmo Com Alguns Arquivos Essenciais Faltando? (s/n)`)
            if (user_input.toLowerCase() === 'n') {
                throw new Error('Arquivos faltando ao realizar o Restore')
            }
        }
        await move_files({ newDir: 'temp_data', filesDir: datadir })
        //.. Executing Restore //
        await copyback_backup()
        await move_files({ newDir: 'data', filesDir: keepdir, remove_filesDir: true })
        //.. Finalizing Restore //
        await remove(temp_datadir, { deletefolder: true })
        await remove(prepare_dir, { deletefolder: true })

        const user_input = await rlPromise(`Deseja Iniciar o Serviço '${service_name}' Novamente? (s/n)`)
        if (user_input.toLowerCase() === 's') await database_service('start')
        rl.close()
    } catch (error) {
        console.error(error)
        if (await accessFile(temp_datadir, fs.constants.F_OK, { console_error: false })) {
            await remove(datadir, { emptyfolder: true })
            await move_files({
                newDir: 'data',
                filesDir: temp_datadir,
                remove_filesDir: true
            })
        }
        if (await accessFile(keepdir, fs.constants.F_OK, { console_error: false })) {
            await move_files({
                newDir: 'data',
                filesDir: keepdir,
                remove_filesDir: true
            })
        }
        if (await accessFile(prepare_dir, fs.constants.F_OK, { console_error: false })) {
            await remove(prepare_dir, { deletefolder: true, console_error: false })
        }
    }
}

export async function backup_db(db_name) {
    //# Variáveis //
    const { username, password } = await get_root()

    const backup_tempfile = `${backup_path}.tmp`

    const backup_command = `mariabackup --user=${username} --password=${password} --backup --databases="${db_name} mysql" --target-dir=${rawbackup_path}`
    const compact_command = `7z a "${backup_path}" "${join(rawbackup_path, '*')}"`

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
    async function backup_localfile() {
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
                    console.log(`;------- Comando ${key} finalizado -------;`);
                } catch (err) {
                    const frmttd_err = JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
                    if (frmttd_err.includes('cmd')) await writeFile(`${backup_logs}/exec_${filename}.log`, frmttd_err)
                    throw err
                }
            }
        }
        async function backup_exec() {
            if (!await accessFile(rawbackup_path, fs.constants.F_OK, { console_error: false })) await mkdir(rawbackup_path)
            await remove(rawbackup_path, { emptyfolder: true })

            await execPromise(backup_command)
            await copyFile(join(datadir, 'my.ini'), join(rawbackup_path, 'my.ini'))
            await execPromise(compact_command)

            await remove(rawbackup_path, { deletefolder: true })
        }

        try {
            //.. Create 'temp_file' //
            await renameFile(backup_path, backup_tempfile, { dont_throw: true, console_error: false })
            //.. Restart Service // 
            await database_service('stop')
            await database_service('start')
            //.. Execute Backup //
            await check_db()
            await backup_exec()
            //.. Finalize Backup //
            await unlinkFile(backup_tempfile, { dont_throw: true })
            console.log(`;------- Success backup ${db_name} -------;`)
        } catch (error) {
            await remove(rawbackup_path, { deletefolder: true, console_error: false, dont_throw: true })
            await unlinkFile(backup_path, { dont_throw: true, console_error: false })
            await renameFile(backup_tempfile, backup_path, { dont_throw: true, console_error: false })
            throw error
        }
    }

    try {
        await backup_localfile()
        await backup_s3()
        console.log(`;------- Backup Terminado -------;`)
    } catch (error) {
        console.error(error)
    }
}