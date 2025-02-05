import { User, InsertUser, CVReview, Product, Consultation } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cvReviews: Map<number, CVReview>;
  private products: Map<number, Product>;
  private consultations: Map<number, Consultation>;
  sessionStore: session.Store;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.cvReviews = new Map();
    this.products = new Map();
    this.consultations = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed some products
    this.products.set(1, {
      id: 1,
      name: "Professional CV Template",
      description: "Ready-to-use CV template for professionals",
      price: 2999,
      type: "cv_template"
    });
    this.products.set(2, {
      id: 2,
      name: "Cover Letter Guide",
      description: "Comprehensive guide to writing effective cover letters",
      price: 1999,
      type: "guide"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async createCVReview(review: Omit<CVReview, "id">): Promise<CVReview> {
    const id = this.currentId++;
    const cvReview: CVReview = { ...review, id };
    this.cvReviews.set(id, cvReview);
    return cvReview;
  }

  async getCVReviews(userId: number): Promise<CVReview[]> {
    return Array.from(this.cvReviews.values()).filter(
      (review) => review.userId === userId,
    );
  }

  async getAllCVReviews(): Promise<CVReview[]> {
    return Array.from(this.cvReviews.values());
  }

  async updateCVReview(id: number, feedback: string): Promise<CVReview> {
    const review = this.cvReviews.get(id);
    if (!review) throw new Error("Review not found");
    const updated = { ...review, feedback, status: "completed" as const };
    this.cvReviews.set(id, updated);
    return updated;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createConsultation(consultation: Omit<Consultation, "id">): Promise<Consultation> {
    const id = this.currentId++;
    const newConsultation: Consultation = { ...consultation, id };
    this.consultations.set(id, newConsultation);
    return newConsultation;
  }

  async getConsultations(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId,
    );
  }
}

export const storage = new MemStorage();
