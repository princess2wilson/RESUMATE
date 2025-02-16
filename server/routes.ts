import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import express from "express";
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

// Configure multer to store files in the uploads directory
const uploadsPath = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    // Keep the original filename but make it URL safe
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});

const upload = multer({ storage: storage_config });

export function registerRoutes(app: Express): Server {
  // Configure trust proxy for production environment
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
  }

  // Setup authentication first
  setupAuth(app);

  // Now configure rate limiting after auth is set up
  const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skip: function(req) {
      return req.user != null;
    },
    handler: function (req, res) {
      return res.status(429).json({ 
        error: 'Too Many Requests',
        message: 'Please try again later or log in to get higher limits.'
      });
    }
  });

  // Special limiter for file downloads and admin routes
  const authenticatedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Higher limit for authenticated users
    standardHeaders: true,
    legacyHeaders: false,
    skip: function(req) {
      return req.user?.isAdmin; // Skip rate limiting for admins
    },
    handler: function (req, res) {
      return res.status(429).json({ 
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again in a few minutes.'
      });
    }
  });

  // Apply standard rate limiting to all routes after auth middleware
  app.use(standardLimiter);

  // CV Review routes (require authentication)
  const cvUpload = upload.single("file");

  app.post("/api/cv-review", authenticatedLimiter, (req, res, next) => {
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

      console.log('File upload successful:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        destination: req.file.destination
      });

      try {
        const review = await storage.createCVReview({
          userId: req.user.id,
          fileUrl: req.file.filename,
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

  app.get("/api/cv-reviews", authenticatedLimiter, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const reviews = await storage.getCVReviews(req.user.id);
    res.json(reviews);
  });

  app.get("/api/admin/cv-reviews", authenticatedLimiter, async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const reviews = await storage.getAllCVReviews();
    res.json(reviews);
  });

  app.post("/api/admin/cv-reviews/:id/feedback", authenticatedLimiter, async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const review = await storage.updateCVReview(
      parseInt(req.params.id),
      req.body.feedback
    );
    res.json(review);
  });

  // Handle file downloads
  app.get("/api/cv-reviews/download/:filename", authenticatedLimiter, (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const filename = req.params.filename;
    const filePath = path.join(uploadsPath, filename);

    console.log('File download request:', {
      filename,
      filePath,
      exists: fs.existsSync(filePath),
      uploadsPath
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: "File not found" });
    }

    // Use res.download to properly send the file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error downloading file" });
        }
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}