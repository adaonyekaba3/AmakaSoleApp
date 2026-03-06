import { pgTable, varchar, timestamp, pgEnum, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { orthoticDesigns } from './orthotics';
import { brandPartners } from './brandPartners';

// Enums
export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'PAID',
  'MANUFACTURING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]);

// Orders table
export const orders = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id),
  orthoticDesignId: varchar('orthotic_design_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => orthoticDesigns.id),
  brandPartnerId: varchar('brand_partner_id', { length: 36 }).references(() => brandPartners.id),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }),
  amount: integer('amount').notNull(), // Amount in cents
  currency: varchar('currency', { length: 3 }).default('usd').notNull(),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  trackingCarrier: varchar('tracking_carrier', { length: 100 }),
  shippingAddress: text('shipping_address').notNull(), // JSON string
  subscriptionId: varchar('subscription_id', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orthoticDesign: one(orthoticDesigns, {
    fields: [orders.orthoticDesignId],
    references: [orthoticDesigns.id],
  }),
  brandPartner: one(brandPartners, {
    fields: [orders.brandPartnerId],
    references: [brandPartners.id],
  }),
  brandPartnerOrder: one(brandPartnerOrders, {
    fields: [orders.id],
    references: [brandPartnerOrders.orderId],
  }),
}));

// Import for relations
import { brandPartnerOrders } from './brandPartners';
