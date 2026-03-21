import z from 'zod/v4';
import { createProductSchema } from './create-product.dto';

export const updateProductSchema = createProductSchema.partial().extend({
  imagesToDelete: z.preprocess((val) => {
    if (!val) return [];

    if (Array.isArray(val)) return val as string[];
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val) as string[];
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return val
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return val;
  }, z.array(z.string()).max(3).optional().default([])),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
