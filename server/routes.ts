import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import { insertCVReviewSchema } from "@shared/schema";
import Stripe from "stripe";

const upload = multer({ dest: "uploads/" });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Add this new route to help with OAuth configuration
  app.get("/api/auth/config", (req, res) => {
    const domain = 'https://d3f2dcce-f667-40d9-9996-81817805ae6a-00-3av40ax91wgqg.picard.replit.dev';

    res.json({
      google: {
        redirectUrl: `${domain}/api/auth/google/callback`,
        instructions: [
          "1. Go to Google Cloud Console (https://console.cloud.google.com)",
          "2. Select your project",
          "3. Go to APIs & Services > OAuth Consent Screen",
          "4. Add your app name and authorized domain",
          "5. Go to Credentials > OAuth 2.0 Client IDs",
          "6. Add the redirect URI listed above",
          "7. Make sure to add the domain to authorized domains"
        ]
      },
      linkedin: {
        redirectUrl: `${domain}/api/auth/linkedin/callback`,
        instructions: [
          "1. Go to LinkedIn Developer Console",
          "2. Select your app",
          "3. Go to Auth > OAuth 2.0 settings",
          "4. Add the redirect URI listed above"
        ]
      }
    });
  });

  // CV Review routes (require authentication)
  app.post("/api/cv-review", upload.single("file"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).send("No file uploaded");

    try {
      const review = await storage.createCVReview({
        userId: req.user.id,
        fileUrl: req.file.path,
        status: "pending",
        feedback: null,
        createdAt: new Date().toISOString(),
        isPromotional: false
      });
      res.json(review);
    } catch (error) {
      console.error('Error creating CV review:', error);
      res.status(500).json({ error: 'Failed to create CV review' });
    }
  });

  // Product routes (no auth required)
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Stripe checkout (no auth required)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { productId } = req.body;
      const product = await storage.getProduct(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Create Stripe Product if it doesn't exist
      let stripeProduct = product.stripeProductId;
      let stripePrice = product.stripePriceId;

      if (!stripeProduct || !stripePrice) {
        const newStripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description,
        });

        const newStripePrice = await stripe.prices.create({
          product: newStripeProduct.id,
          unit_amount: product.price,
          currency: 'usd',
        });

        // Update product with Stripe IDs
        await storage.updateProduct(product.id, {
          stripeProductId: newStripeProduct.id,
          stripePriceId: newStripePrice.id,
        });

        stripeProduct = newStripeProduct.id;
        stripePrice = newStripePrice.id;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: stripePrice,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/resources?success=true`,
        cancel_url: `${req.protocol}://${req.get("host")}/resources?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
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

  app.get("/api/subscription", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const subscription = await storage.getSubscription(req.user.id);
    res.json(subscription);
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


  const httpServer = createServer(app);
  return httpServer;
}