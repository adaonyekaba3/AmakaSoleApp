import { pgTable, varchar, timestamp, pgEnum, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Enums
export const scanStatusEnum = pgEnum('scan_status', [
  'PENDING',
  'UPLOADING',
  'PROCESSING',
  'ANALYZING',
  'COMPLETE',
  'FAILED',
]);

export const pronationTypeEnum = pgEnum('pronation_type', [
  'NEUTRAL',
  'OVERPRONATION',
  'SUPINATION',
  'UNKNOWN',
]);

// Foot scans table
export const footScans = pgTable('foot_scans', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id),
  scanDate: timestamp('scan_date').defaultNow().notNull(),
  leftFootKey: varchar('left_foot_key', { length: 500 }),
  rightFootKey: varchar('right_foot_key', { length: 500 }),
  status: scanStatusEnum('status').default('PENDING').notNull(),
  pointCloudUrl: varchar('point_cloud_url', { length: 500 }),
  meshUrl: varchar('mesh_url', { length: 500 }),
  measurements: text('measurements'), // JSON string
  scanMetadata: text('scan_metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Gait analysis table
export const gaitAnalyses = pgTable('gait_analyses', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  footScanId: varchar('foot_scan_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => footScans.id),
  videoKey: varchar('video_key', { length: 500 }),
  pronationType: pronationTypeEnum('pronation_type').default('UNKNOWN').notNull(),
  confidenceScore: integer('confidence_score').default(0).notNull(), // Store as integer (0-100)
  heatmapUrl: varchar('heatmap_url', { length: 500 }),
  analysisData: text('analysis_data'), // JSON string
  analyzedAt: timestamp('analyzed_at').defaultNow().notNull(),
});

// Relations
export const footScansRelations = relations(footScans, ({ one, many }) => ({
  user: one(users, {
    fields: [footScans.userId],
    references: [users.id],
  }),
  gaitAnalysis: one(gaitAnalyses, {
    fields: [footScans.id],
    references: [gaitAnalyses.footScanId],
  }),
  orthoticDesigns: many(orthoticDesigns),
}));

export const gaitAnalysesRelations = relations(gaitAnalyses, ({ one }) => ({
  footScan: one(footScans, {
    fields: [gaitAnalyses.footScanId],
    references: [footScans.id],
  }),
}));

// Import for relations
import { orthoticDesigns } from './orthotics';
