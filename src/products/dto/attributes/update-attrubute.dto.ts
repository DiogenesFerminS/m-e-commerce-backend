import z from 'zod/v4';
import { createAttributeSchema } from './create-attribute.dto';
import { updateProductSchema } from '../update-product.dto';

export const updateAttributeSchema = createAttributeSchema.partial();
export type UpdateAttributeDto = z.infer<typeof updateProductSchema>;
