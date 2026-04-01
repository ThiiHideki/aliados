// ── Level System (GC-style, 1-21) ─────────────────────────────────────────
// Level = Math.floor(levelPoints / 100) + 1, capped at 21
// Level 1-9:  Bronze | Level 10-15: Prata | Level 16-20: Dourado | Level 21: Lendário (teal)

export function getLevel(levelPoints: number): number {
  return Math.max(1, Math.min(21, Math.floor(Math.max(0, levelPoints) / 100) + 1));
}

export function getLPInLevel(levelPoints: number): number {
  if (levelPoints >= 2100) return 100;
  return Math.max(0, levelPoints) % 100;
}

export type LevelTier = "bronze" | "prata" | "dourado" | "lendario";

export function getLevelTier(level: number): LevelTier {
  if (level >= 21) return "lendario";
  if (level >= 16) return "dourado";
  if (level >= 10) return "prata";
  return "bronze";
}

export const TIER_CONFIG: Record<LevelTier, {
  label: string;
  color: string;
  bg: string;
  border: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
}> = {
  bronze:   {
    label: "Bronze",
    color: "text-amber-700 dark:text-amber-500",
    bg: "bg-amber-700/10 dark:bg-amber-500/10",
    border: "border-amber-700/40 dark:border-amber-500/40",
    gradientFrom: "from-amber-800",
    gradientTo: "to-amber-600",
    glowColor: "",
  },
  prata:    {
    label: "Prata",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/40",
    gradientFrom: "from-slate-500",
    gradientTo: "to-slate-300",
    glowColor: "",
  },
  dourado:  {
    label: "Dourado",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/40",
    gradientFrom: "from-yellow-600",
    gradientTo: "to-yellow-300",
    glowColor: "",
  },
  lendario: {
    label: "Lendário",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/40",
    gradientFrom: "from-teal-600",
    gradientTo: "to-teal-300",
    glowColor: "shadow-teal-500/40",
  },
};

export function getLevelLabel(levelPoints: number): string {
  return String(getLevel(levelPoints));
}

export function getLevelColor(levelPoints: number): string {
  const tier = getLevelTier(getLevel(levelPoints));
  return TIER_CONFIG[tier].color;
}

/**
 * Calculate LP earned/lost for a single match.
 * @param result "win" | "loss" | "unknown"
 * @param kills
 * @param deaths
 * @param damage
 * @param rounds total rounds played in the match (team1Score + team2Score)
 * @param aces enemy5ks for the player
 * @param v2Wins clutch 1v2 wins
 */
export function calculateMatchLP(
  result: "win" | "loss" | "unknown",
  kills: number,
  deaths: number,
  damage: number,
  rounds: number,
  aces: number,
  v2Wins: number,
): number {
  if (result === "unknown") return 0;

  const baseLP = result === "win" ? 10 : -5;
  const kd = deaths > 0 ? kills / deaths : kills;
  const kdBonus = Math.max(-18, Math.min(18, (kd - 1) * 12));
  const adr = rounds > 0 ? damage / rounds : 0;
  const adrBonus = adr >= 95 ? 4 : adr < 45 ? -3 : 0;
  const aceBonus = aces * 4;
  const clutchBonus = v2Wins * 2;

  return Math.max(-18, Math.min(25, Math.round(baseLP + kdBonus + adrBonus + aceBonus + clutchBonus)));
}
