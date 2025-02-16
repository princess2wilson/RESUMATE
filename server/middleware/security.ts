import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import { storage } from '../storage'

// Rate limiting configuration
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Audit logging middleware
export const auditLogger = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Only log after response is sent
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      userId: req.user?.id || null,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date(),
      duration,
      requestBody: req.method !== 'GET' ? JSON.stringify(req.body) : null,
    };

    try {
      await storage.createAuditLog(logEntry);
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  });

  next();
}

// Security headers middleware using helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://*.calendly.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.calendly.com", "https://assets.calendly.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.calendly.com", "https://assets.calendly.com"],
      imgSrc: ["'self'", "data:", "https:", "https://*.calendly.com", "https://assets.calendly.com"],
      connectSrc: ["'self'", "https://api.openai.com", "wss:", "ws:", "https://*.calendly.com", "https://assets.calendly.com"],
      fontSrc: ["'self'", "data:", "https:", "https://fonts.gstatic.com", "https://*.calendly.com", "https://assets.calendly.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://*.calendly.com", "https://calendly.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding of resources
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
})