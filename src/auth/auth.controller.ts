import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  createUserSchema,
  type LoginDto,
  loginSchema,
  type CreateUserDto,
} from './dto';
import { ZodValidationPipe } from 'src/common/pipes/zodValidation.pipe';
import { ResponseMessageType } from 'src/common/interfaces/http.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto) {
    const response = await this.authService.login(loginDto);

    return {
      ok: true,
      message: ResponseMessageType.SUCCESS,
      data: response,
    };
  }

  @Post('/user')
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    const newUser = await this.authService.create(createUserDto);

    return {
      ok: true,
      message: ResponseMessageType.CREATED,
      data: newUser,
    };
  }

  @Get('user/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.authService.findOne(id);
    return {
      ok: true,
      message: ResponseMessageType.SUCCESS,
      data: user,
    };
  }

  @Delete('user/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.authService.remove(id);

    return {
      ok: true,
      message: ResponseMessageType.DELETED,
      data: 'User deactivated',
    };
  }
}
