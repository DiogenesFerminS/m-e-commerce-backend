import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Envs, envsSchema } from './common/schemas/envs.schemas';
import { Product } from './products/entities/product.entity';
import { ProductImage } from './products/entities/productImage.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductAttribute } from './products/entities/productAttribute.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envsSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './uploads'),
    }),
    ProductsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Envs>) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASS'),
        database: configService.get('POSTGRES_NAME'),
        entities: [Product, ProductImage, ProductAttribute, User],
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
