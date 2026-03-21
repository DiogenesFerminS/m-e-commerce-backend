import { BadRequestException } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs/promises';
import { ResponseMessageType } from '../interfaces/http.response';

export const removeFileFromUrl = async (urls: string[]) => {
  if (!urls || urls.length === 0) return;

  const deletePromises = urls.map((url) => {
    const parsedUrl = new URL(url);
    const cleanPath = parsedUrl.pathname;

    const fileName = cleanPath.split('/').pop();

    if (!fileName) {
      throw new BadRequestException({
        ok: false,
        message: ResponseMessageType.BAD_REQUEST,
        error: 'File name not found',
      });
    }
    const filePath = path.join(process.cwd(), 'uploads', 'products', fileName);
    return fs.unlink(filePath);
  });

  const results = await Promise.allSettled(deletePromises);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      throw new BadRequestException({
        ok: false,
        message: ResponseMessageType.BAD_REQUEST,
        error: 'Delete file failed',
      });
    }
  });
};
