//# Import //
import { exec } from 'child_process'
import fs from 'fs'

import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url';

import { upload_s3 } from '../../helpers/Aws/s3.js'
import { unlinkFile } from '../../helpers/Fs/fsHelpers.js'

import { current_date } from '../../helpers/Date/get_date.js'
import get_root from '../root_credentials.js'



//# Funções //

export default async function upload_backup(db_name) {
    const file_path = await backup_database(db_name)
    const file_name = basename(file_path)
    const file_content = fs.readFileSync(file_path)
    const upload_params = {
        credentials_secret_name: 'credentials-user//access_bucket---mysql-db.backups//',
        params: {
            Bucket: 'mysql-db.backups',
            Key: `${db_name}/${file_name}`,
            Body: file_content
        }
    }
    try {
        await upload_s3(upload_params)
        await unlinkFile(file_path)
        console.log(`;------- Sucess S3 Backup -------;`)
    } catch (error) {
        console.error(`;------- Error S3 Backup -------;`, error)
    }
}

async function backup_database(db_name) {

    //# Variáveis //

    //.. backup //
    //, credentials //
    const { username, password } = await get_root()
    //, path //
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename)
    const backup_path = join(__dirname, `fullbackup_${db_name}.sql`)
    //, command //
    const command = `mariabackup --backup --target-dir=${backup_path} --user=${username} --password=${password} --databases="${db_name}"`


    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                unlinkFile(backup_path)
                reject(new Error('Ocorreu um erro durante o backup do banco de dados'));
            } else {
                console.log(`;------- Sucess Backup ${db_name} -------;`, stdout)
                resolve(backup_path)
            }
        })
    })
}



