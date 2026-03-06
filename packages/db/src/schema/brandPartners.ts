import { pgTable, varchar, timestamp, boolean, text, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './orders';

// Brand partners table
export const brandPartners = pgTable('brand_partners', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  apiKeyHash: varchar('api_key_hash', { length: 255 }).notNull().unique(),
  webhookUrl: varchar('webhook_url', { length: 500 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  themeConfig: text('theme_config').default('{}').notNull(), // JSON string
  revenueSharePercent: numeric('revenue_share_percent', { precision: 5, scale: 2 })
    .default('10')
    .notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Brand partner orders table
export const brandPartnerOrders = pgTable('brand_partner_orders', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandPartnerId: varchar('brand_partner_id', { length: 36 })
    .notNull()
    .references(() => brandPartners.id),
  orderId: varchar('order_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => orders.id),
  externalOrderRef: varchar('external_order_ref', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const brandPartnersRelations = relations(brandPartners, ({ many }) => ({
  orders: many(orders),
  brandPartnerOrders: many(brandPartnerOrders),
}));

export const brandPartnerOrdersRelations = relations(brandPartnerOrders, ({ one }) => ({
  brandPartner: one(brandPartners, {
    fields: [brandPartnerOrders.brandPartnerId],
    references: [brandPartners.id],
  }),
  order: one(orders, {
    fields: [brandPartnerOrders.orderId],
    references: [orders.id],
  }),
}));
