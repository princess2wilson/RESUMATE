import { User, InsertUser, CVReview } from "@shared/schema";
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
  getAllCVReviews(): Promise<CVReview[]>;
  updateCVReview(id: number, feedback: string): Promise<CVReview>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
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
      .values({
        ...review,
        isPromotional: false // Set default value
      })
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
}

export const storage = new DatabaseStorage();