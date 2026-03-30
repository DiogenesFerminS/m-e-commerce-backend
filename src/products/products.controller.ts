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
  type CreateAttributeDto,
  createAttributeSchema,
  createProductSchema,
  updateProductSchema,
  searchProductsSchema,
  type SearchProductDto,
} from './dto';
import { ZodValidationPipe } from 'src/common/pipes/zodValidation.pipe';
import { type Response } from 'express';
import { ResponseMessageType } from 'src/common/interfaces/http.response';
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

  @Post(':id/attribute')
  async createAttribute(
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(createAttributeSchema))
    createAttributeDto: CreateAttributeDto,
  ) {
    const newAttribute = await this.productsService.createAttribute(
      createAttributeDto,
      id,
    );

    response.statusCode = 201;

    return {
      ok: true,
      message: ResponseMessageType.CREATED,
      data: newAttribute,
    };
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(searchProductsSchema))
    searchProductDto: SearchProductDto,
  ) {
    const allProducts = await this.productsService.findAll(searchProductDto);
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
  async update(
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Param('id', ParseUUIDPipe) id: string,
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

    const result = updateProductSchema.safeParse(body);
    if (!result.success) {
      cleanupFiles();
      const zodErrors = result.error.issues.map((err) => err.message);
      throw new BadRequestException({
        ok: false,
        message: zodErrors.join(', '),
        error: ResponseMessageType.BAD_REQUEST,
      });
    }
    const mainImageName = files.mainImage ? files.mainImage[0].fieldname : null;
    const galleryNames = files.gallery?.map((f) => f.filename) || [];

    try {
      const resp = await this.productsService.update(id, result.data, {
        mainImageName,
        galleryNames,
      });

      return {
        ok: true,
        message: ResponseMessageType.UPDATED,
        data: resp,
      };
    } catch (error) {
      cleanupFiles();
      throw error as unknown;
    }
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

  @Delete(':id/attribute')
  async removeAttribute(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.productsService.deleteAttribute(id);

    return {
      ok: true,
      message: ResponseMessageType.DELETED,
      data: response,
    };
  }
}
