import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();
const httpServer = createServer(app);

app.set("trust proxy", 1);

// Route rewrite helper for Vercel Serverless
app.use((req: any, _res: any, next: any) => {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? "" : "/") + req.url;
  }
  next();
});

// Diagnostic health endpoints
app.get("/api/ping", (_req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const { db } = await import("./db");
    const { sql } = await import("drizzle-orm");
    const result = await db.execute(sql`SELECT NOW()`);
    res.status(200).json({ status: "ok", db: "connected", result: result.rows });
  } catch (err: any) {
    console.error("[DB Test Error]:", err);
    res.status(500).json({ status: "error", message: err.message || String(err), stack: err.stack });
  }
});

app.use(
  express.json({
    limit: "15mb",
    verify: (req: any, _res: any, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "15mb" }));

// Register routes synchronously at module load time
registerRoutes(httpServer, app);

// Global error handler middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Express Error]:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default app;
