/*
                                                   # COMO FUNCIONA ?

..                              IRÁ FUNCIONAR COMO O MÓDULO 'fs; file system' COM FUNÇÕES Á MAIS.
..                 IRÁ VERIFICAR VALORES, ENVIAR RESPOSTAS AO CLIENTE, LANÇAR MENSAGENS NO CONSOLE, SE NECESSÁRIO.

*/

//# Import //
import fs from 'fs'
import sharp from '../../config/sharp.js';
import path from 'path'

import FSHttpCode from './FSHttpCode.js'
import HTTPError from '../Classes/HTTPError.js'

import { verifyMimeType } from '../Img.js';


//.. promiseFs //
function promiseFs(fs_config) {
    const { path, old_path, new_path } = fs_config
    const { type, data, options, constants } = fs_config
    const fs_arguments = {
        access: [path, constants],
        rename: [old_path, new_path],
        unlink: [path],
        rm: [path, options],

        mkdir: [path],
        writeFile: [path, data, options],
        copyFile: [path, new_path],
    }

    let type_arguments = []
    try {
        if (!type) throw new Error(`'type' Nulo`)

        type_arguments = fs_arguments[type]
        if (!type_arguments) {
            throw new Error(`'fs_arguments' Não Encontrado, ${type}`)
        }

        if (type_arguments.some(arg => !arg && arg !== 0)) {
            throw new Error(`Argumentos Necessários Nulos`)
        }
    } catch (error) {
        throw new HTTPError(`promiseFs; ${error.message}`, 500)
    }

    return new Promise((resolve, reject) => {
        function fs_cb(fsError) {
            if (fsError) {
                const HttpCode = FSHttpCode(fsError)
                reject(new HTTPError(fsError, HttpCode))
            } else {
                resolve()
            }
        }
        fs[type](...type_arguments, fs_cb)
    })
}



//.. accessFile //
export async function accessFile(path, constants, optional_config = {}) {
    const { res, console_error = true } = optional_config
    try {
        if (!path || constants) throw new Error(`Argumentos Necessario Nulos (path, constants)`)
        await promiseFs({ type: 'access', path, constants })
        return true
    } catch (accessError) {
        if (console_error) console.error(';------- Error Access -------;', accessError.message)
        if (res) res.status(accessError.status).json({ info: accessError.message })
        return false
    }
}
//.. renameFile //
export async function renameFile(old_path, new_path, res) {
    try {
        if (!old_path || !new_path) throw new Error(`;------- Error Rename -------; Argumentos Necessario Nulos (oldPath, newPath)`)
        await promiseFs({ type: 'rename', old_path, new_path })
        return true
    } catch (renameError) {
        console.error(';------- Error Rename -------;', renameError.message)
        if (res) res.status(renameError.status).json({ info: renameError.message })
        return false
    }
}
//.. unlinkFile //
export async function unlinkFile(path, res) {
    try {
        if (!path) throw new Error(`;------- Error Unlink -------; Argumentos Necessario Nulos (path)`)
        await promiseFs({ type: 'unlink', path: path })
        return true
    } catch (unlinkError) {
        console.error(';------- Error Unlink -------;', unlinkError.message)
        if (res) res.status(unlinkError.status).json({ info: unlinkError.message })
        return false
    }
}
//.. copyFile // 
export async function copyFile(path, new_path) {

    try {
        if (!path || !new_path) throw new Error(`;------- Error copyFile -------; Argumentos Necessario Nulos (path, new_path)`)
        await promiseFs({ type: 'copyFile', path, new_path })
        return true
    } catch (copyFileError) {
        console.error(`;------- Error copyFile -------;`, copyFileError.message)
        return false
    }
}
//.. resizeFile //
export async function resizeFile(old_path, new_path, res) {
    if (!old_path || !new_path) {
        console.error(`;------- Error Resize -------; Argumentos Necessario Nulos (old_path, new_path)`)
        return false
    }
    if (!verifyMimeType(old_path, res)) return false

    //.. Funções //
    const filename = `${path.basename(new_path, path.extname(new_path))}.jpeg`
    const dirname = path.dirname(new_path)

    async function promiseResize() {
        return new Promise((resolve, reject) => {
            sharp(old_path)
                .toFormat('jpeg', { quality: 20 })
                .toFile(`${dirname}/${filename}`, (errorResize) => {
                    if (errorResize) {
                        const HttpCode = FSHttpCode(errorResize)
                        reject(new HTTPError(errorResize, HttpCode))
                    } else {
                        resolve()
                    }
                })
        })
    }

    try {
        await promiseResize()
        return { filename, dirname }
    } catch (resizeError) {
        console.error(';------- Error Resize -------;', resizeError.message)
        if (res) res.status(resizeError.status).json({ info: resizeError.message })
        return false
    }
}
//.. writeFile //
export async function writeFile(path, data, options = {}) {
    try {
        if (!path || !data) {
            throw new Error(`Argumentos Necessario Nulos (path, data)`)
        }
        await promiseFs({ type: 'writeFile', path, data, options })
        return true
    } catch (writeFileError) {
        console.error(';------- Error writeFile -------;', writeFileError.message)
        return false
    }
}



//.. mkdir //
export async function mkdir(path) {
    try {
        if (!path) {
            throw new Error(`Argumentos Necessario Nulos (path)`)
        }
        await promiseFs({ type: 'mkdir', path })
        return true
    } catch (mkdirError) {
        console.error(';------- Error mkdir -------;', mkdirError.message)
        return false
    }
}
//.. remove //
export async function remove(path, options = {}) {
    const { emptyfolder, dontremove = [] } = options

    try {
        if (!path) {
            throw new Error(`Argumentos Necessario Nulos (path)`)
        }
        if (emptyfolder) {
            await Promise.all(
                fs.readdirSync(path)
                    .filter(file_name => !dontremove.includes(file_name))
                    .map(file_name => fs.promises.rm(`${path}/${file_name}`, { recursive: true, ...options }))
            )
        } else {
            await promiseFs({ type: 'rm', path, options })
        }
        return {}
    } catch (removeError) {
        console.error(';------- Error remove -------;', removeError.message)
        return { removeError }
    }
}