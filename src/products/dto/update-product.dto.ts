import z from 'zod/v4';
import { createProductSchema } from './create-product.dto';

export const updateProductSchema = createProductSchema.partial().extend({
  imagesToDelete: z
    .array(z.string('The imagesToDelete must be a string').optional())
    .max(3)
    .optional()
    .default([]),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
