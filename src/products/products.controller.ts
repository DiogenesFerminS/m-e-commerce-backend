import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  type CreateProductDto,
  createProductSchema,
  type UpdateProductDto,
  updateProductSchema,
} from './dto';
import { ZodValidationPipe } from 'src/common/pipes/zodValidation.pipe';
import { type Response } from 'express';
import { ResponseMessageType } from 'src/common/interfaces/http.response';
import {
  type PaginationDto,
  paginationSchema,
} from 'src/common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Res({ passthrough: true }) response: Response,
    @Body(new ZodValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
  ) {
    const newProduct = await this.productsService.create(createProductDto);

    response.statusCode = 201;

    return {
      ok: true,
      message: ResponseMessageType.CREATED,
      data: newProduct,
    };
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationSchema))
    paginationDto: PaginationDto,
  ) {
    const allProducts = await this.productsService.findAll(paginationDto);
    return {
      ok: true,
      message: ResponseMessageType.OK,
      data: allProducts,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException({
        ok: false,
        message: ResponseMessageType.NOT_FOUND,
        error: 'Product not found',
      });
    }

    return {
      ok: true,
      message: ResponseMessageType.OK,
      data: product,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(id, updateProductDto);

    return {
      ok: true,
      message: ResponseMessageType.UPDATED,
      data: 'Product updated',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productsService.remove(id);

    return {
      ok: true,
      message: ResponseMessageType.SUCCESS,
      data: 'Product deleted',
    };
  }
}
