import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use connection pooling with Neon's pooler
const connectionString = process.env.DATABASE_URL.replace('.us-east-1.aws', '-pooler.us-east-1.aws');
export const pool = new Pool({ 
  connectionString,
  max: 10,
  ssl: true,
  idleTimeoutMillis: 10000
});
export const db = drizzle({ client: pool, schema });
