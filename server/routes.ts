import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import { insertCVReviewSchema, insertConsultationSchema } from "@shared/schema";
import Stripe from "stripe";

const upload = multer({ dest: "uploads/" });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const PRICE_IDS = {
  starter: "price_starter", // Replace with actual Stripe price IDs
  pro: "price_pro",
  enterprise: "price_enterprise",
};

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

  // Subscription routes
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { priceId, planType } = req.body;

    // Create or retrieve the customer
    let customer;
    const existingCustomer = await storage.getStripeCustomer(req.user.id);

    if (existingCustomer) {
      customer = existingCustomer;
    } else {
      customer = await stripe.customers.create({
        metadata: {
          userId: req.user.id.toString(),
        },
      });
      await storage.setStripeCustomer(req.user.id, customer.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.protocol}://${req.get("host")}/dashboard?success=true`,
      cancel_url: `${req.protocol}://${req.get("host")}/?canceled=true`,
      metadata: {
        userId: req.user.id.toString(),
        planType,
      },
    });

    res.json({ url: session.url });
  });

  app.post("/api/webhooks", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await storage.createSubscription({
          userId: parseInt(session.metadata.userId),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          planType: session.metadata.planType,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await storage.updateSubscription(subscription.id, {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }
    }

    res.json({ received: true });
  });

  app.get("/api/subscription", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const subscription = await storage.getSubscription(req.user.id);
    res.json(subscription);
  });

  const httpServer = createServer(app);
  return httpServer;
}