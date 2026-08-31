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

    let url = connectionString;
    if (isVercel && url.includes(".supabase.co:5432")) {
      url = url.replace(".supabase.co:5432", ".supabase.co:6543");
    }

    _client = postgres(url, {
      prepare: false,
      ssl: { rejectUnauthorized: false },
      max: isVercel ? 2 : 10,
      idle_timeout: 10,
      connect_timeout: 10,
      max_lifetime: 60,
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
    msg.includes("connection timeout") ||
    msg.includes("too many clients")
  );
}

function makeSafeProxy(obj: any): any {
  if (!obj || (typeof obj !== "object" && typeof obj !== "function")) {
    return obj;
  }

  return new Proxy(obj, {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);

      if (prop === "then" && typeof val === "function") {
        return function (onFulfilled?: any, onRejected?: any) {
          return val.call(target, onFulfilled, (err: any) => {
            if (isConnectionError(err)) {
              console.warn("[DB SafeProxy] Connection error detected, resetting pool:", err?.message || err);
              resetDb();
            }
            if (typeof onRejected === "function") {
              return onRejected(err);
            }
            throw err;
          });
        };
      }

      if (typeof val === "function") {
        return function (...args: any[]) {
          try {
            const res = val.apply(target, args);
            return makeSafeProxy(res);
          } catch (err: any) {
            if (isConnectionError(err)) {
              console.warn("[DB SafeProxy] Synchronous call connection error, resetting pool:", err?.message || err);
              resetDb();
            }
            throw err;
          }
        };
      }

      return makeSafeProxy(val);
    },
  });
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
            return makeSafeProxy(res);
          } catch (err: any) {
            if (isConnectionError(err)) {
              console.warn("[DB Proxy] Connection error detected, resetting pool:", err?.message || err);
              resetDb();
            }
            throw err;
          }
        };
      }
      return makeSafeProxy(val);
    } catch (err) {
      resetDb();
      return makeSafeProxy((getDb() as any)[prop]);
    }
  },
});
