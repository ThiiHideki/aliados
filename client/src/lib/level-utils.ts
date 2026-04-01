// ── Level System (GC-style, 1-21) ─────────────────────────────────────────
// Level = Math.floor(levelPoints / 100) + 1, capped at 21
// Level 1-5:  Bronze    | Level 6-10: Prata
// Level 11-15: Ouro     | Level 16-20: Diamante
// Level 21:   Lendário

export function getLevel(levelPoints: number): number {
  return Math.max(1, Math.min(21, Math.floor(Math.max(0, levelPoints) / 100) + 1));
}

export function getLPInLevel(levelPoints: number): number {
  if (levelPoints >= 2100) return 100;
  return Math.max(0, levelPoints) % 100;
}

export type LevelTier = "bronze" | "prata" | "ouro" | "diamante" | "lendario";

export function getLevelTier(level: number): LevelTier {
  if (level >= 21) return "lendario";
  if (level >= 16) return "diamante";
  if (level >= 11) return "ouro";
  if (level >= 6)  return "prata";
  return "bronze";
}

export const TIER_CONFIG: Record<LevelTier, { label: string; color: string; bg: string; border: string }> = {
  bronze:   { label: "Bronze",    color: "text-amber-700",  bg: "bg-amber-700/10",  border: "border-amber-700/40" },
  prata:    { label: "Prata",     color: "text-slate-400",  bg: "bg-slate-400/10",  border: "border-slate-400/40" },
  ouro:     { label: "Ouro",      color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/40" },
  diamante: { label: "Diamante",  color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/40" },
  lendario: { label: "Lendário",  color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/40" },
};

export function getLevelLabel(levelPoints: number): string {
  const level = getLevel(levelPoints);
  return `Nível ${level}`;
}

export function getLevelColor(levelPoints: number): string {
  const tier = getLevelTier(getLevel(levelPoints));
  return TIER_CONFIG[tier].color;
}
