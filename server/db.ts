import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:aliados123%40@db.akvybywdkwyajuvifpic.supabase.co:5432/postgres";

export const pool = new Pool({
  connectionString,
  ssl:
    connectionString.includes("supabase") ||
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

pool.on("error", (err: any) => {
  console.error("[PG Pool Error]:", err.message);
});

export const db = drizzle({ client: pool, schema });

