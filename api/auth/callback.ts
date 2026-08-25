import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";
import { db } from "../../server/db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "aliados_secret_key_2026_steam_auth";
const COOKIE_NAME = "aliados_session";

function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

async function verifySteamOpenId(query: Record<string, string>): Promise<string | null> {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(query)) {
    if (key.startsWith("openid.")) {
      params.set(key, val);
    }
  }
  params.set("openid.mode", "check_authentication");

  try {
    const response = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const text = await response.text();
    if (text.includes("is_valid:true")) {
      const claimedId = query["openid.claimed_id"] || "";
      const match = claimedId.match(/(?:id\/|id=)(\d+)/);
      return match ? match[1] : null;
    }
  } catch (err) {
    console.error("[SteamAuth] Verification error:", err);
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
    const steamId64 = await verifySteamOpenId(query);

    if (!steamId64) {
      return res.redirect("/?auth_error=steam_failed");
    }

    const steamAccountId = `steam_${steamId64}`;
    const profile = await fetchSteamProfile(steamId64);
    const nickname = profile?.nickname || `Jogador_${steamId64.slice(-6)}`;
    const avatar = profile?.avatar || null;
    const now = new Date();

    // Check existing user by id or steamId64
    const existing = await db.select().from(users).where(eq(users.steamId64, steamId64));
    let userId = steamAccountId;

    if (existing.length > 0) {
      userId = existing[0].id;
      await db
        .update(users)
        .set({
          firstName: nickname,
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
          profileImageUrl: avatar,
          lastLoginAt: now,
          updatedAt: now,
        },
      });
    }

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const token = signToken({ userId, steamId64, expiresAt });

    res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure`);
    res.redirect("/");
  } catch (err) {
    console.error("[SteamAuth Callback Error]:", err);
    res.redirect("/?auth_error=callback_error");
  }
}
