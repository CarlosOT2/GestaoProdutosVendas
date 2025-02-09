//# Import //
import { exec } from 'child_process'
import fs from 'fs'
import Registry from 'winreg'
import util from 'util'
import readline from 'readline'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile, writeFile, mkdir, accessFile, remove } from '../../helpers/Fs/fsHelpers.js'

import get_root from '../root_credentials.js'

//# Variáveis Globais //

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const backup_path = join(__dirname, `full_backups/fullbackup.xb.7z`)
const backup_logs = join(__dirname, '../backup_logs')
const restore_backups = join(__dirname, './restore_backups')

const execPromise = util.promisify(exec)

//# Funções //

export async function restore_backup() {
    //# Variáveis //
    const MariaDB_reg = new Registry({
        hive: Registry.HKLM,
        key: '\\SYSTEM\\CurrentControlSet\\Services\\MariaDB'
    })
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const info_db = await get_infodb()
    const service_name = info_db[2]
    const datadir = join(info_db[1], '..')

    const keep_dir = join(datadir, `../keep`)
    const keepdir_files = {
        essentials: ['mysql', 'my.ini'],
        not_essentials: ['performance_schema', 'sys']
    }

    //# Funções //

    function get_infodb() {
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
    async function prepare_restore() {
        //.. Verify 'restore_backups' Path //
        if (await accessFile(restore_backups, fs.constants.F_OK, { console_error: false })) {
            fs.rmSync(restore_backups, { recursive: true }, (err_rmSync) => {
                if (err_rmSync) return err_rmSync
            })
        }
        await mkdir(restore_backups)

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
    async function move_essentials(config = {}) {

        const { moveto_keepdir, moveto_datadir } = config
        if (!moveto_keepdir && !moveto_datadir) {
            throw new Error("Nenhum diretório especificado em 'moveEssentials'");
        }

        function move(oldDir, newDir) {
            const promises = []
            for (const file_type in keepdir_files) {
                keepdir_files[file_type].forEach(async (name) => {
                    const console_error = {
                        keepdir: `KEEPDIR; Arquivo '${name}' não foi encontrado`,
                        datadir: `DATADIR; Arquivo '${name}' não foi encontrado`
                    }
                    if (file_type === 'essentials') {
                        promises.push(fs.promises.rename(join(oldDir, `./${name}`), join(newDir, `./${name}`)))
                    }
                    if (file_type === 'not_essentials') {
                        if (!await accessFile(join(oldDir, `./${name}`), fs.constants.F_OK, { console_error: false })) {
                            console.error(moveto_keepdir ? console_error.keepdir : console_error.datadir)
                            return
                        }
                        promises.push(fs.promises.rename(join(oldDir, `./${name}`), join(newDir, `./${name}`)))
                    }
                })
            }
            return promises
        }

        if (moveto_keepdir) {
            if (!await accessFile(keep_dir, fs.constants.F_OK, { console_error: false })) await mkdir(keep_dir)
            await Promise.all(move(datadir, keep_dir))
        } else {
            await Promise.all(move(keep_dir, datadir))
            await remove(keep_dir, { recursive: true })
        }
    }
    async function copyback_backup() {
        const { essentials, not_essentials } = keepdir_files
        const { removeError } = await remove(datadir, { emptyfolder: true, dontremove: [...essentials, ...not_essentials] })
        if (removeError) throw removeError

        const copyback_restore = `mariabackup --copy-back --target-dir=${restore_backups} --datadir=${datadir}`
        const { error } = await execPromise(copyback_restore)
        if (error) throw error
        console.log(`;------- Success copyback backup -------;`);
    }

    try {
        await prepare_restore()
        await database_service('stop')
        const essentials_paths = keepdir_files['essentials'].map(file_name => join(datadir, `./${file_name}`))
        if (!await accessFile(essentials_paths, fs.constants.F_OK, { multiple_paths: true })) {
            throw new Error('Falha ao encontrar arquivo essencial, ele não existe')
        }

        await move_essentials({ moveto_keepdir: true })
        await copyback_backup()
        await move_essentials({ moveto_datadir: true })
        rl.question(`Deseja Iniciar o Serviço '${service_name}' Novamente? (s/n)`, async (user_input) => {
            if (user_input.toLowerCase() === 's') await database_service('start')
            rl.close()
        })
    } catch (error) {
        console.error(error)
    }
}
export async function backup_db(db_name) {

    //# Variáveis //

    const { username, password } = await get_root()
    const backup_tempfile = `${backup_path}.tmp`
    const backup_command = `mariabackup --user=${username} --password=${password} --backup --stream=xbstream --databases="${db_name}" | 7z a -si "${backup_path}"`

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
            const check_db = `mariadb-check -c --all-databases --user=${username} --password=${password}`
            const optimize_db = `mariadb-check -o --all-databases --user=${username} --password=${password}`
            const service_name = 'MariaDB'
            let rejects_flag = false

            return new Promise((resolve, rejects) => {

                async function check_values(cnfg_obj) {
                    const { filename_log, check_cond, rjct_check_cond, wrtFile_check_cond, error } = cnfg_obj
                    if (error) {
                        writeFile(`${backup_logs}/exec_${filename_log}`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
                        rejects(error)
                        rejects_flag = true
                    }
                    if (check_cond) {
                        writeFile(`${backup_logs}/${filename_log}`, wrtFile_check_cond)
                        rejects(rjct_check_cond)
                        rejects_flag = true
                    }
                }

                exec(`sc query ${service_name}`, (sc_error, stdout) => {
                    check_values({
                        filename_log: 'queryerr.log',
                        check_cond: !stdout.toString().includes('RUNNING'),
                        rjct_check_cond: new Error(`Serviço Windows "${service_name}" não está sendo executado.`),
                        wrtFile_check_cond: `Serviço Windows "${service_name}" não está sendo executado.`,
                        error: sc_error
                    })
                    if (rejects_flag) return
                    exec(check_db, (check_err, check_stdout) => {
                        check_values({
                            filename_log: 'checkerr.log',
                            check_cond: check_stdout.includes('Error'),
                            rjct_check_cond: `Error encontrado durante a checagem do comando 'check_db'`,
                            wrtFile_check_cond: check_stdout,
                            error: check_err
                        })
                        if (rejects_flag) return
                        exec(optimize_db, (opt_err, opt_stdout) => {
                            check_values({
                                filename_log: 'opterr.log',
                                check_cond: opt_stdout.includes('Error'),
                                rjct_check_cond: `Error durante a execução do comando 'optimize_db'`,
                                wrtFile_check_cond: opt_stdout,
                                error: opt_err
                            })
                            if (rejects_flag) return
                            resolve()
                        })
                    })
                })

            })
        }
        //, exec_backup //
        async function exec_backup() {
            return new Promise((resolve, rejects) => {
                exec(backup_command, (error) => {
                    if (error) return rejects(error)
                    resolve()
                })
            })
        }

        try {
            await copyFile(backup_path, backup_tempfile)
            await unlinkFile(backup_path)

            const check_error = await check_db()
            if (check_error) throw check_error
            const execBackup_error = await exec_backup()
            if (execBackup_error) throw execBackup_error

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



