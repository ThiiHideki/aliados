import { getLevel, getLevelTier, TIER_CONFIG, getLPInLevel, LP_PER_LEVEL } from "@/lib/level-utils";
import { LevelSystemInfoButton } from "@/components/ui/level-system-info";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  levelPoints: number;
  size?: "xs" | "sm" | "md" | "lg";
  showTierLabel?: boolean; // kept for API compat, no longer used
  className?: string;
}

const sizeConfig = {
  xs: {
    outer: "h-5 min-w-[1.25rem] px-1.5 text-xs rounded",
    inner: "gap-0.5",
    labelText: "text-xs",
    dot: "hidden",
  },
  sm: {
    outer: "h-6 min-w-[1.5rem] px-2 text-sm rounded",
    inner: "gap-1",
    labelText: "text-xs",
    dot: "w-1 h-1 rounded-full",
  },
  md: {
    outer: "h-8 min-w-[2rem] px-2.5 text-base rounded-md",
    inner: "gap-1",
    labelText: "text-xs",
    dot: "w-1.5 h-1.5 rounded-full",
  },
  lg: {
    outer: "h-10 min-w-[2.5rem] px-3 text-xl rounded-md",
    inner: "gap-1.5",
    labelText: "text-sm",
    dot: "w-2 h-2 rounded-full",
  },
};

export function LevelBadge({
  levelPoints,
  size = "sm",
  className,
}: LevelBadgeProps) {
  const level = getLevel(levelPoints ?? 0);
  const tier = getLevelTier(level);
  const cfg = TIER_CONFIG[tier];
  const sz = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold border select-none",
        cfg.bg,
        cfg.border,
        cfg.color,
        tier === "lendario" && `shadow-sm ${cfg.glowColor}`,
        sz.outer,
        className,
      )}
      data-testid={`level-badge-${level}`}
      title={`Nível ${level} – ${cfg.label}`}
    >
      <span className={cn("flex items-center", sz.inner)}>
        <span>{level}</span>
      </span>
    </span>
  );
}

interface LevelProgressProps {
  levelPoints: number;
  className?: string;
}

export function LevelProgress({ levelPoints, className }: LevelProgressProps) {
  const level = getLevel(levelPoints ?? 0);
  const tier = getLevelTier(level);
  const cfg = TIER_CONFIG[tier];
  const lpInLevel = level >= 21 ? LP_PER_LEVEL : getLPInLevel(levelPoints ?? 0);
  const isMaxLevel = level >= 21;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LevelBadge levelPoints={levelPoints} size="sm" />
          <span className={cn("text-sm font-medium", cfg.color)}>{cfg.label}</span>
          <LevelSystemInfoButton />
        </div>
        {isMaxLevel ? (
          <span className="text-xs text-muted-foreground font-mono">MAX</span>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">
            <span className={cn("font-bold", cfg.color)}>{lpInLevel}</span>
            <span> / {LP_PER_LEVEL} LP</span>
          </span>
        )}
      </div>
      <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            tier === "bronze"  && "bg-amber-600",
            tier === "prata"   && "bg-slate-400",
            tier === "dourado" && "bg-yellow-400",
            tier === "lendario" && "bg-teal-400",
          )}
          style={{ width: `${isMaxLevel ? 100 : Math.round((lpInLevel / LP_PER_LEVEL) * 100)}%` }}
        />
      </div>
      {!isMaxLevel && (
        <p className="text-xs text-muted-foreground">
          {LP_PER_LEVEL - lpInLevel} LP para o nível {level + 1}
        </p>
      )}
    </div>
  );
}
