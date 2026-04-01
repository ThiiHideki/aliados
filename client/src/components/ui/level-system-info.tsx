import { useState } from "react";
import { HelpCircle, Trophy, TrendingUp, TrendingDown, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TIER_CONFIG } from "@/lib/level-utils";
import { cn } from "@/lib/utils";

const tiers = [
  { range: "1 – 9",  tier: "bronze",   lp: "0 – 269 LP" },
  { range: "10 – 15", tier: "prata",    lp: "270 – 449 LP" },
  { range: "16 – 20", tier: "dourado",  lp: "450 – 599 LP" },
  { range: "21",      tier: "lendario", lp: "600 LP (MAX)" },
] as const;

const rjComponents = [
  { label: "KPR",          weight: "35%", formula: "Kills ÷ Rounds",                                desc: "Kills por round" },
  { label: "ADR",          weight: "35%", formula: "Dano ÷ Rounds ÷ 100",                          desc: "Dano médio por round (normalizado)" },
  { label: "Entry",        weight: "15%", formula: "EntryWins ÷ EntryCount",                        desc: "Taxa de sucesso como first-blood" },
  { label: "Utility",      weight: "15%", formula: "(UtilDmg + Flash×15) ÷ Rounds",                 desc: "Impacto com granadas e flashes" },
];

const lpTable = [
  { result: "Vitória", rj: "RJ > 1.3",  lp: "+25", badge: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
  { result: "Vitória", rj: "RJ ≥ 1.0",  lp: "+18", badge: "bg-green-500/20 text-green-400 border-green-500/40" },
  { result: "Vitória", rj: "RJ < 1.0",  lp: "+10", badge: "bg-green-500/10 text-green-400 border-green-500/20" },
  { result: "Derrota", rj: "RJ > 1.3",  lp: "−2",  badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  { result: "Derrota", rj: "RJ ≥ 1.0",  lp: "−10", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
  { result: "Derrota", rj: "RJ < 1.0",  lp: "−20", badge: "bg-red-500/20 text-red-400 border-red-500/40" },
];

export function LevelSystemInfoButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-6 w-6 text-muted-foreground hover:text-foreground", className)}
          data-testid="button-level-system-info"
          title="Como funciona o sistema de nível?"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-orange-400" />
            Como funciona o Sistema de Nível
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-sm">

          {/* Tiers */}
          <section>
            <h3 className="font-semibold text-foreground mb-2">Divisões</h3>
            <div className="grid grid-cols-2 gap-2">
              {tiers.map(t => {
                const cfg = TIER_CONFIG[t.tier];
                return (
                  <div
                    key={t.tier}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md border",
                      cfg.bg, cfg.border
                    )}
                  >
                    <div>
                      <span className={cn("font-bold", cfg.color)}>Nível {t.range}</span>
                      <p className={cn("text-xs", cfg.color)}>{cfg.label}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{t.lp}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cada nível exige <strong>30 LP</strong>. O nível máximo é <strong>21 (Lendário)</strong> com 600 LP.
            </p>
          </section>

          {/* Rating Jacarézão */}
          <section>
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-orange-400" />
              Rating Jacarézão (RJ)
            </h3>
            <p className="text-muted-foreground mb-3">
              O <strong>RJ</strong> mede sua performance individual por round. É calculado com 4 componentes:
            </p>
            <div className="space-y-2">
              {rjComponents.map(c => (
                <div key={c.label} className="flex items-start gap-3 p-2 rounded-md bg-muted/40">
                  <Badge variant="outline" className="text-orange-400 border-orange-400/40 shrink-0 font-mono text-xs">
                    {c.weight}
                  </Badge>
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground">{c.label}</span>
                    <span className="text-muted-foreground"> — {c.desc}</span>
                    <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">{c.formula}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LP table */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-green-400" />
              LP por Partida
            </h3>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/60 border-b">
                    <th className="text-left px-3 py-2 font-semibold">Resultado</th>
                    <th className="text-left px-3 py-2 font-semibold">Rating RJ</th>
                    <th className="text-right px-3 py-2 font-semibold">LP</th>
                  </tr>
                </thead>
                <tbody>
                  {lpTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-3 py-2">
                        {row.result === "Vitória"
                          ? <span className="text-green-400 font-medium">Vitória</span>
                          : <span className="text-red-400 font-medium">Derrota</span>
                        }
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">{row.rj}</td>
                      <td className="px-3 py-2 text-right">
                        <Badge variant="outline" className={cn("font-mono font-bold text-xs", row.badge)}>
                          {row.lp}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bonuses */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-blue-400" />
              Bônus de Clutch
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-md border bg-blue-500/5 border-blue-500/20">
                <span className="text-muted-foreground">Clutch 1v1</span>
                <Badge variant="outline" className="font-mono font-bold text-blue-400 border-blue-400/40">+2 LP</Badge>
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-md border bg-blue-500/10 border-blue-500/30">
                <span className="text-muted-foreground">Clutch 1v2</span>
                <Badge variant="outline" className="font-mono font-bold text-blue-400 border-blue-400/40">+3 LP</Badge>
              </div>
            </div>
          </section>

          {/* Protection note */}
          <section className="p-3 rounded-md border bg-yellow-500/5 border-yellow-500/20">
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-400 text-xs">Proteção ao MVP da Derrota</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Se você foi o melhor do time mesmo perdendo (RJ &gt; 1.3), perde apenas <strong>2 LP</strong> em vez de 20.
                  Boas performances são reconhecidas independente do resultado.
                </p>
              </div>
            </div>
          </section>

          <p className="text-xs text-muted-foreground text-center border-t pt-3">
            LP mínimo por partida: −20 · LP máximo por partida: +28
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
