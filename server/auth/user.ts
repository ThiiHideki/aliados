import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "aliados_secret_key_2026_steam_auth";
const COOKIE_NAME = "aliados_session";

function verifyToken(token: string): { userId: string; expiresAt: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expected = createHmac("sha256", SECRET).update(data).digest("base64url");
    if (signature !== expected) return null;
    const decoded = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (decoded.expiresAt && Date.now() > decoded.expiresAt) return null;
    return decoded;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Try Bearer Token from Authorization Header
    let token: string | undefined;
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // 2. Try Query Parameter
    if (!token && typeof req.query?.token === "string") {
      token = req.query.token;
    }

    // 3. Try Session Cookie
    if (!token) {
      const rawCookie = req.headers?.cookie || req.headers?.Cookie || "";
      const cookies = Object.fromEntries(
        rawCookie.split(";").map((c: string) => {
          const [k, ...v] = c.trim().split("=");
          return [k, v.join("=")];
        })
      );
      token = cookies[COOKIE_NAME];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rows = await db.select().from(users).where(eq(users.id, payload.userId));
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err: any) {
    console.error("[Auth User Error]:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
