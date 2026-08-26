import { createHmac } from "crypto";
import type { Express } from "express";
import { storage } from "./storage";

const SECRET = process.env.SESSION_SECRET || "aliados_secret_key_2026_steam_auth";
const COOKIE_NAME = "aliados_session";

export function signSessionToken(payload: { userId: string; steamId64: string; expiresAt: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; steamId64: string; expiresAt: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSignature = createHmac("sha256", SECRET).update(data).digest("base64url");
    if (signature !== expectedSignature) return null;
    const decoded = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (decoded.expiresAt && Date.now() > decoded.expiresAt) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getSessionFromReq(req: any): { userId: string; steamId64: string } | null {
  try {
    let token: string | undefined;

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token && typeof req.query?.token === "string") {
      token = req.query.token;
    }

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

    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
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
    console.error("[SteamAuth] OpenID verification error:", err);
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
  } catch (err) {
    console.error("[SteamAuth] Profile fetch error:", err);
    return null;
  }
}

export function setupNativeSteamAuth(app: Express) {
  // 1. Initiate Steam Login
  const handleSteamLogin = (req: any, res: any) => {
    try {
      const rawProto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
      const scheme = rawProto.split(",")[0].trim();
      const rawHost = (req.headers["x-forwarded-host"] as string) || req.headers.host || req.hostname || "localhost";
      const host = rawHost.split(",")[0].trim();

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
    } catch (err) {
      console.error("[SteamAuth] Initiate error:", err);
      res.redirect("/?auth_error=init_failed");
    }
  };

  app.get("/api/auth/steam", handleSteamLogin);
  app.get("/auth/steam", handleSteamLogin);

  // 2. Steam Callback
  const handleSteamCallback = async (req: any, res: any) => {
    try {
      const query = req.query as Record<string, string>;
      const steamId64 = await verifySteamOpenId(query);

      if (!steamId64) {
        console.error("[SteamAuth] Steam OpenID verification failed");
        return res.redirect("/?auth_error=steam_failed");
      }

      const steamAccountId = `steam_${steamId64}`;
      const [steamAccount, linkedAccount] = await Promise.all([
        storage.getUser(steamAccountId).catch(() => undefined),
        storage.getUserBySteamId(steamId64).catch(() => undefined),
      ]);

      let user: Awaited<ReturnType<typeof storage.getUser>>;

      if (steamAccount && linkedAccount && steamAccount.id !== linkedAccount.id) {
        const merged = await storage.mergeUsers(steamAccount.id, linkedAccount.id).catch(() => null);
        if (merged) {
          await storage.recalculateUserStats(linkedAccount.id).catch(() => {});
          user = (await storage.getUser(linkedAccount.id)) || linkedAccount;
        } else {
          user = linkedAccount;
        }
      } else if (linkedAccount) {
        user = linkedAccount;
      } else if (steamAccount) {
        user = steamAccount;
      } else {
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
        return res.redirect("/?auth_error=steam_failed");
      }

      // Sync profile if available
      const profile = await fetchSteamProfile(steamId64);
      if (profile) {
        await storage.upsertUser({
          id: user.id,
          email: user.email,
          firstName: profile.nickname,
          lastName: user.lastName,
          profileImageUrl: profile.avatar || user.profileImageUrl,
          steamId64,
        }).catch((err) => console.error("[SteamAuth] Profile refresh error:", err));
        user = (await storage.getUser(user.id)) || user;
      }

      // Generate session token (valid 30 days)
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      const token = signSessionToken({ userId: user.id, steamId64, expiresAt });

      const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
      const cookieHeader = `${COOKIE_NAME}=${token}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`;

      res.setHeader("Set-Cookie", cookieHeader);
      res.redirect("/");
    } catch (error) {
      console.error("[SteamAuth] Callback error:", error);
      res.redirect("/?auth_error=steam_failed");
    }
  };

  app.get("/api/auth/steam/callback", handleSteamCallback);
  app.get("/auth/steam/callback", handleSteamCallback);

  // 3. Get Current Logged-in User
  const handleGetUser = async (req: any, res: any) => {
    try {
      const session = getSessionFromReq(req);
      if (!session || !session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      console.error("[SteamAuth] GetUser error:", error);
      res.status(401).json({ message: "Failed to fetch user" });
    }
  };

  app.get("/api/auth/user", handleGetUser);
  app.get("/auth/user", handleGetUser);

  // 4. Logout
  const handleLogout = (_req: any, res: any) => {
    const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
    const cookieHeader = `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`;
    res.setHeader("Set-Cookie", cookieHeader);
    res.redirect("/");
  };

  app.get("/api/logout", handleLogout);
  app.get("/api/auth/logout", handleLogout);
  app.get("/auth/logout", handleLogout);
}

export const isAuthenticated = async (req: any, res: any, next: any) => {
  try {
    const session = getSessionFromReq(req);
    if (!session || !session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await storage.getUser(session.userId);
    if (!user && session.steamId64) {
      user = await storage.getUserBySteamId(session.steamId64);
    }

    if (!user) {
      const isHardcodedAdmin = session.steamId64 === "76561198308656936";
      user = {
        id: session.userId,
        steamId64: session.steamId64,
        nickname: `Jogador_${session.steamId64 ? session.steamId64.slice(-6) : "000000"}`,
        isAdmin: isHardcodedAdmin,
      } as any;
    }

    if (session.steamId64 === "76561198308656936") {
      user.isAdmin = true;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[isAuthenticated Error]:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
