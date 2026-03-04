import { z } from 'zod';

export const generateOrthoticSchema = z.object({
  scanId: z.string().uuid('Invalid scan ID'),
  shoeType: z.enum(['HEEL', 'SNEAKER', 'BOOT', 'LOAFER', 'SANDAL', 'SPORT']),
  useCase: z.enum(['EVERYDAY', 'SPORT', 'MEDICAL']),
  material: z.enum(['EVA_FOAM', 'MEMORY_FOAM', 'CARBON_FIBER', 'PREMIUM']),
  archHeightPref: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export const updateOrthoticSchema = z.object({
  shoeType: z.enum(['HEEL', 'SNEAKER', 'BOOT', 'LOAFER', 'SANDAL', 'SPORT']).optional(),
  useCase: z.enum(['EVERYDAY', 'SPORT', 'MEDICAL']).optional(),
  material: z.enum(['EVA_FOAM', 'MEMORY_FOAM', 'CARBON_FIBER', 'PREMIUM']).optional(),
  archHeightPref: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export type GenerateOrthoticInput = z.infer<typeof generateOrthoticSchema>;
export type UpdateOrthoticInput = z.infer<typeof updateOrthoticSchema>;
