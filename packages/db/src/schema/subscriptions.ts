import { pgTable, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Enums
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'ACTIVE',
  'CANCELLED',
  'PAST_DUE',
  'TRIALING',
]);

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => users.id),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).notNull().unique(),
  status: subscriptionStatusEnum('status').default('ACTIVE').notNull(),
  plan: varchar('plan', { length: 50 }).default('PREMIUM').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
