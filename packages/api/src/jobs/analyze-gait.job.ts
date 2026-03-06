import { db, footScans, gaitAnalyses } from '@amakasole/db';
import { eq } from 'drizzle-orm';
import { mlService } from '../services/ml.service';
import { gaitQueue } from '../lib/queue';

gaitQueue.process(async (job) => {
  const { scanId, videoKey } = job.data;

  // Update scan status
  await db.update(footScans).set({ status: 'ANALYZING' }).where(eq(footScans.id, scanId));

  try {
    // Call ML service
    const result = await mlService.analyzeGait(scanId, videoKey);

    // Upsert gait analysis
    const [existing] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scanId)).limit(1);

    if (existing) {
      await db.update(gaitAnalyses).set({
        pronationType: result.pronation_type || 'UNKNOWN',
        confidenceScore: result.confidence_score || 0,
        heatmapUrl: result.heatmap_url || null,
        analysisData: JSON.stringify(result.analysis_data || {}),
        analyzedAt: new Date(),
      }).where(eq(gaitAnalyses.id, existing.id));
    } else {
      await db.insert(gaitAnalyses).values({
        footScanId: scanId,
        videoKey,
        pronationType: result.pronation_type || 'UNKNOWN',
        confidenceScore: result.confidence_score || 0,
        heatmapUrl: result.heatmap_url || null,
        analysisData: JSON.stringify(result.analysis_data || {}),
      });
    }

    // Update scan status back to COMPLETE
    await db.update(footScans).set({ status: 'COMPLETE' }).where(eq(footScans.id, scanId));

    return { success: true, scanId };
  } catch (error) {
    await db.update(footScans).set({ status: 'FAILED' }).where(eq(footScans.id, scanId));
    throw error;
  }
});

gaitQueue.on('failed', (job, err) => {
  console.error(`Gait job ${job.id} failed:`, err.message);
});
