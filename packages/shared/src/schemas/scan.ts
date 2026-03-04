import { z } from 'zod';

export const uploadUrlSchema = z.object({
  foot: z.enum(['LEFT', 'RIGHT'], { required_error: 'Foot side is required' }),
  fileType: z.enum(['STL', 'OBJ', 'PLY'], { required_error: 'File type is required' }),
});

export const confirmScanSchema = z.object({
  foot: z.enum(['LEFT', 'RIGHT'], { required_error: 'Foot side is required' }),
});

export const gaitUploadUrlSchema = z.object({
  scanId: z.string().uuid('Invalid scan ID'),
});

export const analyzeGaitSchema = z.object({
  scanId: z.string().uuid('Invalid scan ID'),
});

export type UploadUrlInput = z.infer<typeof uploadUrlSchema>;
export type ConfirmScanInput = z.infer<typeof confirmScanSchema>;
export type GaitUploadUrlInput = z.infer<typeof gaitUploadUrlSchema>;
export type AnalyzeGaitInput = z.infer<typeof analyzeGaitSchema>;
