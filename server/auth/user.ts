import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "aliados_secret_key_2026_steam_auth";
const COOKIE_NAME = "aliados_session";

function verifyToken(token: string): { userId: string; steamId64?: string; expiresAt: number } | null {
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

    // Try fetching full user record from database
    try {
      const rows = await db.select().from(users).where(eq(users.id, payload.userId));
      if (rows.length > 0) {
        return res.status(200).json(rows[0]);
      }
    } catch (dbErr) {
      console.error("[Auth User DB Fetch Warning]:", dbErr);
    }

    const rawSteamId = payload.steamId64 || payload.userId.replace("steam_", "");
    const fallbackUser = {
      id: payload.userId,
      steamId64: rawSteamId,
      nickname: `Jogador_${rawSteamId.slice(-6)}`,
      firstName: `Jogador_${rawSteamId.slice(-6)}`,
      lastName: null,
      email: null,
      profileImageUrl: `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`,
      isAdmin: false,
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalHeadshots: 0,
      totalDamage: 0,
      totalMatches: 0,
      matchesWon: 0,
      matchesLost: 0,
      totalRoundsPlayed: 0,
      roundsWon: 0,
      totalMvps: 0,
    };

    return res.status(200).json(fallbackUser);
  } catch (err: any) {
    console.error("[Auth User Error]:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
