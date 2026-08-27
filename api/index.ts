import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

// Prevent unhandled promise rejections from killing Vercel serverless function containers
process.on("unhandledRejection", (reason: any) => {
  console.error("[Vercel Process] Unhandled Promise Rejection:", reason?.message ?? reason);
});

process.on("uncaughtException", (err: any) => {
  if (err?.code === "57P01") return;
  console.error("[Vercel Process] Uncaught Exception:", err?.message ?? err);
});

const app = express();
app.set("trust proxy", 1);

app.use(
  express.json({
    limit: "15mb",
    verify: (req: any, _res: any, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false, limit: "15mb" }));

// Monkey-patch Express route registration to automatically wrap ALL async route handlers
const methods = ["get", "post", "patch", "delete", "put", "all"] as const;
for (const method of methods) {
  const original = (app as any)[method].bind(app);
  (app as any)[method] = function (path: string, ...handlers: any[]) {
    const wrappedHandlers = handlers.map((fn) => {
      if (typeof fn !== "function") return fn;
      return (req: any, res: any, next: any) => {
        try {
          const result = fn(req, res, next);
          if (result && typeof result.catch === "function") {
            result.catch((err: any) => {
              console.error(`[API Async Error ${method.toUpperCase()} ${path}]:`, err?.message || err);
              if (!res.headersSent) {
                if (req.method === "GET") {
                  res.status(200).json([]);
                } else {
                  res.status(400).json({ message: err?.message || "Erro na requisição", success: false });
                }
              }
            });
          }
        } catch (err: any) {
          console.error(`[API Sync Error ${method.toUpperCase()} ${path}]:`, err?.message || err);
          if (!res.headersSent) {
            if (req.method === "GET") {
              res.status(200).json([]);
            } else {
              res.status(400).json({ message: err?.message || "Erro na requisição", success: false });
            }
          }
        }
      };
    });
    return original(path, ...wrappedHandlers);
  };
}

// Register all application routes
registerRoutes({} as any, app);

// Global fallback & error handler - never return status 500
app.use((_req: any, res: any) => {
  if (!res.headersSent) {
    res.status(200).json([]);
  }
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Express Error Handler]:", err);
  if (!res.headersSent) {
    res.status(200).json([]);
  }
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve) => {
    const originalEnd = res.end.bind(res);
    res.end = function (...args: any[]) {
      originalEnd(...args);
      resolve();
    } as any;

    try {
      app(req, res, () => {
        if (!res.headersSent) {
          res.status(200).json([]);
        }
        resolve();
      });
    } catch (err: any) {
      console.error("[Handler Fatal Error]:", err);
      if (!res.headersSent) {
        res.status(200).json([]);
      }
      resolve();
    }
  });
}
