//# Import //
import { exec } from 'child_process'
import fs from 'fs'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile } from '../../helpers/Fs/fsHelpers.js'

import get_root from '../root_credentials.js'




//# Funções //

export async function restore_db(db_name) {
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
        //, exec_command //
        async function exec_command() {
            return new Promise((resolve, rejects) => {
                exec(command, (error, stdout) => {
                    if (error) return rejects(error)
                    resolve(stdout)
                })
            })
        }
        //, verify_backupFile //
        async function verify_backupFile() {

            return new Promise((resolve, rejects) => {
                const service_name = 'MariaDB'
                let valid_backup = false
                exec(`sc query ${service_name}`, (execError, stdout) => {
                    if (execError) return rejects(execError)

                    valid_backup = stdout.toString().includes('RUNNING')
                    fs.stat(backup_path, (statError, stats) => {
                        if (statError) return rejects(statError)
                        valid_backup = stats.size < 200
                    })

                    resolve(valid_backup)
                })
            })
        }



        try {
            await copyFile(backup_path, backup_tempfile)
            await unlinkFile(backup_path)

            const { error, stdout } = await exec_command()
            if (error) throw error
            if (!await verify_backupFile()) throw new Error('Houve falhas durante o processo de backup')

            console.log(`;------- Success 'backup_exec' ${db_name} -------;`, stdout);
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



