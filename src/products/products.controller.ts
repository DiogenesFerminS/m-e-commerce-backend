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
  UseFilters,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
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
import { multerConfig } from 'src/common/helpers/multer.config';
import * as fs from 'fs';
import { MulterFilter } from 'src/common/exeption-filters/multer.filter';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseFilters(MulterFilter)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'gallery', maxCount: 4 },
      ],
      multerConfig,
    ),
  )
  async create(
    @Res({ passthrough: true }) response: Response,
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const cleanupFiles = () => {
      if (files?.mainImage)
        files.mainImage.forEach(
          (f) => fs.existsSync(f.path) && fs.unlinkSync(f.path),
        );
      if (files?.gallery)
        files.gallery.forEach(
          (f) => fs.existsSync(f.path) && fs.unlinkSync(f.path),
        );
    };

    if (!files?.mainImage || files.mainImage.length === 0) {
      cleanupFiles();
      throw new BadRequestException({
        ok: false,
        message: 'The main Image is required',
        error: ResponseMessageType.BAD_REQUEST,
      });
    }

    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      cleanupFiles();
      const zodErrors = result.error.issues.map((err) => err.message);
      throw new BadRequestException({
        ok: false,
        message: zodErrors.join(', '),
        error: ResponseMessageType.BAD_REQUEST,
      });
    }

    const mainImageName = files.mainImage[0].filename;
    const galleryNames = files.gallery?.map((f) => f.filename) || [];

    try {
      const newProduct = await this.productsService.create(result.data, {
        mainImage: mainImageName,
        gallery: galleryNames,
      });

      response.statusCode = 201;

      return {
        ok: true,
        message: ResponseMessageType.CREATED,
        data: newProduct,
      };
    } catch (error) {
      cleanupFiles();
      throw error as unknown;
    }
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
