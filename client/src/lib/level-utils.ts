// ── Level System (GC-style, 1-21) ─────────────────────────────────────────
// Level = Math.floor(levelPoints / 100) + 1, capped at 21
// Level 1-9:  Bronze | Level 10-15: Prata | Level 16-20: Dourado | Level 21: Lendário (teal)
// LP per level: 100 | Max LP for level 21: 2100
// Starting LP: 0 (everyone begins at Level 1)

export function getLevel(levelPoints: number): number {
  return Math.max(1, Math.min(21, Math.floor(Math.max(0, levelPoints) / 100) + 1));
}

export function getLPInLevel(levelPoints: number): number {
  if (levelPoints >= 2000) return Math.min(levelPoints - 2000, 100);
  return Math.max(0, levelPoints) % 100;
}

export const LP_PER_LEVEL = 100;

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
 * Calcula o Rating Inimigos (RI) de uma partida.
 * RI = (KPR × 0.35) + (ADR/100 × 0.35) + (EntrySuccess × 0.15) + (Utility × 0.15)
 * Utility = (utilityDamage + enemiesFlashed × 7.5) / rounds
 *
 * Vitória: RI > 1.3 → +25 | RI ≥ 1.0 → +18 | else → +10
 * Derrota: RI > 1.3 → −2  | RI ≥ 1.0 → −10 | else → −20
 * Bônus: v1Wins × 2, v2Wins × 3, MVP × 5, ACE(5K) × 5, 4K × 3
 * Faixa final: −20 a +40
 */
export function calculateMatchLP(
  won: boolean,
  kills: number,
  damage: number,
  rounds: number,
  entryWins: number,
  entryCount: number,
  utilityDamage: number,
  enemiesFlashed: number,
  v1Wins: number,
  v2Wins: number,
  mvps: number = 0,
  enemy5ks: number = 0,
  enemy4ks: number = 0,
): number {
  const r            = Math.max(rounds, 1);
  const kpr          = kills / r;
  const adr          = damage / r;
  const entrySuccess = entryCount > 0 ? entryWins / entryCount : 0;
  const utility      = (utilityDamage + enemiesFlashed * 7.5) / r;

  const ri = (kpr * 0.35) + (adr / 100 * 0.35) + (entrySuccess * 0.15) + (utility * 0.15);

  let lp = 0;
  if (won) {
    if      (ri > 1.3)  lp = 25;
    else if (ri >= 1.0) lp = 18;
    else                lp = 10;
  } else {
    if      (ri > 1.3)  lp = -2;
    else if (ri >= 1.0) lp = -10;
    else                lp = -20;
  }

  lp += v1Wins  * 2;
  lp += v2Wins  * 3;
  lp += mvps    * 5;
  lp += enemy5ks * 5;
  lp += enemy4ks * 3;

  return Math.max(-20, Math.min(40, lp));
}

/**
 * Calcula o RI (Rating Inimigos) de uma partida — valor puro, sem converter em LP.
 */
export function calcRatingInimigos(
  kills: number,
  damage: number,
  rounds: number,
  entryWins: number,
  entryCount: number,
  utilityDamage: number,
  enemiesFlashed: number,
): number {
  const r            = Math.max(rounds, 1);
  const kpr          = kills / r;
  const adr          = damage / r;
  const entrySuccess = entryCount > 0 ? entryWins / entryCount : 0;
  const utility      = (utilityDamage + enemiesFlashed * 7.5) / r;
  return (kpr * 0.35) + (adr / 100 * 0.35) + (entrySuccess * 0.15) + (utility * 0.15);
}

/** @deprecated Use calcRatingInimigos */
export const calcRatingJacarezao = calcRatingInimigos;
