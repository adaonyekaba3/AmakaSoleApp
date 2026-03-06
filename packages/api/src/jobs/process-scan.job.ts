import { db, footScans } from '@amakasole/db';
import { eq } from 'drizzle-orm';
import { mlService } from '../services/ml.service';
import { scanQueue } from '../lib/queue';

scanQueue.process(async (job) => {
  const { scanId } = job.data;

  // Update status to PROCESSING
  await db.update(footScans).set({ status: 'PROCESSING' }).where(eq(footScans.id, scanId));

  // Get scan data
  const [scan] = await db.select().from(footScans).where(eq(footScans.id, scanId)).limit(1);
  if (!scan) throw new Error(`Scan ${scanId} not found`);

  try {
    // Call ML service
    const result = await mlService.processScan(scanId, scan.leftFootKey, scan.rightFootKey);

    // Update scan with results
    await db.update(footScans).set({
      status: 'COMPLETE',
      measurements: JSON.stringify(result.measurements),
      pointCloudUrl: result.point_cloud_url || null,
      meshUrl: result.mesh_url || null,
      scanMetadata: JSON.stringify(result.metadata || {}),
    }).where(eq(footScans.id, scanId));

    return { success: true, scanId };
  } catch (error) {
    await db.update(footScans).set({ status: 'FAILED' }).where(eq(footScans.id, scanId));
    throw error;
  }
});

scanQueue.on('failed', (job, err) => {
  console.error(`Scan job ${job.id} failed:`, err.message);
});
