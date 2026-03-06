import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { db, brandPartners, brandPartnerOrders, orders, orthoticDesigns, footScans } from '@amakasole/db';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { uploadUrlSchema, generateOrthoticSchema } from '@amakasole/shared';
import { verifyToken, AuthRequest, requireRole } from '../middleware/auth';
import { generatePresignedUploadUrl } from '../lib/s3';
import { PRESIGNED_URL_EXPIRES_IN } from '@amakasole/shared';

const router = Router();

// API key auth middleware for partner routes
const verifyApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      res.status(401).json({ success: false, error: 'API key required' });
      return;
    }

    // Find partner by checking hashed keys
    const allPartners = await db.select().from(brandPartners).where(eq(brandPartners.isActive, true));

    let matchedPartner = null;
    for (const partner of allPartners) {
      const isMatch = await bcrypt.compare(apiKey, partner.apiKeyHash);
      if (isMatch) {
        matchedPartner = partner;
        break;
      }
    }

    if (!matchedPartner) {
      res.status(401).json({ success: false, error: 'Invalid API key' });
      return;
    }

    (req as any).partner = matchedPartner;
    next();
  } catch (error) {
    next(error);
  }
};

// POST /api/partners/scan-session — create scan session for partner
router.post('/scan-session', verifyApiKey, async (req: Request, res, next) => {
  try {
    const partner = (req as any).partner;
    const { foot, fileType } = req.body;

    if (!foot || !fileType) {
      res.status(400).json({ success: false, error: 'foot and fileType are required' });
      return;
    }

    const ext = fileType.toLowerCase();
    const scanId = crypto.randomUUID();

    // Create scan record (no user — partner-initiated)
    const [scan] = await db.insert(footScans).values({
      userId: partner.id, // Use partner ID as placeholder
      status: 'UPLOADING',
    }).returning();

    const key = `partners/${partner.id}/${scan.id}/${foot.toLowerCase()}.${ext}`;
    const uploadUrl = await generatePresignedUploadUrl(key, PRESIGNED_URL_EXPIRES_IN);

    const updateField = foot === 'LEFT' ? { leftFootKey: key } : { rightFootKey: key };
    await db.update(footScans).set(updateField).where(eq(footScans.id, scan.id));

    res.status(201).json({
      success: true,
      data: { uploadUrl, scanId: scan.id, expiresIn: PRESIGNED_URL_EXPIRES_IN },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/partners/generate-orthotic — partner-initiated orthotic generation
router.post('/generate-orthotic', verifyApiKey, async (req: Request, res, next) => {
  try {
    const partner = (req as any).partner;
    const { scanId, shoeType, useCase, material, archHeightPref } = req.body;

    const [scan] = await db.select().from(footScans).where(eq(footScans.id, scanId)).limit(1);
    if (!scan) {
      res.status(404).json({ success: false, error: 'Scan not found' });
      return;
    }

    const [design] = await db.insert(orthoticDesigns).values({
      footScanId: scanId,
      userId: scan.userId,
      shoeType: shoeType || 'SNEAKER',
      useCase: useCase || 'EVERYDAY',
      material: material || 'EVA_FOAM',
      archHeightPref: archHeightPref || 'MEDIUM',
      status: 'DRAFT',
    }).returning();

    res.status(201).json({
      success: true,
      data: { orthoticDesignId: design.id, status: design.status },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/partners/dashboard/metrics — JWT + BRAND_PARTNER role
router.get('/dashboard/metrics', verifyToken, requireRole(['BRAND_PARTNER', 'ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    // Get partner record by user association
    const allPartners = await db.select().from(brandPartners);
    // For MVP, return aggregate metrics

    const [orderCount] = await db.select({ count: count() }).from(orders);
    const [scanCount] = await db.select({ count: count() }).from(footScans);
    const [designCount] = await db.select({ count: count() }).from(orthoticDesigns);

    const recentOrders = await db.select().from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    const totalRevenue = recentOrders.reduce((sum, o) => sum + o.amount, 0);

    res.json({
      success: true,
      data: {
        totalOrders: Number(orderCount?.count || 0),
        totalScans: Number(scanCount?.count || 0),
        totalDesigns: Number(designCount?.count || 0),
        totalRevenue,
        recentOrders: recentOrders.map(o => ({
          id: o.id,
          amount: o.amount,
          status: o.status,
          createdAt: o.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
