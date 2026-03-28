import { BadRequestException } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs/promises';
import { ResponseMessageType } from '../interfaces/http.response';

export const removeFilesFromNames = async (imageNames: string[]) => {
  if (!imageNames || imageNames.length === 0) return;

  const deletePromises = imageNames.map((img) => {
    const filePath = path.join(process.cwd(), 'uploads', 'products', img);
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
