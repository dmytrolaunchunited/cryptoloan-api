import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar, integer } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  privy: varchar(),
  email: varchar(),
  phone: varchar(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  name: varchar(),
  uuid: varchar(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const conditions = pgTable('conditions', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  scoringFeature: varchar('coring_feature'),
  scoringFeatureOption: varchar('scoring_feature_option'),
  scoring: integer(),
  scoringType: varchar('scoring_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
	application: one(applications),
}));

export const conditionsRelations = relations(conditions, ({ one }) => ({
	application: one(applications),
}));