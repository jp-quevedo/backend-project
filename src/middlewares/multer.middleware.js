import multer from 'multer'
import { __dirname } from '../utils/utils.js'

export const upload = multer({ dest: __dirname + '/public/images/' })

const storage = multer({
    dest: (req, res, cb) => {
        let folder
        if (File.fieldname === 'profileImage') {
            folder = 'profiles'
        } else if (File.fieldname === 'productImage') {
            folder = 'products'
        } else {
            folder = 'documents'
        }
        cb(null, _id + '-' + Date.now() + '-' + File.originalname)
    }
})

export const docFilter = multer({ storage })