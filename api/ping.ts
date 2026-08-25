import { storage } from "../server/storage";

export default async function handler(_req: any, res: any) {
  try {
    const userCount = await storage.getAllUsers(true);
    res.status(200).json({ status: "ok", message: "pong", userCount: userCount.length, time: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err?.message || String(err), stack: err?.stack });
  }
}
