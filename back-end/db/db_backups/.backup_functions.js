//# Import //
import { exec } from 'child_process'
import fs from 'fs'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile, writeFile } from '../../helpers/Fs/fsHelpers.js'

import get_root from '../root_credentials.js'

//# Funções //

export async function restore_db(backup_name) {
    /*
    - Comando Para Dar Restore, Por Enquanto É Esse, Precisa de um diretorio para os dados do backup em especifico,
    - ele vai armazenar os dados do backup no diretorio que está sendo executado o comando.
    , 7z e C:/Users/Carlos/.programacao/Projetos/GestaoProdutosVendas/Git/back-end/db/db_backups/full_backups/fullbackup.xb.7z -so | mbstream -x 
    */
}
export async function backup_db(db_name) {

    //# Variáveis //

    //.. backup //
    //, credentials //
    const { username, password } = await get_root()
    //, path //
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename)
    const backup_path = join(__dirname, `full_backups/fullbackup.xb.7z`)
    const backup_tempfile = `${backup_path}.tmp`
    const backup_checklogs = join(__dirname, '../backup_checklogs')
    //, command //
    const command = `mariabackup --user=${username} --password=${password} --backup --stream=xbstream --databases="${db_name}" | 7z a -si "${backup_path}"`




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
            return new Promise((resolve, rejects) => {
                exec(`sc query ${service_name}`, (sc_error, stdout) => {
                    if (sc_error) return rejects(sc_error)
                    if (!stdout.toString().includes('RUNNING')) {
                        return rejects(new Error(`Serviço Windows "${service_name}" não está sendo executado.`))
                    }
                    exec(check_db, (check_err, check_stdout) => {
                        if (check_err) return rejects(check_err)
                        if (check_stdout.includes('Error')) {
                            writeFile(`${backup_checklogs}/checkerr.log`, check_stdout)
                            return rejects(`Error durante a execução do comando 'check_db'`)
                        }
                        exec(optimize_db, (opt_err, opt_stdout) => {
                            if (opt_err) return rejects(opt_err)
                            if (opt_stdout.includes('Error')) {
                                writeFile(`${backup_checklogs}/opterr.log`, opt_stdout)
                                return rejects(`Error durante a execução do comando 'optimize_db'`)
                            }
                            resolve()
                        })
                    })
                })

            })
        }
        //, exec_command //
        async function exec_command() {
            return new Promise((resolve, rejects) => {
                exec(command, (error) => {
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
            const exec_error = await exec_command()
            if (exec_error) throw exec_error

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



