import multer from 'multer';
import path from 'path';
import AppError from './../services/AppError.js';

let options=(folder)=>{
    const storage = multer.diskStorage({
        
        destination: function (req, file, cb) {
            const uploadPath = path.join(process.cwd(), `uploads/${folder}`);
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + "h"); 
        }
    });
    
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new AppError("Invalid image", 400), false);
        }
    }

    return multer({ storage, fileFilter });

}


export const UploadFile = (folder, fileName) => options(folder).single(fileName);  

export const UploadFiles = (folder, filesName) =>  options(folder).fields(filesName)  

