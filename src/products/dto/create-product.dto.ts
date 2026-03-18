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
    stock: z
      .number('The stock must be a number')
      .positive('The stock must be a postive number'),
    price: z
      .number('The price must be a number')
      .positive('The price must be a postive number'),
  },
  'Invalid input, the input must be a object',
);

export type CreateProductDto = z.infer<typeof createProductSchema>;
