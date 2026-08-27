import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

// Prevent unhandled promise rejections from crashing Vercel serverless function containers
process.on("unhandledRejection", (reason: any) => {
  console.error("[Vercel Process] Unhandled Promise Rejection:", reason?.message ?? reason);
});

process.on("uncaughtException", (err: any) => {
  if (err?.code === "57P01") return; // Ignore idle connection drops
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
  }),
);

app.use(express.urlencoded({ extended: false, limit: "15mb" }));

// Register routes
registerRoutes({} as any, app);

// Global error handler - never return 500 status code
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Express Serverless Error Handler]:", err);
  const status = err.status || err.statusCode || 400;
  const message = err.message || "Bad Request";
  if (!res.headersSent) {
    res.status(status).json({ message, success: false });
  }
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error("[Handler Fatal Error]:", err);
    if (!res.headersSent) {
      res.status(400).json({ message: err?.message || "Requisição inválida", success: false });
    }
  }
}
