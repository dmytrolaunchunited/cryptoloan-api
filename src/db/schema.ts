import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar, integer, date, boolean, primaryKey, text } from "drizzle-orm/pg-core";

export const scoringConditions = pgTable("scoring_conditions", {
  id: serial('id').primaryKey(),
  name: varchar(),
  label: varchar(),
  value: varchar(),
  relation: varchar(),
  condition: varchar(),
  description: varchar(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scoringConditionsRelations = relations(scoringConditions, ({ many }) => ({
  scoringFeaturesToScoringConditions: many(scoringFeaturesToScoringConditions),
}));

export const scoringFeaturesToScoringConditions = pgTable('scoring_features_to_scoring_conditions', {
  scoringConditionId: integer('scoring_condition_id')
    .notNull()
    .references(() => scoringConditions.id, { onDelete: 'cascade' }),
  scoringFeatureId: integer('scoring_feature_id')
    .notNull()
    .references(() => scoringFeatures.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.scoringConditionId, t.scoringFeatureId], name: 'pk_features_conditions' })
]);

export const scoringFeaturesToScoringConditionsRelations = relations(scoringFeaturesToScoringConditions, ({ one }) => ({
  scoringCondition: one(scoringConditions, {
    fields: [scoringFeaturesToScoringConditions.scoringConditionId],
    references: [scoringConditions.id],
  }),
  scoringFeature: one(scoringFeatures, {
    fields: [scoringFeaturesToScoringConditions.scoringFeatureId],
    references: [scoringFeatures.id],
  }),
}));

export const scoringFeatures = pgTable("scoring_features", {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  name: varchar(),
  type: varchar(),
  description: varchar(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scoringFeaturesRelations = relations(scoringFeatures, ({ one, many }) => ({
  application: one(applications),
  scoringFeaturesToScoringConditions: many(scoringFeaturesToScoringConditions),
}));

export const scoringQuestions = pgTable("scoring_questions", {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  name: varchar(),
  description: varchar(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scoringQuestionsRelations = relations(scoringQuestions, ({ one, many }) => ({
  application: one(applications),
  scoringQuestionsToScoringFeatures: many(scoringQuestionsToScoringFeatures),
}));

export const scoringQuestionsToScoringFeatures = pgTable('scoring_questions_to_scoring_features', {
  scoringQuestionId: integer('scoring_question_id')
    .notNull()
    .references(() => scoringQuestions.id, { onDelete: 'cascade' }),
  scoringFeatureId: integer('scoring_feature_id')
    .notNull()
    .references(() => scoringFeatures.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.scoringQuestionId, t.scoringFeatureId], name: 'pk_questions_conditions' })
]);


export const scoringQuestionsToScoringFeaturesRelations = relations(scoringQuestionsToScoringFeatures, ({ one }) => ({
  scoringQuestion: one(scoringQuestions, {
    fields: [scoringQuestionsToScoringFeatures.scoringQuestionId],
    references: [scoringQuestions.id],
  }),
  scoringFeature: one(scoringFeatures, {
    fields: [scoringQuestionsToScoringFeatures.scoringFeatureId],
    references: [scoringFeatures.id],
  }),
}));

export const userFeatures = pgTable("user_features", {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  scoringFeatureId: integer('scoring_feature_id').references(() => scoringFeatures.id),
  scoringConditionId: integer('scoring_condition_id').references(() => scoringConditions.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userDevices = pgTable('user_devices', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: varchar(),
  name: varchar(),
  model: varchar(),
  manufacturer: varchar(),
  ipAddress: varchar('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userFeaturesRelations = relations(userFeatures, ({ one }) => ({
  scoringFeature: one(scoringFeatures),
  scoringCondition: one(scoringConditions),
  user: one(users),
}));

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  privy: varchar(),
  email: varchar(),
  phone: varchar(),
  qoreid: text(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(userProfiles),
  application: one(applications),
  userDevices: one(userDevices),
  userFeatures: many(userFeatures),
}));

export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  dateOfBirth: date('date_of_birth'),
  citizenshipCountry: varchar('citizenship_country'),
  residenceCountry: varchar('residence_country'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  name: varchar(),
  uuid: varchar(),
  currency: varchar(),
  scoreValidationMax: varchar(),
  scoreValidationMin: varchar(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scoringPayouts = pgTable("scoring_payouts", {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  name: varchar(),
  description: varchar(),
  condition: varchar(),
  value: varchar(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
