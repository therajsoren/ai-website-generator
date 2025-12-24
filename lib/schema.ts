import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  json,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  avatarUrl: text("avatar_url"),
  // Daily quota tracking
  dailyMessagesUsed: integer("daily_messages_used").default(0),
  dailyQuotaDate: date("daily_quota_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectId: varchar("project_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const frames = pgTable("frames", {
  id: serial("id").primaryKey(),
  frameId: varchar("frame_id", { length: 255 }).notNull().unique(),
  projectId: varchar("project_id").references(() => projects.projectId),
  designCode: text("design_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  frameId: varchar("frame_id").references(() => frames.frameId),
  messages: json("messages").$type<Array<{ role: string; content: string }>>(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type Frame = typeof frames.$inferSelect;
