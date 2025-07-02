import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, date, varchar, integer, boolean } from "drizzle-orm/pg-core";

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

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  ipAddress: varchar('ip_address'),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  dateOfBirth: date('date_of_birth'),
  citizenshipCountry: date('citizenship_country'),
  residenceCountry: date('residence_country'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
  scoringFeature: varchar('scoring_feature'),
  scoringFeatureOption: varchar('scoring_feature_option'),
  scoring: integer(),
  isActive: boolean('is_active').default(true),
  scoringType: varchar('scoring_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
	application: one(applications),
  profile: one(profiles),
}));

export const conditionsRelations = relations(conditions, ({ one }) => ({
	application: one(applications),
}));