import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_image')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  fileName: string;

  @Column({ default: false })
  isMain: boolean;

  @ManyToMany(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
