import { z } from 'zod';
import { ROLES } from '../config/constants';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.nativeEnum(ROLES).optional(),
    department: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.nativeEnum(ROLES).optional(),
    department: z.string().optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(8).optional(),
  }),
});
