import z from 'zod/v4';
import { ProductCategory } from '../interfaces/product-category.enum';

export const paginationSchema = z.object({
  category: z
    .enum(
      ProductCategory,
      'Invalid category, the valid categories are guitar, bass guitar, drum, accessories',
    )
    .optional(),
  page: z.coerce
    .number()
    .int({ message: 'page must be a positive number' })
    .min(1, { message: 'page too short' })
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50, { message: 'The limit is 50 products' })
    .default(10),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
