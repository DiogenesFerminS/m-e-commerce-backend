import z from 'zod/v4';

export const createAttributeSchema = z.object({
  name: z
    .string({
      error: (iss) => {
        if (iss.input === undefined) {
          return 'The name is required';
        }

        if (typeof iss.input !== 'string') {
          return 'The name must be a string';
        }
      },
    })
    .min(3, 'The name must have 3 characters at least')
    .max(255, 'The name must have maximum 255 characters')
    .trim(),
  value: z
    .string({
      error: (iss) => {
        if (iss.input === undefined) {
          return 'The value is required';
        }

        if (typeof iss.input !== 'string') {
          return 'The value must be a string';
        }
      },
    })
    .min(3, 'The value must have 3 characters at least')
    .max(255, 'The name must have maximum 255 characters')
    .trim(),
});

export type CreateAttributeDto = z.infer<typeof createAttributeSchema>;
