import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    career_goal: z.string().min(2, 'Career goal must be at least 2 characters').max(100).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(2).optional(),
  }),
});
