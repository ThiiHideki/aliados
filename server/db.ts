import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

let _pool: InstanceType<typeof Pool> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getPool(): InstanceType<typeof Pool> {
  if (!_pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgresql://postgres:aliados123%40@db.akvybywdkwyajuvifpic.supabase.co:5432/postgres";

    _pool = new Pool({
      connectionString,
      ssl:
        connectionString.includes("supabase") ||
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
      max: 5,
      idleTimeoutMillis: 3000,
      connectionTimeoutMillis: 5000,
    });

    _pool.on("error", (err: any) => {
      console.error("[PG Pool Error]:", err?.message || err);
    });
  }
  return _pool;
}

export const pool = new Proxy({} as any, {
  get(_target, prop) {
    return (getPool() as any)[prop];
  },
});

export const db = new Proxy({} as any, {
  get(_target, prop) {
    if (!_db) {
      _db = drizzle({ client: getPool(), schema });
    }
    return (_db as any)[prop];
  },
});
