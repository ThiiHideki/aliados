import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../shared/schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:aliados123%40@db.akvybywdkwyajuvifpic.supabase.co:5432/postgres";

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function resetDb() {
  try {
    if (_client) {
      _client.end({ timeout: 1 }).catch(() => {});
    }
  } catch {}
  _client = null;
  _db = null;
}

export function getDb() {
  if (!_db || !_client) {
    const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === "production";
    _client = postgres(connectionString, {
      prepare: false,
      ssl: { rejectUnauthorized: false },
      max: isVercel ? 5 : 10,
      idle_timeout: 30,
      connect_timeout: 10,
      onnotice: () => {},
    });
    _db = drizzle(_client, { schema });
  }
  return _db;
}

function isConnectionError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  const code = err.code || "";
  return (
    code === "57P01" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    msg.includes("connection_ended") ||
    msg.includes("socket_closed") ||
    msg.includes("connection error") ||
    msg.includes("connection terminated") ||
    msg.includes("connection timeout")
  );
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const instance = getDb() as any;
      const val = instance[prop];
      if (typeof val === "function") {
        return function (...args: any[]) {
          try {
            const res = val.apply(instance, args);
            if (res && typeof res.catch === "function") {
              return res.catch((err: any) => {
                if (isConnectionError(err)) {
                  console.warn("[DB Proxy] Connection error detected, resetting pool for next query:", err?.message || err);
                  resetDb();
                }
                throw err;
              });
            }
            return res;
          } catch (err: any) {
            if (isConnectionError(err)) {
              console.warn("[DB Proxy] Connection error detected, resetting pool:", err?.message || err);
              resetDb();
            }
            throw err;
          }
        };
      }
      return val;
    } catch (err) {
      resetDb();
      return (getDb() as any)[prop];
    }
  },
});
