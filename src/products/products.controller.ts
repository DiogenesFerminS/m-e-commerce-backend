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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'gallery', maxCount: 4 },
      ],
      {
        storage: diskStorage({
          destination: './static/products',
          filename: (req, file, cb) => {
            const fileName = `${uuid()}${path.extname(file.originalname)}`;
            cb(null, fileName);
          },
        }),
      },
    ),
  )
  async create(
    @Res({ passthrough: true }) response: Response,
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body(new ZodValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
  ) {
    if (!files.mainImage || files.mainImage.length === 0) {
      throw new BadRequestException({
        ok: false,
        message: ResponseMessageType.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    const mainImageName = files.mainImage[0].filename;
    const galleryNames = files.gallery?.map((f) => f.filename) || [];
    //TODO: CREATE PRODUCTIMAGE GUARDAR LAS IMAGENES EN DB TESTEAR AÑADIR VALIDACIONES
    console.log({ mainImageName, galleryNames });
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
