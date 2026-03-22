import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/productImage.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ProductAttribute } from './entities/productAttribute.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductAttribute]),
    MulterModule.register({
      dest: './uploads/products',
    }),
  ],
})
export class ProductsModule {}
