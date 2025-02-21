import { User, InsertUser, CVReview, AuditLog, Product, InsertProduct } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import * as schema from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCVReview(review: Omit<CVReview, "id">): Promise<CVReview>;
  getCVReviews(userId: number): Promise<CVReview[]>;
  getAllCVReviews(): Promise<(CVReview & { userEmail?: string; firstName?: string })[]>;
  updateCVReview(id: number, feedback: string): Promise<CVReview>;
  createAuditLog(logEntry: Omit<AuditLog, "id">): Promise<void>;
  // Add product-related methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error('Failed to get user by email');
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log('Creating user with data:', { ...insertUser, password: '[REDACTED]' });
      const [user] = await db
        .insert(schema.users)
        .values({
          email: insertUser.email,
          password: insertUser.password,
          firstName: insertUser.firstName,
          isAdmin: false,
        })
        .returning();
      console.log('User created successfully:', { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Email already exists');
      }
      throw new Error('Failed to create user');
    }
  }

  async createCVReview(review: Omit<CVReview, "id">): Promise<CVReview> {
    try {
      const [newReview] = await db
        .insert(schema.cvReviews)
        .values({
          ...review,
          isPromotional: false
        })
        .returning();
      return newReview;
    } catch (error) {
      console.error('Error creating CV review:', error);
      throw new Error('Failed to create CV review');
    }
  }

  async getCVReviews(userId: number): Promise<CVReview[]> {
    try {
      return db
        .select()
        .from(schema.cvReviews)
        .where(eq(schema.cvReviews.userId, userId));
    } catch (error) {
      console.error('Error getting CV reviews:', error);
      throw new Error('Failed to get CV reviews');
    }
  }

  async getAllCVReviews(): Promise<(CVReview & { userEmail?: string; firstName?: string })[]> {
    try {
      const reviews = await db
        .select({
          ...schema.cvReviews,
          userEmail: schema.users.email,
          firstName: schema.users.firstName,
        })
        .from(schema.cvReviews)
        .leftJoin(schema.users, eq(schema.cvReviews.userId, schema.users.id));
      return reviews;
    } catch (error) {
      console.error('Error getting all CV reviews:', error);
      throw new Error('Failed to get all CV reviews');
    }
  }

  async updateCVReview(id: number, feedback: string): Promise<CVReview> {
    try {
      const [updated] = await db
        .update(schema.cvReviews)
        .set({ feedback, status: "completed" })
        .where(eq(schema.cvReviews.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating CV review:', error);
      throw new Error('Failed to update CV review');
    }
  }

  async createAuditLog(logEntry: Omit<AuditLog, "id">): Promise<void> {
    try {
      await db.insert(schema.auditLogs).values(logEntry);
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw error to prevent disrupting the main application flow
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      return await db.select().from(schema.products);
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to get products');
    }
  }

  async getProduct(id: number): Promise<Product | undefined> {
    try {
      const [product] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, id));
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw new Error('Failed to get product');
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      const [product] = await db
        .insert(schema.products)
        .values(insertProduct)
        .returning();
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    try {
      const [product] = await db
        .update(schema.products)
        .set(updates)
        .where(eq(schema.products.id, id))
        .returning();
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }
}

export const storage = new DatabaseStorage();