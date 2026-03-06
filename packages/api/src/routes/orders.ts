import { Router, Request, Response } from 'express';
import { db, users, orders, orthoticDesigns, subscriptions } from '@amakasole/db';
import { eq, and, desc } from 'drizzle-orm';
import { createPaymentIntentSchema } from '@amakasole/shared';
import { INSOLE_PRICE_RANGE, SHIPPING_COST, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@amakasole/shared';
import { MaterialType } from '@amakasole/shared';
import { validate } from '../middleware/validate';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { stripeService } from '../services/stripe.service';
import { emailService } from '../services/email.service';

const router = Router();

// POST /api/orders/create-payment-intent
router.post('/create-payment-intent', verifyToken, validate(createPaymentIntentSchema), async (req: AuthRequest, res, next) => {
  try {
    const { orthoticDesignId, shippingAddress } = req.body;

    // Verify design belongs to user and is confirmed
    const [design] = await db.select().from(orthoticDesigns)
      .where(and(eq(orthoticDesigns.id, orthoticDesignId), eq(orthoticDesigns.userId, req.user!.id)))
      .limit(1);

    if (!design) {
      res.status(404).json({ success: false, error: 'Orthotic design not found' });
      return;
    }

    if (design.status !== 'CONFIRMED') {
      res.status(400).json({ success: false, error: 'Design must be confirmed before ordering' });
      return;
    }

    // Calculate price
    const materialPrice = INSOLE_PRICE_RANGE[design.material as MaterialType] || INSOLE_PRICE_RANGE[MaterialType.EVA_FOAM];
    const amount = materialPrice + SHIPPING_COST;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripeService.createPaymentIntent(amount, 'usd', {
      orthoticDesignId,
      userId: req.user!.id,
    });

    // Create order record
    const [order] = await db.insert(orders).values({
      userId: req.user!.id,
      orthoticDesignId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: 'usd',
      status: 'PENDING',
      shippingAddress: JSON.stringify(shippingAddress),
    }).returning();

    // Mark design as ordered
    await db.update(orthoticDesigns).set({ status: 'ORDERED' }).where(eq(orthoticDesigns.id, orthoticDesignId));

    res.status(201).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        amount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders/create-subscription
router.post('/create-subscription', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { paymentMethodId } = req.body;

    const [user] = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Check existing subscription
    const [existing] = await db.select().from(subscriptions).where(eq(subscriptions.userId, req.user!.id)).limit(1);
    if (existing && existing.status === 'ACTIVE') {
      res.status(409).json({ success: false, error: 'Active subscription already exists' });
      return;
    }

    // Create Stripe customer
    const customer = await stripeService.createCustomer(user.email, `${user.firstName} ${user.lastName}`);

    // Create Stripe subscription
    const stripeSub = await stripeService.createSubscription(
      customer.id,
      process.env.STRIPE_PREMIUM_PRICE_ID!,
      paymentMethodId,
    );

    // Store subscription
    const [subscription] = await db.insert(subscriptions).values({
      userId: req.user!.id,
      stripeSubscriptionId: stripeSub.id,
      status: 'ACTIVE',
      plan: 'PREMIUM',
      currentPeriodStart: new Date((stripeSub as any).current_period_start * 1000),
      currentPeriodEnd: new Date((stripeSub as any).current_period_end * 1000),
    }).returning();

    res.status(201).json({
      success: true,
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders/stripe-webhook (raw body needed)
router.post('/stripe-webhook', async (req: Request, res: Response, next) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripeService.constructWebhookEvent(req.body, sig);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any;
        await db.update(orders).set({
          status: 'PAID',
          updatedAt: new Date(),
        }).where(eq(orders.stripePaymentIntentId, pi.id));

        // Send confirmation email
        const [order] = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, pi.id)).limit(1);
        if (order) {
          const [user] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
          if (user) {
            await emailService.sendOrderConfirmation(user.email, order.id, order.amount).catch(console.error);
          }
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as any;
        await db.update(orders).set({
          status: 'CANCELLED',
          updatedAt: new Date(),
        }).where(eq(orders.stripePaymentIntentId, pi.id));
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        await db.update(subscriptions).set({
          status: sub.status === 'active' ? 'ACTIVE' : sub.cancel_at_period_end ? 'CANCELLED' : 'PAST_DUE',
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        }).where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        await db.update(subscriptions).set({ status: 'CANCELLED' }).where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * limit;

    const orderList = await db.select().from(orders)
      .where(eq(orders.userId, req.user!.id))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: orderList.map(o => ({
        ...o,
        shippingAddress: JSON.parse(o.shippingAddress),
      })),
      meta: { page, limit },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:orderId
router.get('/:orderId', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, req.params.orderId), eq(orders.userId, req.user!.id)))
      .limit(1);

    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    // Get associated orthotic design
    const [design] = await db.select().from(orthoticDesigns).where(eq(orthoticDesigns.id, order.orthoticDesignId)).limit(1);

    res.json({
      success: true,
      data: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
        orthoticDesign: design ? {
          ...design,
          cadSpec: design.cadSpec ? JSON.parse(design.cadSpec) : null,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders/:orderId/cancel
router.post('/:orderId/cancel', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, req.params.orderId), eq(orders.userId, req.user!.id)))
      .limit(1);

    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    if (order.status !== 'PENDING') {
      res.status(400).json({ success: false, error: 'Only pending orders can be cancelled' });
      return;
    }

    await db.update(orders).set({
      status: 'CANCELLED',
      updatedAt: new Date(),
    }).where(eq(orders.id, req.params.orderId));

    // Revert design status back to CONFIRMED
    await db.update(orthoticDesigns).set({ status: 'CONFIRMED' }).where(eq(orthoticDesigns.id, order.orthoticDesignId));

    res.json({
      success: true,
      data: { orderId: order.id, status: 'CANCELLED' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
