import { User, InsertUser, CVReview, Product, Consultation } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import * as schema from "@shared/schema";
import { subscriptions, type Subscription } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createCVReview(review: Omit<CVReview, "id">): Promise<CVReview>;
  getCVReviews(userId: number): Promise<CVReview[]>;
  getAllCVReviews(): Promise<CVReview[]>;
  updateCVReview(id: number, feedback: string): Promise<CVReview>;

  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;

  createConsultation(consultation: Omit<Consultation, "id">): Promise<Consultation>;
  getConsultations(userId: number): Promise<Consultation[]>;

  sessionStore: session.Store;

  // Add new subscription methods
  createSubscription(subscription: Omit<Subscription, "id">): Promise<Subscription>;
  getSubscription(userId: number): Promise<Subscription | undefined>;
  updateSubscription(
    stripeSubscriptionId: string,
    update: Partial<Subscription>
  ): Promise<Subscription>;
  getStripeCustomer(userId: number): Promise<{ id: string } | undefined>;
  setStripeCustomer(userId: number, stripeCustomerId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });

    // Seed some initial products
    this.seedProducts();
  }

  private async seedProducts() {
    const existingProducts = await db.select().from(schema.products);
    if (existingProducts.length === 0) {
      await db.insert(schema.products).values([
        {
          name: "Professional CV Template",
          description: "Ready-to-use CV template for professionals",
          price: 2999,
          type: "cv_template",
        },
        {
          name: "Cover Letter Guide",
          description: "Comprehensive guide to writing effective cover letters",
          price: 1999,
          type: "guide",
        },
      ]);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createCVReview(review: Omit<CVReview, "id">): Promise<CVReview> {
    const [newReview] = await db
      .insert(schema.cvReviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getCVReviews(userId: number): Promise<CVReview[]> {
    return db
      .select()
      .from(schema.cvReviews)
      .where(eq(schema.cvReviews.userId, userId));
  }

  async getAllCVReviews(): Promise<CVReview[]> {
    return db.select().from(schema.cvReviews);
  }

  async updateCVReview(id: number, feedback: string): Promise<CVReview> {
    const [updated] = await db
      .update(schema.cvReviews)
      .set({ feedback, status: "completed" })
      .where(eq(schema.cvReviews.id, id))
      .returning();
    return updated;
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(schema.products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id));
    return product;
  }

  async createConsultation(consultation: Omit<Consultation, "id">): Promise<Consultation> {
    const [newConsultation] = await db
      .insert(schema.consultations)
      .values(consultation)
      .returning();
    return newConsultation;
  }

  async getConsultations(userId: number): Promise<Consultation[]> {
    return db
      .select()
      .from(schema.consultations)
      .where(eq(schema.consultations.userId, userId));
  }

  async createSubscription(subscription: Omit<Subscription, "id">): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async getSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return subscription;
  }

  async updateSubscription(
    stripeSubscriptionId: string,
    update: Partial<Subscription>
  ): Promise<Subscription> {
    const [updated] = await db
      .update(subscriptions)
      .set(update)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
    return updated;
  }

  async getStripeCustomer(userId: number): Promise<{ id: string } | undefined> {
    const [subscription] = await db
      .select({ stripeCustomerId: subscriptions.stripeCustomerId })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return subscription ? { id: subscription.stripeCustomerId } : undefined;
  }

  async setStripeCustomer(userId: number, stripeCustomerId: string): Promise<void> {
    // This is handled through createSubscription, no need for a separate table
    return;
  }
}

export const storage = new DatabaseStorage();