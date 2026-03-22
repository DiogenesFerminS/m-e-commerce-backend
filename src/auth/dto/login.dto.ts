import { emailRegex } from 'src/common/schemas/regex';
import z from 'zod/v4';

export const loginSchema = z.object({
  email: z
    .string({
      error: (iss) => {
        if (iss.input === undefined) {
          return 'Email is required';
        }

        if (typeof iss.input !== 'string') {
          return 'Email must be a string';
        }
      },
    })
    .regex(emailRegex, 'Invalid Email')
    .max(255, 'The email is too long')
    .trim()
    .toLowerCase(),
  password: z
    .string({
      error: (iss) => {
        if (iss.input === undefined) {
          return 'Password is required';
        }

        if (typeof iss.input !== 'string') {
          return 'Password must be a string';
        }
      },
    })
    .min(8, 'The password is too short')
    .max(16, 'The password is too long')
    .trim(),
});

export type LoginDto = z.infer<typeof loginSchema>;
