import { ProductCategory } from 'src/common/interfaces/product-category.enum';
import z from 'zod/v4';

export const createProductSchema = z.object(
  {
    name: z
      .string({
        error: (iss) => {
          if (iss.input === undefined) {
            return "The product name can't be empty";
          }

          if (typeof iss.input != 'string') {
            return 'The product name must be a string';
          }
        },
      })
      .min(3, 'The product name must have 3 characters at least')
      .max(255, 'The product name must have maximum of 255 characters')
      .trim(),
    description: z
      .string({
        error: (iss) => {
          if (iss.input === undefined) {
            return "The product description can't be empty";
          }

          if (typeof iss.input !== 'string') {
            return 'The product description must be a string';
          }
        },
      })
      .min(20, 'The product name must have 3 characters at least')
      .max(3000, 'The product name must have maximum of 3000 characters')
      .trim(),
    stock: z.coerce
      .number('The stock must be a number')
      .positive('The stock must be a postive number'),
    price: z.coerce
      .number('The price must be a number')
      .positive('The price must be a postive number'),
    category: z.enum(
      ProductCategory,
      'Invalid category, the valid categories are guitar, bass guitar, drum, accessories',
    ),
  },
  'Invalid input, the input must be a object',
);

export type CreateProductDto = z.infer<typeof createProductSchema>;
