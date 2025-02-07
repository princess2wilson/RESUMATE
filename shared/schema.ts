import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),  // Changed from firstName to first_name
  isAdmin: boolean("is_admin").notNull().default(false),
  googleId: text("google_id"),
  linkedinId: text("linkedin_id"),
  username: text("username"),
});

export const cvReviews = pgTable("cv_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fileUrl: text("file_url").notNull(),
  reviewedFileUrl: text("reviewed_file_url"), // Added reviewedFileUrl column
  status: text("status").notNull().default("pending"),
  feedback: text("feedback"),
  createdAt: text("created_at").notNull(),
  isPromotional: boolean("is_promotional").notNull().default(false),
  isPaid: boolean("is_paid").notNull().default(false),
  paymentDeadline: text("payment_deadline"),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    email: true,
    password: true,
    firstName: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "Please let us know what to call you"),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CVReview = typeof cvReviews.$inferSelect;