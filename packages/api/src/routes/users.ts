import { Router } from 'express';
import { db, users, userProfiles, footScans, gaitAnalyses, orthoticDesigns } from '@amakasole/db';
import { eq, desc, count } from 'drizzle-orm';
import { updateProfileSchema, addShoeToCollectionSchema, removeShoeFromCollectionSchema, updateShoeCollectionSchema } from '@amakasole/shared';
import { validate } from '../middleware/validate';
import { verifyToken, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// GET /api/users/profile
router.get('/profile', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.user!.id)).limit(1);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          authProvider: user.authProvider,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        profile: profile ? {
          ...profile,
          shoeCollection: JSON.parse(profile.shoeCollection || '[]'),
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile
router.put('/profile', verifyToken, validate(updateProfileSchema), async (req: AuthRequest, res, next) => {
  try {
    const { firstName, lastName, ...profileFields } = req.body;

    // Update user fields if provided
    if (firstName || lastName) {
      const userUpdate: Record<string, unknown> = { updatedAt: new Date() };
      if (firstName) userUpdate.firstName = firstName;
      if (lastName) userUpdate.lastName = lastName;
      await db.update(users).set(userUpdate).where(eq(users.id, req.user!.id));
    }

    // Update profile fields if any provided
    if (Object.keys(profileFields).length > 0) {
      await db.update(userProfiles).set({
        ...profileFields,
        updatedAt: new Date(),
      }).where(eq(userProfiles.userId, req.user!.id));
    }

    // Return updated data
    const [updatedUser] = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
    const [updatedProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.user!.id)).limit(1);

    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
        },
        profile: updatedProfile ? {
          ...updatedProfile,
          shoeCollection: JSON.parse(updatedProfile.shoeCollection || '[]'),
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/shoe-collection
router.put('/shoe-collection', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { action } = req.body;

    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.user!.id)).limit(1);
    if (!profile) {
      res.status(404).json({ success: false, error: 'Profile not found' });
      return;
    }

    let shoes = JSON.parse(profile.shoeCollection || '[]');

    if (action === 'ADD') {
      const parsed = addShoeToCollectionSchema.parse(req.body);
      const newShoe = { id: crypto.randomUUID(), ...parsed, isActive: true };
      shoes.push(newShoe);
    } else if (action === 'REMOVE') {
      const parsed = removeShoeFromCollectionSchema.parse(req.body);
      shoes = shoes.filter((s: any) => s.id !== parsed.shoeId);
    } else if (action === 'UPDATE') {
      const parsed = updateShoeCollectionSchema.parse(req.body);
      shoes = parsed.shoes;
    } else {
      res.status(400).json({ success: false, error: 'Invalid action. Use ADD, REMOVE, or UPDATE' });
      return;
    }

    await db.update(userProfiles).set({
      shoeCollection: JSON.stringify(shoes),
      updatedAt: new Date(),
    }).where(eq(userProfiles.userId, req.user!.id));

    res.json({ success: true, data: { shoeCollection: shoes } });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/foot-health-score
router.get('/foot-health-score', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.user!.id)).limit(1);

    // Get scan count and latest scan
    const scans = await db.select().from(footScans)
      .where(eq(footScans.userId, req.user!.id))
      .orderBy(desc(footScans.createdAt))
      .limit(5);

    // Get gait analyses for recent scans
    const scanIds = scans.map(s => s.id);
    let gaitData: any[] = [];
    for (const scanId of scanIds) {
      const [gait] = await db.select().from(gaitAnalyses).where(eq(gaitAnalyses.footScanId, scanId)).limit(1);
      if (gait) gaitData.push(gait);
    }

    // Get orthotic count
    const [orthoticCount] = await db.select({ count: count() }).from(orthoticDesigns)
      .where(eq(orthoticDesigns.userId, req.user!.id));

    // Calculate score factors
    const scanQuality = scans.length > 0 ? Math.min(scans.filter(s => s.status === 'COMPLETE').length * 25, 100) : 0;
    const gaitScore = gaitData.length > 0 ? Math.round(gaitData.reduce((sum, g) => sum + g.confidenceScore, 0) / gaitData.length) : 0;
    const activityLevel = profile?.primaryActivity ? Math.min(profile.primaryActivity.length * 20, 100) : 0;
    const orthoticUsage = orthoticCount?.count ? Math.min(Number(orthoticCount.count) * 25, 100) : 0;

    const overallScore = Math.round((scanQuality + gaitScore + activityLevel + orthoticUsage) / 4);

    // Update stored score
    if (profile) {
      await db.update(userProfiles).set({
        footHealthScore: overallScore,
        updatedAt: new Date(),
      }).where(eq(userProfiles.userId, req.user!.id));
    }

    res.json({
      success: true,
      data: {
        footHealthScore: overallScore,
        factors: { scanQuality, gaitAnalysis: gaitScore, activityLevel, orthoticUsage },
        trend: scans.map(s => ({
          date: s.scanDate,
          scanId: s.id,
          status: s.status,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
