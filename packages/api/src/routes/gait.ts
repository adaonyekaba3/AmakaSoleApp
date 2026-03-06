import { Router } from 'express';
import { db, footScans, gaitAnalyses } from '@amakasole/db';
import { eq, and } from 'drizzle-orm';
import { gaitUploadUrlSchema } from '@amakasole/shared';
import { VIDEO_PRESIGNED_URL_EXPIRES_IN } from '@amakasole/shared';
import { validate } from '../middleware/validate';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { generatePresignedUploadUrl, getCDNUrl } from '../lib/s3';
import { gaitQueue } from '../lib/queue';

const router = Router();

// POST /api/gait/upload-url
router.post('/upload-url', verifyToken, validate(gaitUploadUrlSchema), async (req: AuthRequest, res, next) => {
  try {
    const { scanId } = req.body;

    // Verify scan belongs to user
    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    const key = `gait/${req.user!.id}/${scanId}/video.mp4`;
    const uploadUrl = await generatePresignedUploadUrl(key, VIDEO_PRESIGNED_URL_EXPIRES_IN);

    // Store video key in gait analysis
    const [existing] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scanId)).limit(1);

    if (existing) {
      await db.update(gaitAnalyses).set({ videoKey: key }).where(eq(gaitAnalyses.id, existing.id));
    } else {
      await db.insert(gaitAnalyses).values({
        footScanId: scanId,
        videoKey: key,
        pronationType: 'UNKNOWN',
        confidenceScore: 0,
      });
    }

    res.status(201).json({
      success: true,
      data: { uploadUrl, scanId, expiresIn: VIDEO_PRESIGNED_URL_EXPIRES_IN },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/gait/:scanId/analyze
router.post('/:scanId/analyze', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { scanId } = req.params;

    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    const [gait] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scanId)).limit(1);
    if (!gait || !gait.videoKey) {
      res.status(400).json({ success: false, error: 'No video uploaded for this scan' });
      return;
    }

    // Enqueue gait analysis job
    await gaitQueue.add({ scanId, videoKey: gait.videoKey });

    res.json({
      success: true,
      data: { scanId, status: 'ANALYZING', message: 'Gait analysis queued' },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/gait/:scanId/results
router.get('/:scanId/results', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { scanId } = req.params;

    // Verify ownership
    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    const [gait] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scanId)).limit(1);

    if (!gait) {
      res.status(404).json({ success: false, error: 'No gait analysis found for this scan' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...gait,
        analysisData: gait.analysisData ? JSON.parse(gait.analysisData) : null,
        heatmapUrl: gait.heatmapUrl ? getCDNUrl(gait.heatmapUrl) : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
