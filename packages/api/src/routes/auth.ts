import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import { db, users, userProfiles, refreshTokens } from '@amakasole/db';
import { eq } from 'drizzle-orm';
import { registerSchema, loginSchema } from '@amakasole/shared';
import { validate } from '../middleware/validate';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { generateAccessToken, generateRefreshToken } from '../lib/jwt';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
        authProvider: 'EMAIL',
        role: 'CONSUMER',
        isEmailVerified: false,
      })
      .returning();

    // Create empty profile
    await db.insert(userProfiles).values({ userId: newUser.id });

    // Generate tokens
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: newUser.id,
      expiresAt,
    });

    // Set httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Delete old refresh tokens
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));

    // Generate new tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, error: 'No refresh token' });
      return;
    }

    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
      return;
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(tokenRecord.userId);
    const newRefreshToken = generateRefreshToken(tokenRecord.userId);

    // Delete old, insert new
    await db.delete(refreshTokens).where(eq(refreshTokens.id, tokenRecord.id));

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(refreshTokens).values({
      token: newRefreshToken,
      userId: tokenRecord.userId,
      expiresAt,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, req.user!.id))
      .limit(1);

    res.json({
      success: true,
      data: {
        ...user,
        profile: profile || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
