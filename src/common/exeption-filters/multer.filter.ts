import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { ResponseMessageType } from '../interfaces/http.response';

@Catch(BadRequestException)
export class MulterFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const multerMessage = this.getExeptionMessage(exception.message);

    if (!multerMessage) {
      return response.status(400).json({
        ok: false,
        error: exception.message,
        message: ResponseMessageType.BAD_REQUEST,
      });
    }

    return response.status(400).json({
      ok: false,
      error: multerMessage,
      message: ResponseMessageType.BAD_REQUEST,
    });
  }

  getExeptionMessage(message: string): string | null {
    if (message.includes('Unexpected field') && message.includes('gallery')) {
      return 'You have exceeded the allowed image limit (Maximum 1 main and 4 gallery).';
    }

    return null;
  }
}
