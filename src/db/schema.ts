import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar, integer, date, boolean, primaryKey } from "drizzle-orm/pg-core";

export const scoringConditions = pgTable("scoring_conditions", {
  id: serial('id').primaryKey(),
  name: varchar(),
  text: varchar(),
  value: varchar(),
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
  name: varchar(),
  type: varchar(),
  description: varchar(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scoringFeaturesRelations = relations(scoringFeatures, ({ many }) => ({
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
  scoringFeatureValue: varchar(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userDevices = pgTable('user_devices', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: varchar(),
  name: varchar(),
  brand: varchar(),
  model: varchar(),
  manufacturer: varchar(),
  ipAddress: varchar('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userFeaturesRelations = relations(userFeatures, ({ one }) => ({
  scoringFeature: one(scoringFeatures),
  user: one(users),
}));

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id),
  privy: varchar(),
  email: varchar(),
  phone: varchar(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(userProfiles),
  application: one(applications),
  userDevices: many(userDevices),
  userFeatures: many(userFeatures),
}));

export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
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
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
