import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("supabase") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined,
});

pool.on("error", (err: any) => {
  console.error("PG Pool error:", err.message);
});

export const db = drizzle({ client: pool, schema });

