import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
const httpServer = createServer(app);

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

// Diagnostic ping
app.get("/api/ping", (_req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// Register all routes
registerRoutes(httpServer, app);

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Express Error]:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default app;
