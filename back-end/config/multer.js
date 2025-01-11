//# Import //
import multer from 'multer'
import { format } from 'date-fns'

//# Funções //
export default function image_storage(config_multer) {
    const { permanent_path, temp_path } = config_multer

    //.. DIR express.static //
    const dirExpStatic = './data/imgData'
    //.. DIR Permanent Storage //
    const dirPermanent = `${dirExpStatic}/${permanent_path}`

    //.. IMAGE STORAGE //
    const tempStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${dirExpStatic}/${temp_path}`);
        },
        filename: (req, file, cb) => {
            const currentDate = format(new Date(), `dd;MM;yyyy-HH;mm;ss.SSS`)
            const fileName = `${currentDate} -- ${file.originalname}`
            cb(null, fileName);
        }
    });
    const tempUpload = multer(
        {
            storage: tempStorage,
            limits: { fileSize: 1 * 1024 * 1024 },
        })
    return {
        multer,
        tempUpload,
        tempStorage,
        dirPermanent,
        dirExpStatic
    }
}