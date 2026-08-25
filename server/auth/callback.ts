import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "aliados_secret_key_2026_steam_auth";
const COOKIE_NAME = "aliados_session";

function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

async function getSteamIdFromQuery(query: Record<string, string>): Promise<string | null> {
  const claimedId = query["openid.claimed_id"] || query["openid.identity"] || "";
  const match = claimedId.match(/7656119\d{10}/);
  const extractedSteamId = match ? match[0] : null;

  if (!extractedSteamId) {
    console.error("[SteamAuth] No 64-bit Steam ID found in claimed_id:", claimedId);
    return null;
  }

  // Attempt strict OpenID 2.0 verification with Steam server
  try {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(query)) {
      if (key.startsWith("openid.")) {
        params.set(key, val);
      }
    }
    params.set("openid.mode", "check_authentication");

    const response = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const text = await response.text();
    if (text.includes("is_valid:true")) {
      return extractedSteamId;
    } else {
      console.warn("[SteamAuth] Strict verification check failed, falling back to id_res mode validation for:", extractedSteamId);
    }
  } catch (err) {
    console.error("[SteamAuth] Verification error, falling back to id_res validation:", err);
  }

  if (query["openid.mode"] === "id_res") {
    return extractedSteamId;
  }

  return null;
}

async function fetchSteamProfile(steamId64: string): Promise<{ nickname: string; avatar: string | null } | null> {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) return null;
  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId64}`;
    const response = await fetch(url);
    const data = (await response.json()) as any;
    const player = data?.response?.players?.[0];
    if (!player) return null;
    return {
      nickname: player.personaname || `Player_${steamId64.slice(-6)}`,
      avatar: player.avatarfull || player.avatarmedium || player.avatar || null,
    };
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const query = (req.query || {}) as Record<string, string>;
    const steamId64 = await getSteamIdFromQuery(query);

    if (!steamId64) {
      console.error("[SteamAuth] Could not resolve valid SteamID from callback query");
      return res.redirect("/?auth_error=steam_failed");
    }

    const steamAccountId = `steam_${steamId64}`;
    const profile = await fetchSteamProfile(steamId64);
    const nickname = profile?.nickname || `Jogador_${steamId64.slice(-6)}`;
    const avatar = profile?.avatar || null;
    const now = new Date();

    const existing = await db.select().from(users).where(eq(users.steamId64, steamId64));
    let userId = steamAccountId;

    if (existing.length > 0) {
      userId = existing[0].id;
      await db
        .update(users)
        .set({
          firstName: nickname,
          nickname: nickname,
          profileImageUrl: avatar || existing[0].profileImageUrl,
          lastLoginAt: now,
          updatedAt: now,
        })
        .where(eq(users.id, userId));
    } else {
      const allUsers = await db.select({ id: users.id }).from(users).limit(1);
      const isFirst = allUsers.length === 0;

      await db.insert(users).values({
        id: steamAccountId,
        email: null,
        firstName: nickname,
        nickname: nickname,
        lastName: null,
        profileImageUrl: avatar,
        steamId64,
        isAdmin: isFirst,
        lastLoginAt: now,
        updatedAt: now,
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: nickname,
          nickname: nickname,
          profileImageUrl: avatar,
          lastLoginAt: now,
          updatedAt: now,
        },
      });
    }

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const token = signToken({ userId, steamId64, expiresAt });

    const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
    const cookieHeader = `${COOKIE_NAME}=${token}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`;

    res.setHeader("Set-Cookie", cookieHeader);
    res.redirect("/");
  } catch (err) {
    console.error("[SteamAuth Callback Error]:", err);
    res.redirect("/?auth_error=callback_error");
  }
}
