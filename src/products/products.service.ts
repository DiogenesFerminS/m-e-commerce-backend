import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { handleError } from 'src/common/helpers/handlers-errors';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseMessageType } from 'src/common/interfaces/http.response';
import { type UpdateProductDto, type CreateProductDto } from './dto';
import { ProductImage } from './entities/productImage.entity';
import { ConfigService } from '@nestjs/config';
import { Envs } from 'src/common/schemas/envs.schemas';

@Injectable()
export class ProductsService {
  private handlerError = handleError;
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    // private readonly productsImageRepository: Repository<ProductImage>,
    private readonly configService: ConfigService<Envs>,
    private dataSource: DataSource,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    { mainImage, gallery }: { mainImage: string; gallery: string[] },
  ) {
    const apiUrl = this.configService.get('API_URL') as string;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newProduct = queryRunner.manager.create(Product, createProductDto);
      const savedProduct = await queryRunner.manager.save(newProduct);

      const imagesToSave = [
        queryRunner.manager.create(ProductImage, {
          path: `${apiUrl}${mainImage}`,
          isMain: true,
          product: { id: savedProduct.id },
        }),

        ...gallery.map((image) =>
          queryRunner.manager.create(ProductImage, {
            path: `${apiUrl}${image}`,
            isMain: false,
            product: { id: savedProduct.id },
          }),
        ),
      ];

      await queryRunner.manager.save(ProductImage, imagesToSave);

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        ok: false,
        message: 'An unexpected error has ocurred to save data',
        error: ResponseMessageType.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    const [allProducts, productsCount] =
      await this.productsRepository.findAndCount({
        relations: ['images'],
        take: limit,
        skip: skip,
      });
    return {
      products: allProducts,
      meta: {
        total: productsCount,
        page: page,
        limit: limit,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.productsRepository.update(
        id,
        updateProductDto,
      );

      return updatedProduct;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException({
        ok: true,
        message: ResponseMessageType.NOT_FOUND,
        error: 'Product not found',
      });
    }

    try {
      await this.productsRepository.softDelete(id);
    } catch (error) {
      this.handlerError(error);
    }
  }
}
