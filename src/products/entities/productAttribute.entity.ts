import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_attribute')
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
