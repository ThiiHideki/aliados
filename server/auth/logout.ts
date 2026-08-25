import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "aliados_session";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`);
  res.redirect("/");
}
