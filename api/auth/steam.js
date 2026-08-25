"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/auth/steam.ts
var steam_exports = {};
__export(steam_exports, {
  default: () => handler
});
module.exports = __toCommonJS(steam_exports);
function handler(req, res) {
  try {
    const rawProto = req.headers["x-forwarded-proto"] || "https";
    const scheme = rawProto.split(",")[0].trim();
    const rawHost = req.headers["x-forwarded-host"] || req.headers.host || "aliados-virid.vercel.app";
    const host = rawHost.split(",")[0].trim();
    const returnUrl = `${scheme}://${host}/api/auth/callback`;
    const realm = `${scheme}://${host}/`;
    const params = new URLSearchParams({
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": returnUrl,
      "openid.realm": realm,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
    });
    res.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`);
  } catch (err) {
    console.error("[SteamAuth] Initiate error:", err);
    res.redirect("/?auth_error=init_failed");
  }
}
