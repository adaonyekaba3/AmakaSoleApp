import { Router } from 'express';
import { db, footScans, gaitAnalyses, orthoticDesigns } from '@amakasole/db';
import { eq, and, desc } from 'drizzle-orm';
import { generateOrthoticSchema, updateOrthoticSchema } from '@amakasole/shared';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@amakasole/shared';
import { validate } from '../middleware/validate';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { mlService } from '../services/ml.service';
import { getCDNUrl } from '../lib/s3';

const router = Router();

// POST /api/orthotics/generate
router.post('/generate', verifyToken, validate(generateOrthoticSchema), async (req: AuthRequest, res, next) => {
  try {
    const { scanId, shoeType, useCase, material, archHeightPref } = req.body;

    // Verify scan belongs to user and is complete
    const [scan] = await db.select().from(footScans)
      .where(and(eq(footScans.id, scanId), eq(footScans.userId, req.user!.id)))
      .limit(1);

    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    if (scan.status !== 'COMPLETE') {
      res.status(400).json({ success: false, error: 'Scan is not yet complete' });
      return;
    }

    // Get gait data if available
    const [gait] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scanId)).limit(1);

    // Call ML service
    const mlResult = await mlService.generateOrthotic({
      scanId,
      measurements: scan.measurements ? JSON.parse(scan.measurements) : null,
      gaitData: gait?.analysisData ? JSON.parse(gait.analysisData) : null,
      shoeType,
      useCase,
      material,
      archHeightPref,
    });

    // Create orthotic design record
    const [design] = await db.insert(orthoticDesigns).values({
      footScanId: scanId,
      userId: req.user!.id,
      shoeType,
      useCase,
      material,
      archHeightPref,
      cadSpec: JSON.stringify(mlResult.cad_spec || {}),
      cadSpecUrl: mlResult.cad_spec_url || null,
      previewImageUrl: mlResult.preview_image_url || null,
      status: 'DRAFT',
    }).returning();

    res.status(201).json({
      success: true,
      data: {
        ...design,
        cadSpec: mlResult.cad_spec || {},
        previewImageUrl: design.previewImageUrl ? getCDNUrl(design.previewImageUrl) : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orthotics/:orthoticId
router.get('/:orthoticId', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [design] = await db.select().from(orthoticDesigns)
      .where(and(eq(orthoticDesigns.id, req.params.orthoticId), eq(orthoticDesigns.userId, req.user!.id)))
      .limit(1);

    if (!design) {
      res.status(404).json({ success: false, error: 'Orthotic design not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...design,
        cadSpec: design.cadSpec ? JSON.parse(design.cadSpec) : null,
        previewImageUrl: design.previewImageUrl ? getCDNUrl(design.previewImageUrl) : null,
        cadSpecUrl: design.cadSpecUrl ? getCDNUrl(design.cadSpecUrl) : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orthotics
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * limit;

    const designs = await db.select().from(orthoticDesigns)
      .where(eq(orthoticDesigns.userId, req.user!.id))
      .orderBy(desc(orthoticDesigns.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: designs.map(d => ({
        ...d,
        cadSpec: d.cadSpec ? JSON.parse(d.cadSpec) : null,
        previewImageUrl: d.previewImageUrl ? getCDNUrl(d.previewImageUrl) : null,
      })),
      meta: { page, limit },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/orthotics/:orthoticId
router.put('/:orthoticId', verifyToken, validate(updateOrthoticSchema), async (req: AuthRequest, res, next) => {
  try {
    const [design] = await db.select().from(orthoticDesigns)
      .where(and(eq(orthoticDesigns.id, req.params.orthoticId), eq(orthoticDesigns.userId, req.user!.id)))
      .limit(1);

    if (!design) {
      res.status(404).json({ success: false, error: 'Orthotic design not found' });
      return;
    }

    if (design.status !== 'DRAFT') {
      res.status(400).json({ success: false, error: 'Only DRAFT designs can be modified' });
      return;
    }

    await db.update(orthoticDesigns).set(req.body).where(eq(orthoticDesigns.id, req.params.orthoticId));

    const [updated] = await db.select().from(orthoticDesigns).where(eq(orthoticDesigns.id, req.params.orthoticId)).limit(1);

    res.json({
      success: true,
      data: {
        ...updated,
        cadSpec: updated.cadSpec ? JSON.parse(updated.cadSpec) : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orthotics/:orthoticId/confirm
router.post('/:orthoticId/confirm', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [design] = await db.select().from(orthoticDesigns)
      .where(and(eq(orthoticDesigns.id, req.params.orthoticId), eq(orthoticDesigns.userId, req.user!.id)))
      .limit(1);

    if (!design) {
      res.status(404).json({ success: false, error: 'Orthotic design not found' });
      return;
    }

    if (design.status !== 'DRAFT') {
      res.status(400).json({ success: false, error: 'Design is already confirmed or ordered' });
      return;
    }

    await db.update(orthoticDesigns).set({ status: 'CONFIRMED' }).where(eq(orthoticDesigns.id, req.params.orthoticId));

    res.json({
      success: true,
      data: { orthoticId: design.id, status: 'CONFIRMED' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
