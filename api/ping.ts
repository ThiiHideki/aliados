export default function handler(_req: any, res: any) {
  res.status(200).json({ status: "ok", message: "pong", time: new Date().toISOString() });
}
