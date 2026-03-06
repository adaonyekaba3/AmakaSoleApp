export interface AmakaFitConfig {
  apiKey: string;
  apiUrl?: string;
  onError?: (error: Error) => void;
}

export interface ScanResult {
  scanId: string;
  status: string;
  measurements?: {
    left?: FootMeasurement;
    right?: FootMeasurement;
  };
}

export interface FootMeasurement {
  length_mm: number;
  width_mm: number;
  arch_height_mm: number;
  heel_width_mm: number;
  ball_width_mm: number;
}

export interface OrthoticDesignResult {
  orthoticId: string;
  status: string;
  shoeType: string;
  useCase: string;
  material: string;
  cadSpec?: Record<string, unknown>;
  previewImageUrl?: string;
}

export interface GaitResult {
  pronationType: string;
  confidenceScore: number;
  analysisData?: Record<string, unknown>;
}
