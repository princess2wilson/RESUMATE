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
    cookie: {
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'resumate.sid'
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
        callbackURL: 'https://d3f2dcce-f667-40d9-9996-81817805ae6a-00-3av40ax91wgqg.picard.replit.dev/api/auth/google/callback',
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
        callbackURL: 'https://d3f2dcce-f667-40d9-9996-81817805ae6a-00-3av40ax91wgqg.picard.replit.dev/api/auth/linkedin/callback',
        scope: ["r_emailaddress", "r_liteprofile"],
        passReqToCallback: true,
        state: true,
        proxy: true
      },
      async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          console.log("LinkedIn OAuth Profile Data:", {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName,
            accessToken: accessToken ? "Present" : "Missing",
            hasRefreshToken: !!refreshToken
          });

          let user = await storage.getUserByLinkedinId(profile.id);
          console.log("LinkedIn user lookup result:", user ? "Found existing user" : "No existing user found");

          if (!user) {
            console.log("Creating new user from LinkedIn profile");
            const username = profile.emails?.[0]?.value || 
                              profile.displayName?.replace(/\s+/g, '_').toLowerCase() || 
                              `linkedin_${profile.id}`;

            try {
              user = await storage.createUser({
                username,
                password: await hashPassword(randomBytes(32).toString("hex")),
                linkedinId: profile.id,
                email: profile.emails?.[0]?.value,
              });
              console.log("Successfully created new user:", { userId: user.id, username });
            } catch (createError) {
              console.error("Failed to create new user:", createError);
              return done(createError);
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("LinkedIn authentication error:", error);
          return done(error);
        }
      }
    )
  );

  // LinkedIn auth routes with enhanced logging
  app.get(
    "/api/auth/linkedin",
    (req, res, next) => {
      console.log("Starting LinkedIn authentication", {
        headers: req.headers,
        session: req.session ? "Present" : "Missing"
      });

      passport.authenticate("linkedin")(req, res, next);
    }
  );

  app.get(
    "/api/auth/linkedin/callback",
    (req, res, next) => {
      console.log("LinkedIn callback received", {
        query: req.query,
        headers: req.headers,
        session: req.session ? "Present" : "Missing",
        cookies: req.cookies
      });

      if (req.query.error) {
        console.error("LinkedIn OAuth Error:", {
          error: req.query.error,
          description: req.query.error_description
        });
        return res.redirect('/auth?error=' + encodeURIComponent(req.query.error_description as string));
      }

      passport.authenticate("linkedin", (err: any, user: any, info: any) => {
        if (err) {
          console.error("LinkedIn callback authentication error:", err);
          return res.redirect('/auth?error=' + encodeURIComponent(err.message));
        }

        if (!user) {
          console.error("LinkedIn auth: No user returned", { info });
          return res.redirect('/auth?error=authentication_failed');
        }

        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error after LinkedIn auth:", loginErr);
            return res.redirect('/auth?error=login_failed');
          }

          console.log("LinkedIn authentication successful, redirecting to dashboard");
          return res.redirect('/dashboard');
        });
      })(req, res, next);
    }
  );

  // Google auth routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google_auth_failed" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );

  // Session serialization
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.error("User not found during deserialization:", id);
        return done(new Error('User not found'), null);
      }
      console.log("Deserialized user:", id);
      done(null, user);
    } catch (error) {
      console.error("Error during deserialization:", error);
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