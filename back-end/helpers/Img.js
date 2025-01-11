//# Import //
import { MimeTypes } from '../config/Img.js'
import * as libPath from 'path';

//# Funções //
export function getExtension(path) {
    return libPath.extname(path).toLowerCase()
}
export function verifyMimeType(path, res) {
    const extension = getExtension(path)
    const verified = MimeTypes.includes(extension)
    if (verified) {
        return true
    } else {
        if (res) res.status(415).json({ info: `Formato '${extension}' Não Suportado` })
        return false
    }
}