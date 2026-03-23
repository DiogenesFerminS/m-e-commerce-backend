import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Product } from 'src/products/entities/product.entity';
import { ProductAttribute } from 'src/products/entities/productAttribute.entity';
import { ProductImage } from 'src/products/entities/productImage.entity';
import { Logger } from '@nestjs/common';

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
  logger.log('--- Connecting to the database... ---');
  await AppDataSource.initialize();
  logger.log('--- Connection established! ---');
};

runSeed().catch((err) => logger.log(err));
