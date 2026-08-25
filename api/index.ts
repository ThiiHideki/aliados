import express from "express";
import { createServer } from "http";

let app: any = null;

async function getApp() {
  if (app) return app;

  const instance = express();
  const httpServer = createServer(instance);

  instance.set("trust proxy", 1);

  instance.use(
    express.json({
      limit: "15mb",
      verify: (req: any, _res: any, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );

  instance.use(express.urlencoded({ extended: false, limit: "15mb" }));

  // Dynamically import routes so any initialization error is caught
  const { registerRoutes } = await import("../server/routes");
  registerRoutes(httpServer, instance);

  // Global error handler
  instance.use((err: any, _req: any, res: any, _next: any) => {
    console.error("[Express Error]:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  app = instance;
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (err: any) {
    console.error("[Vercel Handler Error]:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Initialization Failed",
        message: err?.message || String(err),
        stack: err?.stack,
      });
    }
  }
}
