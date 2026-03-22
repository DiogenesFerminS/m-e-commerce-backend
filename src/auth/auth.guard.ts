import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type Request } from 'express';
import { ResponseMessageType } from 'src/common/interfaces/http.response';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Envs } from 'src/common/schemas/envs.schemas';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Envs>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: { id: string } }>();

    const token = request.cookies['access_token'] as string | undefined;

    if (!token) {
      throw new UnauthorizedException({
        ok: false,
        message: ResponseMessageType.UNAUTHORIZED,
        error: 'Authentication cookie not found',
      });
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      request.user = { id: payload.sub };
    } catch (error) {
      throw new UnauthorizedException({
        ok: false,
        error:
          error instanceof Error
            ? (error.message ?? 'Invalid token')
            : 'Invalid token',
        message: ResponseMessageType.UNAUTHORIZED,
      });
    }

    return true;
  }
}
