import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await storage.getUserByGoogleId(profile.id);

          if (!user) {
            // Create new user if doesn't exist
            user = await storage.createUser({
              username: profile.emails?.[0]?.value || `google_${profile.id}`,
              password: await hashPassword(randomBytes(32).toString("hex")),
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // LinkedIn Strategy
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        callbackURL: `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/linkedin/callback`,
        scope: ["r_emailaddress", "r_liteprofile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await storage.getUserByLinkedinId(profile.id);

          if (!user) {
            // Create new user if doesn't exist
            user = await storage.createUser({
              username: profile.emails?.[0]?.value || `linkedin_${profile.id}`,
              password: await hashPassword(randomBytes(32).toString("hex")),
              linkedinId: profile.id,
              email: profile.emails?.[0]?.value,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Local auth routes
  app.post("/api/register", async (req, res) => {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({
          error: "Username and password are required"
        });
      }

      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({
          error: "Username already exists"
        });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            error: "Error during login after registration"
          });
        }
        res.status(201).json(user);
      });
    } catch (error) {
      res.status(500).json({
        error: "Registration failed. Please try again."
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({
          error: "Login failed. Please try again."
        });
      }

      if (!user) {
        return res.status(401).json({
          error: info?.message || "Invalid username or password"
        });
      }

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            error: "Error during login. Please try again."
          });
        }
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Google auth routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );

  // LinkedIn auth routes
  app.get(
    "/api/auth/linkedin",
    passport.authenticate("linkedin")
  );

  app.get(
    "/api/auth/linkedin/callback",
    passport.authenticate("linkedin", { failureRedirect: "/auth" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          error: "Logout failed. Please try again."
        });
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: "Not authenticated"
      });
    }
    res.json(req.user);
  });
}