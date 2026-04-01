import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Award, Target, Crosshair, Star, Info, ChevronDown, Handshake, Zap, Flame, Shield, AlertCircle, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { User, Trophy as TrophySchema } from "@shared/schema";
import { LevelBadge } from "@/components/ui/level-badge";

export default function Rankings() {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });
  const { data: allTrophies = [], isLoading: trophiesLoading } = useQuery<TrophySchema[]>({
    queryKey: ["/api/trophies"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const userMap = new Map(users.map(u => [u.id, u]));

  const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const getTrophyConfig = (type: string) => {
    const configs: Record<string, { icon: typeof Trophy; iconClass: string; iconBgClass: string; borderClass: string; bgClass: string; label: string }> = {
      best_player:  { icon: Trophy,       iconClass: "text-yellow-500", iconBgClass: "bg-yellow-500/10", borderClass: "border-yellow-500/30", bgClass: "bg-yellow-500/5",  label: "Craque do Mês" },
      best_kd:      { icon: Crosshair,    iconClass: "text-red-500",    iconBgClass: "bg-red-500/10",    borderClass: "border-red-500/30",    bgClass: "bg-red-500/5",     label: "Matador Nato" },
      best_assists: { icon: Handshake,    iconClass: "text-blue-500",   iconBgClass: "bg-blue-500/10",   borderClass: "border-blue-500/30",   bgClass: "bg-blue-500/5",    label: "Amigão do Server" },
      best_hs:      { icon: Target,       iconClass: "text-orange-500", iconBgClass: "bg-orange-500/10", borderClass: "border-orange-500/30", bgClass: "bg-orange-500/5",  label: "Mira de Aimbot" },
      most_matches: { icon: Star,         iconClass: "text-purple-500", iconBgClass: "bg-purple-500/10", borderClass: "border-purple-500/30", bgClass: "bg-purple-500/5",  label: "Viciado Oficial" },
      worst_player: { icon: AlertCircle,  iconClass: "text-gray-500",   iconBgClass: "bg-gray-500/10",   borderClass: "border-gray-500/30",   bgClass: "bg-gray-500/5",    label: "Troféu Abacaxi" },
      worst_kd:     { icon: Shield,       iconClass: "text-gray-400",   iconBgClass: "bg-gray-400/10",   borderClass: "border-gray-400/30",   bgClass: "bg-gray-400/5",    label: "Ímã de Bala" },
      best_kills_avg: { icon: Flame,      iconClass: "text-red-500",    iconBgClass: "bg-red-500/10",    borderClass: "border-red-500/30",    bgClass: "bg-red-500/5",     label: "Ceifador" },
    };
    return configs[type] || configs.best_player;
  };

  const trophiesByMonth = allTrophies.reduce((acc, trophy) => {
    const key = `${trophy.year}-${String(trophy.month).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = { year: trophy.year, month: trophy.month, trophies: [] };
    acc[key].trophies.push(trophy);
    return acc;
  }, {} as Record<string, { year: number; month: number; trophies: TrophySchema[] }>);

  const sortedMonths = Object.values(trophiesByMonth).sort((a, b) =>
    b.year !== a.year ? b.year - a.year : b.month - a.month
  );

  const playersWithMatches = users.filter(u => u.totalMatches >= 3);
  
  const sortedByRating = [...playersWithMatches].sort((a, b) => (b.levelPoints ?? 500) - (a.levelPoints ?? 500));
  const sortedByKD = [...playersWithMatches].sort((a, b) => {
    const kdA = a.totalDeaths > 0 ? a.totalKills / a.totalDeaths : a.totalKills;
    const kdB = b.totalDeaths > 0 ? b.totalKills / b.totalDeaths : b.totalKills;
    return kdB - kdA;
  });
  const sortedByHeadshots = [...playersWithMatches].sort((a, b) => {
    const hsA = a.totalKills > 0 ? (a.totalHeadshots / a.totalKills) * 100 : 0;
    const hsB = b.totalKills > 0 ? (b.totalHeadshots / b.totalKills) * 100 : 0;
    return hsB - hsA;
  });
  const sortedByWinRate = [...playersWithMatches].sort((a, b) => {
    const winRateA = (a.matchesWon / a.totalMatches) * 100;
    const winRateB = (b.matchesWon / b.totalMatches) * 100;
    return winRateB - winRateA;
  });
  const sortedByMvps = [...playersWithMatches].sort((a, b) => b.totalMvps - a.totalMvps);
  const sortedByAssists = [...playersWithMatches].sort((a, b) => {
    const avgA = a.totalMatches > 0 ? a.totalAssists / a.totalMatches : 0;
    const avgB = b.totalMatches > 0 ? b.totalAssists / b.totalMatches : 0;
    return avgB - avgA;
  });
  const sortedByKillsAvg = [...playersWithMatches].sort((a, b) => {
    const avgA = a.totalMatches > 0 ? a.totalKills / a.totalMatches : 0;
    const avgB = b.totalMatches > 0 ? b.totalKills / b.totalMatches : 0;
    return avgB - avgA;
  });
  const sortedByAces = [...playersWithMatches].filter(u => u.total5ks > 0).sort((a, b) => b.total5ks - a.total5ks);
  const sortedBy4ks = [...playersWithMatches].filter(u => u.total4ks > 0).sort((a, b) => b.total4ks - a.total4ks);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-500 text-black">1º Lugar</Badge>;
      case 1:
        return <Badge variant="secondary">2º Lugar</Badge>;
      case 2:
        return <Badge className="bg-amber-600 text-white">3º Lugar</Badge>;
      default:
        return <Badge variant="outline">{index + 1}º</Badge>;
    }
  };

  const PlayerRow = ({ player, index, stat }: { player: User; index: number; stat: ReactNode }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg ${index < 3 ? 'bg-primary/5 border border-primary/20' : 'bg-background/50'}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8">
          {getRankIcon(index)}
        </div>
        <Link href={`/jogador/${player.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity" data-testid={`link-player-${player.id}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={player.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {player.nickname?.slice(0, 2).toUpperCase() || player.firstName?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium hover:text-primary transition-colors">{player.nickname || player.firstName || "Jogador"}</div>
            <div className="text-xs text-muted-foreground">{player.totalMatches} partidas</div>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-xl">{stat}</span>
        {getRankBadge(index)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Melhores Jogadores</h1>
      </div>

      <Tabs defaultValue="rankings">
        <TabsList className="mb-2">
          <TabsTrigger value="rankings" data-testid="tab-rankings">Rankings</TabsTrigger>
          <TabsTrigger value="trophies" data-testid="tab-trophies">
            <Medal className="h-4 w-4 mr-2" />
            Hall of Fame
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trophies">
          {trophiesLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : sortedMonths.length === 0 ? (
            <Card>
              <CardContent className="pt-10 pb-10 text-center text-muted-foreground">
                <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Nenhum troféu gerado ainda.</p>
                <p className="text-sm mt-1">Os troféus são gerados automaticamente no início de cada mês.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {sortedMonths.map(({ year, month, trophies }) => (
                <div key={`${year}-${month}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold capitalize">{MONTH_NAMES[month - 1]} {year}</h2>
                    <Badge variant="outline" className="ml-1">{trophies.length} troféus</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {trophies.map((trophy) => {
                      const config = getTrophyConfig(trophy.type);
                      const winner = userMap.get(trophy.userId);
                      const winnerName = winner?.nickname || winner?.firstName || "Jogador";
                      const IconComp = config.icon;
                      return (
                        <div
                          key={trophy.id}
                          className={`p-4 rounded-md border ${config.borderClass} ${config.bgClass}`}
                          data-testid={`trophy-hall-${trophy.type}-${month}-${year}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 p-2 rounded-md ${config.iconBgClass}`}>
                              <IconComp className={`h-5 w-5 ${config.iconClass}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm leading-tight">{config.label}</p>
                              {trophy.value && (
                                <p className="text-xs font-mono text-muted-foreground mt-0.5">{trophy.value}</p>
                              )}
                              {winner ? (
                                <Link href={`/jogador/${winner.id}`} className="flex items-center gap-2 mt-2 hover:opacity-80 transition-opacity">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={winner.profileImageUrl || undefined} />
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {winnerName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium truncate">{winnerName}</span>
                                </Link>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-2">Jogador removido</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rankings">

      <Collapsible open={isLegendOpen} onOpenChange={setIsLegendOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover-elevate">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Como o Sistema de Níveis Funciona
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isLegendOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Sistema de progressão do <strong className="text-foreground">Nível 1</strong> ao <strong className="text-foreground">Nível 21</strong>. A cada partida você ganha ou perde LP com base no seu desempenho individual, medido pelo <strong className="text-foreground">Rating Inimigos (RI)</strong>.
              </p>

              {/* Tiers */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Divisões</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Bronze",   sub: "Níveis 1–9",   lp: "0–899 LP",    color: "text-amber-600 bg-amber-700/10 border-amber-700/30" },
                    { label: "Prata",    sub: "Níveis 10–15",  lp: "900–1499 LP", color: "text-slate-300 bg-slate-400/10 border-slate-400/30" },
                    { label: "Dourado",  sub: "Níveis 16–20",  lp: "1500–1999 LP",color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
                    { label: "Lendário", sub: "Nível 21",      lp: "2000 LP MAX", color: "text-teal-400 bg-teal-400/10 border-teal-400/30" },
                  ].map(t => (
                    <div key={t.label} className={`rounded-md border p-2 ${t.color}`}>
                      <div className="text-xs font-bold">{t.label}</div>
                      <div className="text-[11px] opacity-80">{t.sub}</div>
                      <div className="text-[10px] opacity-60 font-mono mt-0.5">{t.lp}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Cada nível exige <strong className="text-foreground">100 LP</strong>. O nível máximo é <strong className="text-foreground">21</strong> com 2000+ LP.</p>
              </div>

              {/* Rating Inimigos */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-orange-400" />
                  Rating Inimigos (RI)
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Mede sua performance individual por round. É calculado com 4 componentes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: "KPR",     peso: "35%", formula: "Kills ÷ Rounds",               desc: "Kills por round" },
                    { label: "ADR",     peso: "35%", formula: "Dano ÷ Rounds ÷ 100",          desc: "Dano médio por round" },
                    { label: "Entry",   peso: "15%", formula: "EntryWins ÷ EntryCount",        desc: "Taxa de first-blood" },
                    { label: "Utility", peso: "15%", formula: "(UtilDmg + Flash×15) ÷ Rounds", desc: "Impacto com granadas" },
                  ].map(c => (
                    <div key={c.label} className="flex items-start gap-2 p-2 rounded-md bg-muted/40 border border-border/50">
                      <Badge variant="outline" className="text-orange-400 border-orange-400/40 shrink-0 font-mono text-[10px]">{c.peso}</Badge>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-foreground">{c.label}</span>
                        <span className="text-xs text-muted-foreground"> — {c.desc}</span>
                        <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{c.formula}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LP table */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  LP por Partida
                </h4>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/60 border-b">
                        <th className="text-left px-3 py-2 font-semibold">Resultado</th>
                        <th className="text-left px-3 py-2 font-semibold">Rating RI</th>
                        <th className="text-right px-3 py-2 font-semibold">LP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { result: "Vitória", ri: "RI > 1.3",  lp: "+25", win: true  },
                        { result: "Vitória", ri: "RI ≥ 1.0",  lp: "+18", win: true  },
                        { result: "Vitória", ri: "RI < 1.0",  lp: "+10", win: true  },
                        { result: "Derrota", ri: "RI > 1.3",  lp: "−2",  win: false },
                        { result: "Derrota", ri: "RI ≥ 1.0",  lp: "−10", win: false },
                        { result: "Derrota", ri: "RI < 1.0",  lp: "−20", win: false },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                          <td className="px-3 py-2">
                            {row.win
                              ? <span className="text-green-400 font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" />Vitória</span>
                              : <span className="text-red-400 font-medium flex items-center gap-1"><TrendingDown className="h-3 w-3" />Derrota</span>
                            }
                          </td>
                          <td className="px-3 py-2 font-mono text-muted-foreground">{row.ri}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={`font-mono font-bold ${row.win ? "text-green-400" : "text-red-400"}`}>{row.lp}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bonuses */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Bônus por Destaque
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Clutch 1v1",    value: "+2 LP / clutch", color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/5"    },
                    { label: "Clutch 1v2",    value: "+3 LP / clutch", color: "text-blue-400",   border: "border-blue-500/30",   bg: "bg-blue-500/10"   },
                    { label: "MVP",           value: "+5 LP",          color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
                    { label: "ACE (5K)",      value: "+5 LP / ACE",    color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
                    { label: "4K (quad-kill)",value: "+3 LP / 4K",    color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
                  ].map(b => (
                    <div key={b.label} className={`flex items-center justify-between px-3 py-2 rounded-md border ${b.bg} ${b.border}`}>
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className={`font-mono font-bold ${b.color}`}>{b.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protection note */}
              <div className="p-3 rounded-md border bg-yellow-500/5 border-yellow-500/20">
                <p className="text-xs font-semibold text-yellow-400 mb-1">Proteção ao MVP da Derrota</p>
                <p className="text-xs text-muted-foreground">
                  Se você foi o melhor jogador mesmo perdendo (RI &gt; 1.3), perde apenas <strong className="text-foreground">2 LP</strong> em vez de 20. Boas performances são reconhecidas independente do resultado.
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center border-t pt-3">
                LP mínimo por partida: −20 · LP máximo por partida: +40 (com bônus)
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Ranking por Nível
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByRating.slice(0, 10).map((player, index) => (
              <PlayerRow
                key={player.id}
                player={player}
                index={index}
                stat={<LevelBadge levelPoints={player.levelPoints ?? 500} size="md" showTierLabel />}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-red-500" />
              Ranking por K/D
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByKD.slice(0, 10).map((player, index) => {
              const kd = player.totalDeaths > 0
                ? (player.totalKills / player.totalDeaths).toFixed(2)
                : player.totalKills.toFixed(2);
              return (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  stat={kd}
                />
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Ranking por Headshot %
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByHeadshots.slice(0, 10).map((player, index) => {
              const hs = player.totalKills > 0
                ? ((player.totalHeadshots / player.totalKills) * 100).toFixed(1)
                : "0.0";
              return (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  stat={`${hs}%`}
                />
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Ranking por Taxa de Vitória
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByWinRate.slice(0, 10).map((player, index) => {
              const winRate = player.totalMatches > 0
                ? ((player.matchesWon / player.totalMatches) * 100).toFixed(1)
                : "0.0";
              return (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  stat={`${winRate}%`}
                />
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              Ranking por Média de Kills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByKillsAvg.slice(0, 10).map((player, index) => {
              const avg = player.totalMatches > 0
                ? (player.totalKills / player.totalMatches).toFixed(1)
                : "0.0";
              return (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  stat={`${avg}/jogo`}
                />
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Ranking por MVPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {sortedByMvps.slice(0, 10).map((player, index) => {
                const mvpRate = player.totalMatches > 0
                  ? ((player.totalMvps / player.totalMatches) * 100).toFixed(1)
                  : "0.0";
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${index < 3 ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-background/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                      <Link href={`/jogador/${player.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity" data-testid={`link-mvp-player-${player.id}`}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={player.profileImageUrl || undefined} />
                          <AvatarFallback className="bg-amber-500/10 text-amber-500">
                            {player.nickname?.slice(0, 2).toUpperCase() || player.firstName?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium hover:text-amber-500 transition-colors">{player.nickname || player.firstName || "Jogador"}</div>
                          <div className="text-xs text-muted-foreground">{mvpRate}% das partidas</div>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-xl text-amber-500">{player.totalMvps}</span>
                        <div className="text-xs text-muted-foreground">MVPs</div>
                      </div>
                      {getRankBadge(index)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-cyan-500" />
              Ranking por Assistências (Média por Partida)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {sortedByAssists.slice(0, 10).map((player, index) => {
                const avgAssists = player.totalMatches > 0
                  ? (player.totalAssists / player.totalMatches).toFixed(1)
                  : "0.0";
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${index < 3 ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-background/50'}`}
                    data-testid={`rank-assists-${player.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                      <Link href={`/jogador/${player.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity" data-testid={`link-assists-player-${player.id}`}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={player.profileImageUrl || undefined} />
                          <AvatarFallback className="bg-cyan-500/10 text-cyan-500">
                            {player.nickname?.slice(0, 2).toUpperCase() || player.firstName?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium hover:text-cyan-500 transition-colors">{player.nickname || player.firstName || "Jogador"}</div>
                          <div className="text-xs text-muted-foreground">{player.totalAssists} assists em {player.totalMatches} partidas</div>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-xl text-cyan-500">{avgAssists}</span>
                        <div className="text-xs text-muted-foreground">por partida</div>
                      </div>
                      {getRankBadge(index)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {sortedByAces.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Ranking por ACEs (5K)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedByAces.slice(0, 10).map((player, index) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  stat={`${player.total5ks} ACE${player.total5ks > 1 ? "s" : ""}`}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {sortedBy4ks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Ranking por 4Ks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedBy4ks.slice(0, 10).map((player, index) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  stat={`${player.total4ks} 4K${player.total4ks > 1 ? "s" : ""}`}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
