import {diskStorage} from 'multer';
import {extname} from 'path';
export function multerConfig(folder: string) {

    return {
        storage: diskStorage({
            destination: `./uploads/${folder}`,
            filename:(req,file,callback)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, file.fieldname + '-' + uniqueSuffix + ext);

            }
        }),
    }
}