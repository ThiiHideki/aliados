// server/auth/logout.ts
var COOKIE_NAME = "aliados_session";
function handler(_req, res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`);
  res.redirect("/");
}
export {
  handler as default
};
