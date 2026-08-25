import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

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

// Register routes without creating unnecessary HTTP server instances in serverless
registerRoutes({} as any, app);

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Express Error Handler]:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
