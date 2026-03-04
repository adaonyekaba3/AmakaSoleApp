import { z } from 'zod';
import { ShoeType } from '../types/enums';

// ============================================================================
// Update Profile Schemas
// ============================================================================

export const updateProfileSchema = z.object({
  firstName: z.string()
    .min(1, 'First name cannot be empty')
    .max(100, 'First name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters')
    .optional(),
  lastName: z.string()
    .min(1, 'Last name cannot be empty')
    .max(100, 'Last name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters')
    .optional(),
  dateOfBirth: z.string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'))
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 13 && age <= 120;
      },
      { message: 'User must be between 13 and 120 years old' }
    ),
  weightKg: z.number()
    .positive('Weight must be positive')
    .max(500, 'Weight must be realistic')
    .optional(),
  heightCm: z.number()
    .positive('Height must be positive')
    .min(50, 'Height must be at least 50cm')
    .max(300, 'Height must not exceed 300cm')
    .optional(),
  primaryActivity: z.array(
    z.string().min(1).max(100)
  )
    .max(10, 'Cannot have more than 10 primary activities')
    .optional(),
  knownConditions: z.array(
    z.string().min(1).max(200)
  )
    .max(20, 'Cannot have more than 20 known conditions')
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================================
// Shoe Collection Schemas
// ============================================================================

export const shoeCollectionItemSchema = z.object({
  id: z.string().uuid(),
  brand: z.string()
    .min(1, 'Brand is required')
    .max(100, 'Brand must not exceed 100 characters'),
  model: z.string()
    .min(1, 'Model is required')
    .max(100, 'Model must not exceed 100 characters'),
  shoeType: z.nativeEnum(ShoeType, {
    errorMap: () => ({ message: 'Invalid shoe type' }),
  }),
  size: z.string()
    .min(1, 'Size is required')
    .max(20, 'Size must not exceed 20 characters'),
  purchaseDate: z.string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'))
    .optional(),
  isActive: z.boolean().default(true),
});

export type ShoeCollectionItemInput = z.infer<typeof shoeCollectionItemSchema>;

export const updateShoeCollectionSchema = z.object({
  shoes: z.array(shoeCollectionItemSchema)
    .max(50, 'Cannot have more than 50 shoes in collection'),
});

export type UpdateShoeCollectionInput = z.infer<typeof updateShoeCollectionSchema>;

export const addShoeToCollectionSchema = z.object({
  brand: z.string()
    .min(1, 'Brand is required')
    .max(100, 'Brand must not exceed 100 characters'),
  model: z.string()
    .min(1, 'Model is required')
    .max(100, 'Model must not exceed 100 characters'),
  shoeType: z.nativeEnum(ShoeType),
  size: z.string()
    .min(1, 'Size is required')
    .max(20, 'Size must not exceed 20 characters'),
  purchaseDate: z.string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'))
    .optional(),
});

export type AddShoeToCollectionInput = z.infer<typeof addShoeToCollectionSchema>;

export const removeShoeFromCollectionSchema = z.object({
  shoeId: z.string().uuid('Invalid shoe ID'),
});

export type RemoveShoeFromCollectionInput = z.infer<typeof removeShoeFromCollectionSchema>;

// ============================================================================
// Get Profile Schemas
// ============================================================================

export const getProfileResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    authProvider: z.string(),
    role: z.string(),
    isEmailVerified: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  profile: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    dateOfBirth: z.date().nullable(),
    weightKg: z.number().nullable(),
    heightCm: z.number().nullable(),
    primaryActivity: z.array(z.string()).nullable(),
    knownConditions: z.array(z.string()).nullable(),
    shoeCollection: z.string(),
    footHealthScore: z.number(),
    updatedAt: z.date(),
  }).nullable(),
});

// ============================================================================
// Health Score Calculation Schema
// ============================================================================

export const calculateHealthScoreSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export type CalculateHealthScoreInput = z.infer<typeof calculateHealthScoreSchema>;

export const calculateHealthScoreResponseSchema = z.object({
  footHealthScore: z.number().min(0).max(100),
  factors: z.object({
    scanQuality: z.number().min(0).max(100),
    gaitAnalysis: z.number().min(0).max(100),
    activityLevel: z.number().min(0).max(100),
    orthoticUsage: z.number().min(0).max(100),
  }),
  recommendations: z.array(z.string()),
});

// ============================================================================
// Delete Profile Schema
// ============================================================================

export const deleteProfileSchema = z.object({
  confirmDelete: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm profile deletion' }),
  }),
});

export type DeleteProfileInput = z.infer<typeof deleteProfileSchema>;
