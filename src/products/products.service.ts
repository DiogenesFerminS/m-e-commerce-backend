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
import {
  type UpdateProductDto,
  type CreateProductDto,
  CreateAttributeDto,
} from './dto';
import { ProductImage } from './entities/productImage.entity';
import { ConfigService } from '@nestjs/config';
import { Envs } from 'src/common/schemas/envs.schemas';
import { removeFilesFromNames } from 'src/common/helpers/remove-file';
import { ProductAttribute } from './entities/productAttribute.entity';
import { isDatabaseError } from 'src/common/helpers/is-database-error';

@Injectable()
export class ProductsService {
  private handlerError = handleError;
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private readonly attributesRepository: Repository<ProductAttribute>,
    private readonly configService: ConfigService<Envs>,
    private dataSource: DataSource,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    { mainImage, gallery }: { mainImage: string; gallery: string[] },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newProduct = queryRunner.manager.create(Product, createProductDto);
      const savedProduct = await queryRunner.manager.save(newProduct);

      const imagesToSave = [
        queryRunner.manager.create(ProductImage, {
          path: mainImage,
          isMain: true,
          product: { id: savedProduct.id },
        }),

        ...gallery.map((image) =>
          queryRunner.manager.create(ProductImage, {
            path: image,
            isMain: false,
            product: { id: savedProduct.id },
          }),
        ),
      ];

      await queryRunner.manager.save(ProductImage, imagesToSave);

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (isDatabaseError(error)) {
        if (error.code === '23505') {
          const match = error.detail?.match(/\((.*?)\)/);
          const field = match ? match[1] : 'unknown field';
          throw new BadRequestException({
            ok: false,
            error: ResponseMessageType.BAD_REQUEST,
            message: `This ${field} already exists`,
          });
        }
        throw new BadRequestException({
          ok: false,
          error: ResponseMessageType.BAD_REQUEST,
          message: error.detail,
        });
      }

      throw new BadRequestException({
        ok: false,
        error: ResponseMessageType.BAD_REQUEST,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto, category: string | undefined) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.images', 'images')
      .leftJoinAndSelect('products.attributes', 'attributes');

    if (category) {
      queryBuilder.andWhere('products.category = :category', { category });
    }

    queryBuilder.take(limit).skip(skip).orderBy('products.createdAt', 'DESC');

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products: products,
      meta: {
        total: total,
        page: page,
        limit: limit,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['images', 'attributes'],
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

    const oldProduct = await this.findOne(id);

    if (!oldProduct) {
      throw new BadRequestException({
        ok: false,
        error: ResponseMessageType.BAD_REQUEST,
        message: 'Product not found',
      });
    }

    if (imagesToDelete.length > 0) {
      const productImagesIds = oldProduct.images
        .map((img) => (img.isMain ? null : img.id))
        .filter((img) => img != null);

      const areValidIds = imagesToDelete.every((id) =>
        productImagesIds.includes(id),
      );

      if (!areValidIds) {
        throw new BadRequestException({
          ok: false,
          error: ResponseMessageType.BAD_REQUEST,
          message: 'Images ids invalid, images not found',
        });
      }
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
          path: mainImageName,
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
          path: name,
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

    await removeFilesFromNames(imagesToDeleteFromDisk);
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

  async createAttribute(
    createAttributeDto: CreateAttributeDto,
    productId: string,
  ) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException({
        ok: false,
        message: ResponseMessageType.NOT_FOUND,
        error: 'Product not found',
      });
    }

    const newAttribute = this.attributesRepository.create({
      value: createAttributeDto.value.toLowerCase(),
      name: createAttributeDto.name.toLowerCase(),
      product: product,
    });

    try {
      const savedAttribute = await this.attributesRepository.save(newAttribute);
      return savedAttribute;
    } catch (error: unknown) {
      this.handlerError(error);
    }
  }

  async deleteAttribute(attributeId: string) {
    const attribute = await this.attributesRepository.findOne({
      where: { id: attributeId },
    });

    if (!attribute) {
      throw new BadRequestException({
        ok: false,
        message: ResponseMessageType.BAD_REQUEST,
        error: 'Invalid id, attribute not found',
      });
    }

    try {
      await this.attributesRepository.delete(attributeId);
      return 'Attribute deleted';
    } catch (error) {
      this.handlerError(error);
    }
  }
}
