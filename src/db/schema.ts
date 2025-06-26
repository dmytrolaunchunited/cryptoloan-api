import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  privy: varchar(),
  email: varchar(),
  phone: varchar(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// export const scoreSettings = pgTable("score_settings", {
//   id: serial("id").primaryKey(),
//   organization: varchar(),
//   year: varchar(),
//   email: varchar(),
//   phone: varchar(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   deletedAt: timestamp("deleted_at"),
// });
