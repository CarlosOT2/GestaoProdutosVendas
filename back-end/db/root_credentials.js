//# Import //
import fs from 'fs'
import path from 'path';
import util from 'util'

import { accessFile } from '../helpers/Fs/fsHelpers.js'
import { decrypt, encrypt } from '../helpers/Encryption/dpapi.js';
import { get_secret } from '../helpers/Aws/secret_manager.js'
import { exec } from 'child_process';
import users from '../config/users_win.js';
import { root_secret } from '../config/aws.js';

//# Variáveis Globais //
const __dirname = path.dirname(import.meta.filename)
const dirfolder = path.join(__dirname, '../data/local_credentials')
const dirfile = path.join(dirfolder, '/root.json')

const execPromise = util.promisify(exec)

//# Funções Exportadas // 
export function local_credentials() {
    async function create_credentials(root) {
        try {
            await encrypt({
                data: JSON.stringify(root),
                new_path: dirfile,
                scope: "CurrentUser"
            })
            await Promise.all([
                execPromise(`icacls ${dirfile} /inheritance:r`),
                execPromise(`icacls "${dirfile}" /grant "${users.server}":F SYSTEM:F "BUILTIN\\Administradores":F`)
            ])
        } catch (error) {
            throw error
        }
    }
    async function decrypt_credentials() {
        try {
            const decrypted_data = await decrypt({ path: dirfile, scope: "CurrentUser" })
            return JSON.parse(decrypted_data)
        } catch (error) {
            throw error
        }
    }

    return { create_credentials, decrypt_credentials }
}



export default async function get_root() {
    const { create_credentials, decrypt_credentials } = local_credentials()
    try {
        const root = await get_secret(root_secret, { console_error: false })
        await create_credentials(root)
        if (!await accessFile(dirfile, fs.constants.F_OK, { console_error: false })) {
            throw new Error(`Não Foi Possível Criar As Credenciais Locais`)
        }
        return root
    } catch (error) {
        console.error(`;------- Error get_root -------;`, error)
        if (!await accessFile(dirfile, fs.constants.F_OK, { console_error: false })) {
            console.error(`Não Foi Possível Acessar As Credenciais Locais Para Iniciar O Servidor`)
        } else {
            console.log(`Acessando Credenciais Locais Para Iniciar o Servidor`)
            return await decrypt_credentials()
        }
    }
}
