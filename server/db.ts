import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../shared/schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:aliados123%40@db.akvybywdkwyajuvifpic.supabase.co:5432/postgres";

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === "production";
    _client = postgres(connectionString, {
      prepare: false,
      ssl: { rejectUnauthorized: false },
      max: isVercel ? 1 : 10,
      idle_timeout: 1,
      connect_timeout: 5,
    });
    _db = drizzle(_client, { schema });
  }
  return _db;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
