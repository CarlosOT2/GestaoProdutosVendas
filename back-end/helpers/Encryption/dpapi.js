//# Import //
import fs from 'fs'
import dpapi from 'win-dpapi'
import { writeFile } from 'improved_nodefs'

//# Funções Exportadas //

export async function encrypt(config) {
    const { path, data, new_path, scope = 'LocalMachine' } = config

    const rawData = path ? fs.readFileSync(path) : data
    const encryptedData = dpapi.protectData(Buffer.from(rawData), null, scope)
    await writeFile(new_path, encryptedData)
}
export async function decrypt(config) {
    const { path, data, scope = 'LocalMachine' } = config

    const encryptedData = path ? fs.readFileSync(path) : data
    const decryptedData = dpapi.unprotectData(encryptedData, null, scope)
    return decryptedData
}