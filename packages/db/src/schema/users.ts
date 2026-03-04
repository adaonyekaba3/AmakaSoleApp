import { pgTable, varchar, timestamp, boolean, pgEnum, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const authProviderEnum = pgEnum('auth_provider', ['EMAIL', 'APPLE', 'GOOGLE']);
export const userRoleEnum = pgEnum('user_role', ['CONSUMER', 'BRAND_PARTNER', 'ADMIN']);

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  authProvider: authProviderEnum('auth_provider').default('EMAIL').notNull(),
  role: userRoleEnum('role').default('CONSUMER').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Refresh tokens table
export const refreshTokens = pgTable('refresh_tokens', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: varchar('token', { length: 500 }).notNull().unique(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  dateOfBirth: timestamp('date_of_birth'),
  weightKg: integer('weight_kg'),
  heightCm: integer('height_cm'),
  primaryActivity: text('primary_activity').array(),
  knownConditions: text('known_conditions').array(),
  shoeCollection: text('shoe_collection').notNull().default('[]'), // JSON string
  footHealthScore: integer('foot_health_score').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  refreshTokens: many(refreshTokens),
  scans: many(footScans),
  orders: many(orders),
  subscription: one(subscriptions),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

// Import types for relations (declared at bottom to avoid circular dependency)
import { footScans } from './scans';
import { orders } from './orders';
import { subscriptions } from './subscriptions';
