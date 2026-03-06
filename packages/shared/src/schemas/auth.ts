import { z } from 'zod';

// Password validation: min 8 chars, 1 uppercase, 1 number
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const appleAuthSchema = z.object({
  identityToken: z.string().min(1, 'Identity token is required'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AppleAuthInput = z.infer<typeof appleAuthSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
