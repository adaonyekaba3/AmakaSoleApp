import { useState, useCallback } from 'react';
import { useAmakaFit } from './AmakaFitProvider';
import { OrthoticDesignResult } from './types';

interface GenerateParams {
  scanId: string;
  shoeType?: string;
  useCase?: string;
  material?: string;
  archHeightPref?: string;
}

export function useOrthoticDesign() {
  const { apiRequest } = useAmakaFit();
  const [isGenerating, setIsGenerating] = useState(false);
  const [design, setDesign] = useState<OrthoticDesignResult | null>(null);

  const generateDesign = useCallback(async (params: GenerateParams): Promise<OrthoticDesignResult> => {
    setIsGenerating(true);
    try {
      const result = await apiRequest('/api/partners/generate-orthotic', {
        method: 'POST',
        body: JSON.stringify({
          scanId: params.scanId,
          shoeType: params.shoeType || 'SNEAKER',
          useCase: params.useCase || 'EVERYDAY',
          material: params.material || 'EVA_FOAM',
          archHeightPref: params.archHeightPref || 'MEDIUM',
        }),
      });

      const designResult: OrthoticDesignResult = {
        orthoticId: result.data.orthoticDesignId,
        status: result.data.status,
        shoeType: params.shoeType || 'SNEAKER',
        useCase: params.useCase || 'EVERYDAY',
        material: params.material || 'EVA_FOAM',
      };

      setDesign(designResult);
      return designResult;
    } finally {
      setIsGenerating(false);
    }
  }, [apiRequest]);

  return { generateDesign, isGenerating, design };
}
