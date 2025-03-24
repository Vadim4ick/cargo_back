import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const storageConfig = {
  storage: diskStorage({
    destination: './images', // Папка для сохранения
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4(); // Генерация уникального имени
      const ext = extname(file.originalname); // Получение расширения файла
      callback(null, `${uniqueSuffix}${ext}`); // Пример: "a1b2c3d4.png"
    },
  }),
};
