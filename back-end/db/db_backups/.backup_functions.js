//# Import //
import { exec } from 'child_process'
import fs from 'fs'
import Registry from 'winreg'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile, writeFile, mkdir } from '../../helpers/Fs/fsHelpers.js'

import get_root from '../root_credentials.js'

//# Variáveis Globais //

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const backup_path = join(__dirname, `full_backups/fullbackup.xb.7z`)
const backup_logs = join(__dirname, '../backup_logs')

//# Funções //

export async function restore_backup() {
    //# Variáveis //
    const restorefiles_path = join(__dirname, './restore_backups')
    const MariaDB_reg = new Registry({
        hive: Registry.HKLM,
        key: '\\SYSTEM\\CurrentControlSet\\Services\\MariaDB'
    })

    //# Funções //

    async function extract_backup() {
        const extract_backup = `cd ${restorefiles_path} && 7z e ${backup_path} -so | mbstream -x `
        return new Promise((resolve, rejects) => {
            exec(extract_backup, (error) => {
                if (error) return rejects(error)
                console.log(`;------- Success extrair backup -------;`);
                resolve()
            })
        })

    }
    async function prepare_backup() {
        const prepare_backup = `mariabackup --prepare --target-dir=${restorefiles_path}`
        return new Promise((resolve, rejects) => {
            exec(prepare_backup, (error) => {
                if (error) throw rejects(error)
                console.log(`;------- Success restaurar backup -------;`);
                resolve()
            })
        })
    }
    function move_essentials_folders(datadir) {
        const folders = ['mysql', 'performance_schema', 'sys']
        const promises = []
        const keepfolders_dir = join(datadir, `../../keep_folders`)
        mkdir(keepfolders_dir)
        folders.forEach((folder_name) => {
            promises.push(new Promise((resolve, rejects) => {
                const folder_dir = join(datadir, `../${folder_name}`)
                const folder_newDir = `${keepfolders_dir}/${folder_name}`
                fs.rename(folder_dir, folder_newDir, (error) => {
                    if (error) return rejects(error)
                    resolve()
                })
            }))
        })
        return promises
    }
    async function get_infodb() {
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
    try {
        const info_db = await get_infodb()
        const db_service_name = info_db[2]
        
        const extract_error = await extract_backup()
        if (extract_error) throw extract_error

        const prepare_error = await prepare_backup()
        if (prepare_error) throw prepare_error

        const datadir = info_db[1]
        const move_folders = await Promise.all(move_essentials_folders(datadir))
        if (move_folders) throw move_folders
    } catch (error) {
        console.error(error)
    }
    /*
    - Comando Para Dar Restore, Por Enquanto É Esse, Precisa de um diretorio para os dados do backup em especifico,
    - ele vai armazenar os dados do backup no diretorio que está sendo executado o comando.
    , 7z e C:/Users/Carlos/.programacao/Projetos/GestaoProdutosVendas/Git/back-end/db/db_backups/full_backups/fullbackup.xb.7z -so | mbstream -x 
    , mariabackup --prepare --target-dir=C:\Users\Carlos\.programacao\Projetos\GestaoProdutosVendas\Git\back-end\db\db_backups\restore_backups
    , mariabackup --copy-back --target-dir=C:\Users\Carlos\.programacao\Projetos\GestaoProdutosVendas\Git\back-end\db\db_backups\restore_backups --datadir=C:\Users\Carlos\.mariadb
    */
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
            console.log(`;------- Sucess 'backup_s3' -------;`)
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



