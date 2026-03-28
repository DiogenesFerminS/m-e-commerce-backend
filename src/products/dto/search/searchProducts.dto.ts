import { paginationSchema } from 'src/common/dto/pagination.dto';
import { ProductCategory } from 'src/common/interfaces/product-category.enum';
import z from 'zod/v4';

export const searchProductsSchema = paginationSchema.extend({
  category: z
    .enum(
      ProductCategory,
      'Invalid category, the valid categories are guitar, bass guitar, drum, accessories',
    )
    .optional(),
});

export type SearchProductDto = z.infer<typeof searchProductsSchema>;
