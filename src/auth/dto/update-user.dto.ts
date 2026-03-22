import z from 'zod/v4';
import { createUserSchema } from './create-user.dto';

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
