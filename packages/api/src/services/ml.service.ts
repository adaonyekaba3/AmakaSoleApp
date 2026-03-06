const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function mlRequest(path: string, body: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${ML_SERVICE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ML service error (${res.status}): ${text}`);
  }
  return res.json();
}

export const mlService = {
  async processScan(scanId: string, leftFootKey: string | null, rightFootKey: string | null) {
    return mlRequest('/process-scan', { scan_id: scanId, left_foot_key: leftFootKey, right_foot_key: rightFootKey });
  },

  async analyzeGait(scanId: string, videoKey: string) {
    return mlRequest('/analyze-gait', { scan_id: scanId, video_key: videoKey });
  },

  async generateOrthotic(params: {
    scanId: string;
    measurements: unknown;
    gaitData: unknown;
    shoeType: string;
    useCase: string;
    material: string;
    archHeightPref: string;
  }) {
    return mlRequest('/generate-orthotic', {
      scan_id: params.scanId,
      measurements: params.measurements,
      gait_data: params.gaitData,
      shoe_type: params.shoeType,
      use_case: params.useCase,
      material: params.material,
      arch_height_pref: params.archHeightPref,
    });
  },
};
