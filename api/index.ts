import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    limit: "15mb",
    verify: (req: any, _res: any, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "15mb" }));

let initialized = false;

export default async function handler(req: any, res: any) {
  try {
    if (!initialized) {
      await registerRoutes(httpServer, app);
      
      // Global error handler middleware
      app.use((err: any, _req: any, res: any, _next: any) => {
        console.error("[API Error]:", err);
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });

      initialized = true;
    }
    return app(req, res);
  } catch (err: any) {
    console.error("[Lambda Error]:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
}
