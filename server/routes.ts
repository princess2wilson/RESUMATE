import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import { insertCVReviewSchema, insertConsultationSchema } from "@shared/schema";

const upload = multer({ dest: "uploads/" });

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // CV Review routes
  app.post("/api/cv-review", upload.single("file"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).send("No file uploaded");

    const review = await storage.createCVReview({
      userId: req.user.id,
      fileUrl: req.file.path,
      status: "pending",
      feedback: null,
      createdAt: new Date().toISOString(),
    });
    res.json(review);
  });

  app.get("/api/cv-reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const reviews = await storage.getCVReviews(req.user.id);
    res.json(reviews);
  });

  app.get("/api/admin/cv-reviews", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const reviews = await storage.getAllCVReviews();
    res.json(reviews);
  });

  app.post("/api/admin/cv-reviews/:id/feedback", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const review = await storage.updateCVReview(
      parseInt(req.params.id),
      req.body.feedback
    );
    res.json(review);
  });

  // Product routes
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  // Consultation routes
  app.post("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsedData = insertConsultationSchema.parse(req.body);
    const consultation = await storage.createConsultation({
      ...parsedData,
      userId: req.user.id,
      status: "pending",
    });
    res.json(consultation);
  });

  app.get("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const consultations = await storage.getConsultations(req.user.id);
    res.json(consultations);
  });

  const httpServer = createServer(app);
  return httpServer;
}
