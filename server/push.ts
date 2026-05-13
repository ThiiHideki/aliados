import webpush from "web-push";
import { db } from "./db";
import { appSettings, pushSubscriptions } from "@shared/schema";
import { eq } from "drizzle-orm";

let publicKey = "";
let privateKey = "";
let initialized = false;
let initPromise: Promise<void> | null = null;

const SUBJECT = "mailto:admin@inimigosdabala.local";

async function loadOrCreateKeys() {
  const rows = await db.select().from(appSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  let pub = map.get("vapid_public_key");
  let priv = map.get("vapid_private_key");

  if (!pub || !priv) {
    const keys = webpush.generateVAPIDKeys();
    pub = keys.publicKey;
    priv = keys.privateKey;
    await db
      .insert(appSettings)
      .values({ key: "vapid_public_key", value: pub })
      .onConflictDoUpdate({ target: appSettings.key, set: { value: pub, updatedAt: new Date() } });
    await db
      .insert(appSettings)
      .values({ key: "vapid_private_key", value: priv })
      .onConflictDoUpdate({ target: appSettings.key, set: { value: priv, updatedAt: new Date() } });
    console.log("[Push] VAPID keys gerados e salvos no banco.");
  }
  publicKey = pub;
  privateKey = priv;
  webpush.setVapidDetails(SUBJECT, publicKey, privateKey);
  initialized = true;
}

export async function initPush(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await loadOrCreateKeys();
      console.log("[Push] Inicializado (VAPID).");
    } finally {
      initPromise = null;
    }
  })();
  return initPromise;
}

export function getPublicKey() {
  return publicKey;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export async function sendPushToAll(payload: PushPayload): Promise<{ sent: number; failed: number; total: number }> {
  if (!initialized) await initPush();
  const subs = await db.select().from(pushSubscriptions);
  let sent = 0;
  let failed = 0;
  const stale: number[] = [];

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          JSON.stringify(payload),
          { TTL: 60 * 60 * 6 },
        );
        sent++;
      } catch (err: any) {
        failed++;
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          stale.push(s.id);
        } else {
          console.error("[Push] Falha ao enviar:", err?.statusCode, err?.body || err?.message);
        }
      }
    }),
  );

  if (stale.length > 0) {
    for (const id of stale) {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
    }
    console.log(`[Push] Removidas ${stale.length} inscrições inválidas.`);
  }

  return { sent, failed, total: subs.length };
}
