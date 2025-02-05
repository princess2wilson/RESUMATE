import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const cvReviews = pgTable("cv_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").notNull().default("pending"),
  feedback: text("feedback"),
  createdAt: text("created_at").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  type: text("type").notNull(), // 'cv_template', 'cover_letter', 'guide'
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("pending"),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  status: text("status").notNull(), // 'active', 'canceled', 'past_due'
  planType: text("plan_type").notNull(), // 'starter', 'pro', 'enterprise'
  currentPeriodEnd: text("current_period_end").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCVReviewSchema = createInsertSchema(cvReviews).pick({
  fileUrl: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).pick({
  date: true,
  time: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  status: true,
  planType: true,
  currentPeriodEnd: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CVReview = typeof cvReviews.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;