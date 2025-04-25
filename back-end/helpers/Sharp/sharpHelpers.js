
//# Import //
import sharp from '../../config/sharp.js';
import path from 'path'
import FSHttpCode from 'nodefs_httpcode'

import { verifyMimeType } from '../Img.js';


//# Funções //
export async function resizeFile(old_path, new_path) {
    if (!old_path || !new_path) {
        console.error(`Required arguments cannot be null (oldPath, newPath)`)
        return false
    }
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
        await verifyMimeType(old_path, { err_obj: true })
        await promiseResize()
        return { filename, dirname }
    } catch (resizeError) {
        console.error(';------- Error Resize -------;', resizeError.message)
        throw resizeError
    }
}