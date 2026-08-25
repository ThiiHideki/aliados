import type { Express } from "express";
import { storage } from "./storage";

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
      const match = claimedId.match(/\/id\/(\d+)$/);
      return match ? match[1] : null;
    }
  } catch (err) {
    console.error("Steam OpenID verification error:", err);
  }
  return null;
}

async function fetchSteamProfile(
  steamId64: string
): Promise<{ nickname: string; avatar: string | null } | null> {
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
  } catch (err) {
    console.error("Steam profile fetch error:", err);
    return null;
  }
}

export function setupSteamAuth(app: Express) {
  app.get("/api/auth/steam", (req, res) => {
    const scheme = (req.headers["x-forwarded-proto"] as string) || req.protocol;
    const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || req.hostname;
    const returnUrl = `${scheme}://${host}/api/auth/steam/callback`;
    const realm = `${scheme}://${host}/`;

    const params = new URLSearchParams({
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": returnUrl,
      "openid.realm": realm,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    });

    res.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`);
  });

  app.get("/api/auth/steam/callback", async (req: any, res) => {
    try {
      const query = req.query as Record<string, string>;
      const steamId64 = await verifySteamOpenId(query);

      if (!steamId64) {
        console.error("Steam OpenID verification failed");
        return res.redirect("/?auth_error=steam_failed");
      }

      // Check for both possible accounts:
      // - steam_ account: created automatically by CSV import (id = "steam_XXXX")
      // - linked account: any user who manually linked their steamId64 (Replit account, etc.)
      const steamAccountId = `steam_${steamId64}`;
      const [steamAccount, linkedAccount] = await Promise.all([
        storage.getUser(steamAccountId),
        storage.getUserBySteamId(steamId64),
      ]);

      let user: Awaited<ReturnType<typeof storage.getUser>>;

      if (steamAccount && linkedAccount && steamAccount.id !== linkedAccount.id) {
        // Two different accounts share the same SteamID64 — merge them.
        // The non-steam_ account is the "primary" one (user deliberately linked it).
        // Merge the steam_ (CSV) account INTO the linked (Replit) account.
        console.log(`[SteamAuth] Merging ${steamAccount.id} (CSV) → ${linkedAccount.id} (linked). SteamID: ${steamId64}`);
        const merged = await storage.mergeUsers(steamAccount.id, linkedAccount.id);
        if (merged) {
          await storage.recalculateUserStats(linkedAccount.id);
          user = await storage.getUser(linkedAccount.id);
        } else {
          user = linkedAccount;
        }
      } else if (linkedAccount) {
        // Single account found via steamId64 field (could be steam_ or linked Replit)
        user = linkedAccount;
      } else if (steamAccount) {
        // Only the steam_ CSV account exists (linkedAccount was null or same)
        user = steamAccount;
      } else {
        // No account found — create a new steam_ account
        const profile = await fetchSteamProfile(steamId64);
        const nickname = profile?.nickname || `Jogador_${steamId64.slice(-6)}`;
        const avatar = profile?.avatar || null;
        user = await storage.upsertUser({
          id: steamAccountId,
          email: null,
          firstName: nickname,
          lastName: null,
          profileImageUrl: avatar,
          steamId64,
        });
      }

      if (!user) {
        console.error("[SteamAuth] Failed to resolve user after Steam login");
        return res.redirect("/?auth_error=steam_failed");
      }

      // Refresh profile from Steam (nickname / avatar)
      const profile = await fetchSteamProfile(steamId64);
      if (profile) {
        await storage.upsertUser({
          id: user.id,
          email: user.email,
          firstName: profile.nickname,
          lastName: user.lastName,
          profileImageUrl: profile.avatar || user.profileImageUrl,
          steamId64,
        });
        user = (await storage.getUser(user.id)) || user;
      }

      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      const sessionUser = {
        claims: { sub: user.id },
        expires_at: expiresAt,
        isSteamAuth: true,
        steamId64,
      };

      req.login(sessionUser, (err: any) => {
        if (err) {
          console.error("Session login error after Steam auth:", err);
          return res.redirect("/?auth_error=session_failed");
        }
        res.redirect("/");
      });
    } catch (error) {
      console.error("Steam auth callback error:", error);
      res.redirect("/?auth_error=steam_failed");
    }
  });
}
