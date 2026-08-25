import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const rawProto = (req.headers["x-forwarded-proto"] as string) || "https";
    const scheme = rawProto.split(",")[0].trim();
    const rawHost = (req.headers["x-forwarded-host"] as string) || req.headers.host || "aliados-virid.vercel.app";
    const host = rawHost.split(",")[0].trim();

    const returnUrl = `${scheme}://${host}/api/auth/callback`;
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
}
