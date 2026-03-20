import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ResponseMessageType } from '../interfaces/http.response';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const multerConfig: MulterOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/i)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException({
          ok: false,
          message: 'Only image files are allowed',
          error: ResponseMessageType.BAD_REQUEST,
        }),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: './uploads/products',
    filename: (req, file, cb) => {
      const fileExt = extname(file.originalname);
      const fileName = `${uuid()}${fileExt}`;
      cb(null, fileName);
    },
  }),
};
