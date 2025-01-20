//# Import //
import { exec } from 'child_process'
import fs from 'fs'

import { join, dirname, basename, resolve } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile, copyFile } from '../../helpers/Fs/fsHelpers.js'

import { current_date } from '../../helpers/Date/get_date.js'
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
            throw new Error(`;------- Error 'backup_s3' -------;`, error)
        }
    }
    async function backup_exec() {
        /*
                await copyFile(backup_path, backup_tempfile)
                */
        try {
            /*
            await unlinkFile(backup_path)
            */
            exec(command, (error, stdout) => {
                if (error) throw error
                console.log(`;------- Success 'backup_exec' ${db_name} -------;`, stdout);
                resolve();
            });
        } catch (error) {
            throw new Error(`;------- Error 'backup_exec' ${db_name} -------;`, error)
        }
    }

    try {
        await backup_exec()
        await backup_s3()
    } catch (error) {
        console.error(error.message)
    }
}



