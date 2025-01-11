//# Import //
import fs from 'fs';
import path from 'path';

import { writeFile } from '../helpers/Fs/fsHelpers.js'
import { get_secret } from '../helpers/Aws/secret_manager.js'
import { exec } from 'child_process';
import { users } from '../users_win/users.js';
import dpapi from 'win-dpapi'

//# Funções Exportadas // 
export function local_credentials() {
    const __dirname = path.dirname(import.meta.filename)

    const dirfolder = path.join(__dirname, '../data/local_credentials')
    const dirfile = path.join(dirfolder, '/root.json')
    const { server } = users

    async function create_credentials(root) {
        const buffer_root = Buffer.from(JSON.stringify(root))
        const crypted_root = dpapi.protectData(buffer_root, null, "CurrentUser")
        writeFile(dirfile, crypted_root)
        exec(`icacls ${dirfile} /inheritance:r`)
        exec(`icacls "${dirfile}" /grant "${server}":F SYSTEM:F "BUILTIN\\Administradores":F`)
    }
    async function access_credentials(config_access = {}) {
        const { exists } = config_access
        return new Promise((resolve, reject) => {
            fs.readFile(dirfile, (fs_error, data) => {
                if (exists) resolve(!fs_error)
                if (fs_error) {
                    reject(new Error(`;------- Error access_credentials -------; Não Foi Possível Acessar O Arquivo`, fs_error));
                } else {
                    const encrypted_data = dpapi.unprotectData(data, null, "CurrentUser");
                    resolve(JSON.parse(encrypted_data))
                }
            })
        })

    }
    return { create_credentials, access_credentials }
}



export default async function get_root() {
    const { create_credentials, access_credentials } = local_credentials()
    try {
        const root = await get_secret('mysql-user//root//', { console_error: false })
        await create_credentials(root)
        if (!await access_credentials({ exists: true })) {
            console.error(`;------- Error get_root -------; Não Foi Possível Criar 'local_credentials'`)
        }
        return root
    } catch (error) {
        console.error(`;------- Error get_root -------;`, error)
        console.log(`Usando credenciais locais para iniciar o servidor`)
        return await access_credentials()
    }
}
