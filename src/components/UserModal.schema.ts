import { z } from 'zod';

export const userFormSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(80, { message: 'Name must be 80 characters or less' }),
    ),

  email: z.string().trim().email({ message: 'Invalid email address' }),

  city: z
    .string()
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, { message: 'City must be at least 2 characters' })
        .max(60, { message: 'City must be 60 characters or less' }),
    ),

  avatar: z
    .string()
    .trim()
    .url({ message: 'Must be a valid URL (starting with http:// or https://)' }),
});

export type UserFormData = z.infer<typeof userFormSchema>;
