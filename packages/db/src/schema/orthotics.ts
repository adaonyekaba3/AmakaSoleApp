import { pgTable, varchar, timestamp, pgEnum, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { footScans } from './scans';
import { orders } from './orders';

// Enums
export const shoeTypeEnum = pgEnum('shoe_type', [
  'HEEL',
  'SNEAKER',
  'BOOT',
  'LOAFER',
  'SANDAL',
  'SPORT',
]);

export const useCaseEnum = pgEnum('use_case', ['EVERYDAY', 'SPORT', 'MEDICAL']);

export const materialTypeEnum = pgEnum('material_type', [
  'EVA_FOAM',
  'MEMORY_FOAM',
  'CARBON_FIBER',
  'PREMIUM',
]);

export const archHeightPrefEnum = pgEnum('arch_height_pref', ['LOW', 'MEDIUM', 'HIGH']);

export const designStatusEnum = pgEnum('design_status', ['DRAFT', 'CONFIRMED', 'ORDERED']);

// Orthotic designs table
export const orthoticDesigns = pgTable('orthotic_designs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  footScanId: varchar('foot_scan_id', { length: 36 })
    .notNull()
    .references(() => footScans.id),
  userId: varchar('user_id', { length: 36 }).notNull(),
  shoeType: shoeTypeEnum('shoe_type').notNull(),
  useCase: useCaseEnum('use_case').notNull(),
  material: materialTypeEnum('material').notNull(),
  archHeightPref: archHeightPrefEnum('arch_height_pref').default('MEDIUM').notNull(),
  cadSpecUrl: varchar('cad_spec_url', { length: 500 }),
  cadSpec: text('cad_spec'), // JSON string
  previewImageUrl: varchar('preview_image_url', { length: 500 }),
  status: designStatusEnum('status').default('DRAFT').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const orthoticDesignsRelations = relations(orthoticDesigns, ({ one }) => ({
  footScan: one(footScans, {
    fields: [orthoticDesigns.footScanId],
    references: [footScans.id],
  }),
  order: one(orders, {
    fields: [orthoticDesigns.id],
    references: [orders.orthoticDesignId],
  }),
}));
