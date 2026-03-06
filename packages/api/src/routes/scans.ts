import { Router } from 'express';
import { db, footScans, gaitAnalyses } from '@amakasole/db';
import { eq, and, desc } from 'drizzle-orm';
import { uploadUrlSchema, confirmScanSchema } from '@amakasole/shared';
import { PRESIGNED_URL_EXPIRES_IN, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@amakasole/shared';
import { validate } from '../middleware/validate';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { generatePresignedUploadUrl, getCDNUrl } from '../lib/s3';
import { scanQueue } from '../lib/queue';

const router = Router();

// POST /api/scans/upload-url
router.post('/upload-url', verifyToken, validate(uploadUrlSchema), async (req: AuthRequest, res, next) => {
  try {
    const { foot, fileType } = req.body;
    const ext = fileType.toLowerCase();

    // Create scan record
    const [scan] = await db.insert(footScans).values({
      userId: req.user!.id,
      status: 'UPLOADING',
    }).returning();

    // Generate presigned URL
    const key = `scans/${req.user!.id}/${scan.id}/${foot.toLowerCase()}.${ext}`;
    const uploadUrl = await generatePresignedUploadUrl(key, PRESIGNED_URL_EXPIRES_IN);

    // Store the key
    const updateField = foot === 'LEFT' ? { leftFootKey: key } : { rightFootKey: key };
    await db.update(footScans).set(updateField).where(eq(footScans.id, scan.id));

    res.status(201).json({
      success: true,
      data: {
        uploadUrl,
        scanId: scan.id,
        expiresIn: PRESIGNED_URL_EXPIRES_IN,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/scans/:scanId/confirm
router.post('/:scanId/confirm', verifyToken, validate(confirmScanSchema), async (req: AuthRequest, res, next) => {
  try {
    const { scanId } = req.params;
    const { foot } = req.body;

    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    // Update status to PENDING for processing
    await db.update(footScans).set({ status: 'PENDING' }).where(eq(footScans.id, scanId));

    // Enqueue processing job
    await scanQueue.add({ scanId, foot });

    res.json({
      success: true,
      data: { scanId, status: 'PENDING', message: 'Scan queued for processing' },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scans/:scanId/status
router.get('/:scanId/status', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [scan] = await db.select({ id: footScans.id, status: footScans.status })
      .from(footScans)
      .where(and(eq(footScans.id, req.params.scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    res.json({ success: true, data: { scanId: scan.id, status: scan.status } });
  } catch (error) {
    next(error);
  }
});

// GET /api/scans/:scanId
router.get('/:scanId', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, req.params.scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    // Get gait analysis if exists
    const [gait] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scan.id)).limit(1);

    res.json({
      success: true,
      data: {
        ...scan,
        measurements: scan.measurements ? JSON.parse(scan.measurements) : null,
        scanMetadata: scan.scanMetadata ? JSON.parse(scan.scanMetadata) : null,
        pointCloudUrl: scan.pointCloudUrl ? getCDNUrl(scan.pointCloudUrl) : null,
        meshUrl: scan.meshUrl ? getCDNUrl(scan.meshUrl) : null,
        gaitAnalysis: gait ? {
          ...gait,
          analysisData: gait.analysisData ? JSON.parse(gait.analysisData) : null,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scans
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * limit;

    const scans = await db.select().from(footScans)
      .where(eq(footScans.userId, req.user!.id))
      .orderBy(desc(footScans.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: scans.map(scan => ({
        ...scan,
        measurements: scan.measurements ? JSON.parse(scan.measurements) : null,
        scanMetadata: scan.scanMetadata ? JSON.parse(scan.scanMetadata) : null,
      })),
      meta: { page, limit },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/scans/:scanId (soft delete)
router.delete('/:scanId', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, req.params.scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    // Soft delete by setting status to FAILED (or could add a deletedAt column)
    await db.update(footScans).set({ status: 'FAILED' }).where(eq(footScans.id, req.params.scanId));

    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});

export default router;
