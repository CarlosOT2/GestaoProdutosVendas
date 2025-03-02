//# Import //
import { MimeTypes } from '../config/Img.js'
import * as libPath from 'path';
import HTTPError from './Classes/HTTPError.js';

//# Funções //
export function getExtension(path) {
    return libPath.extname(path).toLowerCase()
}
export async function verifyMimeType(path, options) {
    const { res, err_obj } = options
    const extension = getExtension(path)
    const verified = MimeTypes.includes(extension)

    const err_msg = `Formato '${extension}' Não Suportado`
    if (verified) {
        return true
    } else {
        if (res) res.status(415).json({ info: err_msg })
        if (err_obj) throw new HTTPError(err_msg, 415)
        return false
    }
}