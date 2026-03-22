import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, type CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { handleError } from 'src/common/helpers/handlers-errors';
import { ResponseMessageType } from 'src/common/interfaces/http.response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private handleError: (error: unknown) => never;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.handleError = handleError;
  }

  async login(loginDto: LoginDto) {
    const user = await this.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({
        ok: false,
        message: ResponseMessageType.UNAUTHORIZED,
        error: 'Invalid credentials',
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException({
        ok: false,
        message: ResponseMessageType.UNAUTHORIZED,
        error: 'Invalid credentials',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;

    const payload = { sub: user.id, fullName: user.fullName };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const roundOrSalt = this.configService.get(
      'BCRYPT_ROUND_OR_SALT',
    ) as number;

    const passwordHashed = await bcrypt.hash(
      createUserDto.password,
      roundOrSalt,
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: passwordHashed,
    });

    try {
      const userSaved = await this.userRepository.save(newUser);
      return userSaved;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });

    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new BadRequestException({
        ok: false,
        message: ResponseMessageType.BAD_REQUEST,
        error: 'Invalid id, user not found',
      });
    }

    try {
      await this.userRepository.softDelete(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: {
        password: true,
        email: true,
        fullName: true,
        id: true,
        createdAt: true,
        deletedAt: true,
      },
    });

    return user;
  }
}
