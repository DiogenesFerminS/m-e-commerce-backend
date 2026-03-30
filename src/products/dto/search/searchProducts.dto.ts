import { paginationSchema } from 'src/common/dto/pagination.dto';
import { PriceSort } from 'src/common/interfaces/price-sort.enum';
import { ProductCategory } from 'src/common/interfaces/product-category.enum';
import z from 'zod/v4';

const validTypes = ['electric', 'acoustic'];

export const searchProductsSchema = paginationSchema.extend({
  category: z
    .enum(
      ProductCategory,
      'Invalid category, the valid categories are guitar, bass guitar, drum, accessories',
    )
    .optional(),
  sort: z
    .enum(
      PriceSort,
      'Invalid sort the valid order are "price_asc" and "price_desc" ',
    )
    .optional(),
  brand: z.string().optional(),
  type: z
    .enum(validTypes, 'Invalid Type, the valid types are electric, acoustic')
    .optional(),
});

export type SearchProductDto = z.infer<typeof searchProductsSchema>;
