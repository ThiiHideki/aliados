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

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Prevent unhandled 'error' events from crashing the process
// Neon terminates idle connections (code 57P01) which is normal behaviour
pool.on('error', (err: any) => {
  if (err.code === '57P01') {
    // Administrative termination of idle connection — expected with Neon serverless
    return;
  }
  console.error('PG Pool error:', err.message);
});

export const db = drizzle({ client: pool, schema });
