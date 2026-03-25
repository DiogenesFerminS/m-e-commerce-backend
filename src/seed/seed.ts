import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Product } from 'src/products/entities/product.entity';
import { ProductAttribute } from 'src/products/entities/productAttribute.entity';
import { ProductImage } from 'src/products/entities/productImage.entity';
import { Logger } from '@nestjs/common';
import { SEED_PRODUCTS } from './data/products.data';

dotenv.config();
const logger = new Logger('SEED');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_NAME,
  entities: [Product, ProductAttribute, ProductImage],
  synchronize: false,
});

const runSeed = async () => {
  try {
    logger.log('--- Connecting to the database... ---');
    await AppDataSource.initialize();
    logger.log('--- Connection established! ---');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      logger.log('--- Cleaning db ---');
      await queryRunner.query(
        'TRUNCATE TABLE products RESTART IDENTITY CASCADE',
      );

      for (const product of SEED_PRODUCTS) {
        const { attributes, images, ...rest } = product;

        const newProduct = queryRunner.manager.create(Product, rest);
        const savedProduct = await queryRunner.manager.save(
          Product,
          newProduct,
        );

        if (attributes.length > 0) {
          const attrEntities = attributes.map((attribute) =>
            queryRunner.manager.create(ProductAttribute, {
              name: attribute.name,
              value: attribute.value,
              product: savedProduct,
            }),
          );

          await queryRunner.manager.save(ProductAttribute, attrEntities);
        }

        if (images.length > 0) {
          const imgEntities = images.map((img) =>
            queryRunner.manager.create(ProductImage, {
              ...img,
              product: savedProduct,
            }),
          );

          await queryRunner.manager.save(ProductImage, imgEntities);
        }
      }

      await queryRunner.commitTransaction();
      logger.log('--- Seed process finished successfully! ---');
    } catch (error) {
      logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    logger.error(error);
  }
};

runSeed().catch((err) => logger.log(err));
