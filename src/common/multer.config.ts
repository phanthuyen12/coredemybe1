import {diskStorage} from 'multer';
import {extname} from 'path';

// Giới hạn file size: 500MB (500 * 1024 * 1024 bytes)
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

// Các định dạng video được chấp nhận
const VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo', // .avi
    'video/webm',
    'video/x-matroska', // .mkv
    'video/3gpp',
    'video/x-flv',
];

export function multerConfig(folder: string) {
    return {
        storage: diskStorage({
            destination: `./uploads/${folder}`,
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, file.fieldname + '-' + uniqueSuffix + ext);
            }
        }),
        limits: {
            fileSize: MAX_FILE_SIZE, // 100MB
            files: 1, // Chỉ cho phép 1 file
            fields: 50, // Số lượng form fields tối đa
            fieldNameSize: 255, // Độ dài tên field
            fieldSize: 10 * 1024 * 1024, // 10MB cho form fields
            headerPairs: 2000, // Số lượng header pairs
        },
        fileFilter: (req, file, callback) => {
            // Nếu là folder videos, chỉ chấp nhận video files
            if (folder === 'videos') {
                if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error(`Chỉ chấp nhận file video. Định dạng ${file.mimetype} không được hỗ trợ.`), false);
                }
            } else {
                // Các folder khác (images, courses, etc.) chấp nhận tất cả
                callback(null, true);
            }
        },
    }
}