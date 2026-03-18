import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { handleError } from 'src/common/helpers/handlers-errors';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseMessageType } from 'src/common/interfaces/http.response';
import { type UpdateProductDto, type CreateProductDto } from './dto';

@Injectable()
export class ProductsService {
  private handlerError = handleError;
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const newProducts = this.productsRepository.create(createProductDto);

    try {
      await this.productsRepository.save(newProducts);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    const [allProducts, productsCount] =
      await this.productsRepository.findAndCount({
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
    const product = await this.productsRepository.findOne({ where: { id } });
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
