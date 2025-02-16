import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import express from "express";
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const upload = multer({ dest: "uploads/" });

export function registerRoutes(app: Express): Server {
  // Configure trust proxy for production environment
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
  }

  // Configure rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req, res) {
      return res.status(429).json({ error: 'Too Many Requests' });
    }
  });

  // Apply rate limiting to all routes
  app.use(limiter);

  setupAuth(app);

  // Configure uploads directory
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  console.log('Uploads directory path:', uploadsPath);

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('Created uploads directory');
  }

  // CV Review routes (require authentication)
  const cvUpload = upload.single("file");

  app.post("/api/cv-review", (req, res, next) => {
    // Check authentication first
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // If authenticated, proceed with file upload
    cvUpload(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).json({ error: 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        const fileName = req.file.originalname || path.basename(req.file.path);
        const review = await storage.createCVReview({
          userId: req.user.id,
          fileUrl: fileName, // Store just the filename
          status: "pending",
          feedback: null,
          createdAt: new Date().toISOString(),
          isPromotional: false,
          reviewedFileUrl: null,
          isPaid: false
        });
        res.json(review);
      } catch (error) {
        console.error('Error creating CV review:', error);
        res.status(500).json({ error: 'Failed to create CV review' });
      }
    });
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

  const httpServer = createServer(app);
  return httpServer;
}