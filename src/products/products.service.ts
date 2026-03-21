import {
  BadRequestException,
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
import { removeFileFromUrl } from 'src/common/helpers/remove-file';

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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    {
      mainImageName,
      galleryNames,
    }: { mainImageName: string | null; galleryNames: string[] },
  ) {
    const imagesToDeleteFromDisk: string[] = [];

    const { imagesToDelete, ...dataToUpdate } = updateProductDto;
    const apiUrl = this.configService.get('API_URL') as string;

    const oldProduct = await this.findOne(id);

    if (!oldProduct) {
      throw new BadRequestException({
        ok: false,
        error: ResponseMessageType.BAD_REQUEST,
        message: 'Product not found',
      });
    }

    const currentMain = oldProduct.images.find((img) => img.isMain);

    const isDeletingMain =
      currentMain && imagesToDelete.includes(currentMain.id);

    if (isDeletingMain && !mainImageName) {
      throw new BadRequestException({
        ok: false,
        error: ResponseMessageType.BAD_REQUEST,
        message:
          'You cant delete the main image without uploading a new one to replace it.',
      });
    }

    const currentGalleryCount = oldProduct.images.filter((img) => !img.isMain);
    const newGalleryCount = galleryNames.length || 0;
    const galleryImagesToDelete = oldProduct.images.filter(
      (img) => !img.isMain && imagesToDelete.includes(img.id),
    );

    const totalCountGallery =
      currentGalleryCount.length -
      galleryImagesToDelete.length +
      newGalleryCount;

    if (totalCountGallery > 4) {
      throw new BadRequestException({
        ok: false,
        error: ResponseMessageType.BAD_REQUEST,
        message: 'The gallery must have maximum 4 images',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (Object.keys(dataToUpdate).length > 0) {
        await queryRunner.manager.update(Product, id, dataToUpdate);
      }

      let oldMainId: string | null = null;

      if (mainImageName != null) {
        const oldMain = oldProduct.images.find((image) => image.isMain);

        if (oldMain) {
          oldMainId = oldMain.id;
          await queryRunner.manager.delete(ProductImage, oldMain.id);
          imagesToDeleteFromDisk.push(oldMain.path);
        }

        await queryRunner.manager.save(ProductImage, {
          path: `${apiUrl}${mainImageName}`,
          isMain: true,
          product: oldProduct,
        });
      }

      if (imagesToDelete.length > 0) {
        const imagesToRemove = oldProduct.images.filter(
          (img) => imagesToDelete.includes(img.id) && img.id != oldMainId,
        );

        for (const img of imagesToRemove) {
          await queryRunner.manager.delete(ProductImage, img.id);
          imagesToDeleteFromDisk.push(img.path);
        }
      }

      if (galleryNames.length > 0) {
        const galleryEntities = galleryNames.map((name) => ({
          path: `${apiUrl}${name}`,
          isMain: false,
          product: oldProduct,
        }));
        await queryRunner.manager.save(ProductImage, galleryEntities);
      }

      await queryRunner.commitTransaction();
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

    await removeFileFromUrl(imagesToDeleteFromDisk);
    return 'Product Updated';
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
