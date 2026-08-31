// server/auth/logout.ts
var COOKIE_NAME = "aliados_session";
function handler(_req, res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure`);
  res.setHeader("Location", "/");
  res.status(302).end();
}
export {
  handler as default
};
