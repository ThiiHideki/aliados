import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User, Trophy, Target, Crosshair, Shield, Star, TrendingUp, 
  Zap, Award, Eye, Link2, Check, AlertCircle, Edit2, Save, X,
  Medal, CalendarDays, Handshake, Skull, Flame, Snowflake,
  PlayCircle, XCircle, Package
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { User as UserType, MonthlyRanking, Trophy as TrophyType } from "@shared/schema";
import { LevelBadge, LevelProgress } from "@/components/ui/level-badge";
import { getLevel } from "@/lib/level-utils";

export default function Perfil() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    profileImageUrl: "",
    steamId64: "",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickname: user.nickname || "",
        profileImageUrl: user.profileImageUrl || "",
        steamId64: user.steamId64 || "",
      });
    }
  }, [user]);

  const { data: allUsers = [] } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
  });

  const { data: monthlyData } = useQuery<{
    month: number;
    year: number;
    monthName: string;
    players: Array<{
      userId: string;
      kills: number;
      deaths: number;
      assists: number;
      headshots: number;
      damage: number;
      mvps: number;
      matchesPlayed: number;
      matchesWon: number;
      total5ks: number;
      total4ks: number;
      total3ks: number;
    }>;
  }>({
    queryKey: ['/api/stats/monthly'],
  });

  const { data: monthlyRankingsHistory = [] } = useQuery<MonthlyRanking[]>({
    queryKey: ["/api/monthly-rankings"],
  });

  const { data: userTrophies = [] } = useQuery<TrophyType[]>({
    queryKey: ['/api/trophies/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: userMatchHistory = [] } = useQuery<Array<{ stats: any; match: any }>>({
    queryKey: ['/api/users', user?.id, 'matches'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/users/${user.id}/matches`, { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  const { data: itemsData, refetch: refetchItems } = useQuery<{
    desafioRpCount: number;
    freezeRpCount: number;
    activeModifier: string | null;
    itemsUsedToday: number;
    winStreak: number;
  }>({
    queryKey: ['/api/me/items'],
    staleTime: 0,
  });

  const activateModifierMutation = useMutation({
    mutationFn: async (type: 'desafio_rp' | 'freeze_rp') => {
      const res = await apiRequest('POST', '/api/me/modifier', { type });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao ativar modificador');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ title: 'Modificador ativado!', description: 'Será aplicado na sua próxima partida importada.' });
    },
    onError: (e: Error) => {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    },
  });

  const cancelModifierMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', '/api/me/modifier');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao cancelar');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ title: 'Modificador cancelado', description: 'Item devolvido ao inventário.' });
    },
    onError: (e: Error) => {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    },
  });

  // Check if item activation is currently blocked (outside 07:00–19:00 BRT)
  const isItemTimeBlocked = (() => {
    const now = new Date();
    const brtOffset = -3 * 60; // BRT = UTC-3
    const brtTime = new Date(now.getTime() + brtOffset * 60 * 1000);
    const h = brtTime.getUTCHours();
    return h >= 19 || h < 7;
  })();

  const MONTH_NAMES_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const skillRatingEvolution = useMemo(() => {
    if (!userMatchHistory.length || !user) return [];

    const calcSR = (s: { kills: number; deaths: number; headshots: number; damage: number; matchesPlayed: number; matchesWon: number; mvps: number; total5ks: number; total4ks: number; total3ks: number }) => {
      const kd = s.deaths > 0 ? s.kills / s.deaths : s.kills;
      const hsPercent = s.kills > 0 ? (s.headshots / s.kills) * 100 : 0;
      const winRate = s.matchesPlayed > 0 ? (s.matchesWon / s.matchesPlayed) * 100 : 0;
      const adr = s.matchesPlayed > 0 ? s.damage / (s.matchesPlayed * 24) : 0;
      let rating = 1000;
      rating += (kd - 1) * 150;
      rating += (hsPercent - 30) * 2;
      rating += (adr - 70) * 1.5;
      rating += (winRate - 50) * 3;
      rating += s.mvps * 2;
      rating += s.total5ks * 30;
      rating += s.total4ks * 15;
      rating += s.total3ks * 5;
      return Math.max(100, Math.min(3000, Math.round(rating)));
    };

    const byMonth: Record<string, {
      kills: number; deaths: number; headshots: number; damage: number;
      mvps: number; matchesPlayed: number; matchesWon: number;
      total5ks: number; total4ks: number; total3ks: number;
      seenMatches: Set<string>;
    }> = {};

    for (const { stats, match } of userMatchHistory) {
      const date = new Date(match.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth[key]) {
        byMonth[key] = {
          kills: 0, deaths: 0, headshots: 0, damage: 0, mvps: 0,
          matchesPlayed: 0, matchesWon: 0, total5ks: 0, total4ks: 0, total3ks: 0,
          seenMatches: new Set(),
        };
      }
      const m = byMonth[key];
      m.kills += stats.kills ?? 0;
      m.deaths += stats.deaths ?? 0;
      m.headshots += stats.headshots ?? 0;
      m.damage += stats.damage ?? 0;
      m.mvps += stats.mvps ?? 0;
      m.total5ks += stats.enemy5ks ?? 0;
      m.total4ks += stats.enemy4ks ?? 0;
      m.total3ks += stats.enemy3ks ?? 0;
      if (!m.seenMatches.has(match.id)) {
        m.seenMatches.add(match.id);
        m.matchesPlayed += 1;
        if (match.winnerTeam && stats.team === match.winnerTeam) m.matchesWon += 1;
      }
    }

    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, s]) => {
        const [yearStr, monthStr] = key.split('-');
        const monthIdx = parseInt(monthStr) - 1;
        return {
          month: `${MONTH_NAMES_SHORT[monthIdx]}/${yearStr}`,
          skillRating: calcSR(s),
          matchesPlayed: s.matchesPlayed,
        };
      })
      .filter(d => d.matchesPlayed >= 3);
  }, [userMatchHistory, user]);

  // LP Evolution: cumulative LP at end of each month (from match history)
  const lpEvolution = useMemo(() => {
    if (!userMatchHistory.length) return [];

    // Helper: replicate RI formula on client side (mirrors routes.ts calcMatchLP)
    const calcMatchLPClient = (
      won: boolean, kills: number, damage: number, rounds: number,
      entryWins: number, entryCount: number, utilityDamage: number,
      enemiesFlashed: number, v1Wins: number, v2Wins: number,
      mvps: number, enemy5ks: number, enemy4ks: number,
    ): number => {
      const r = Math.max(rounds, 1);
      const kpr = kills / r;
      const adr = damage / r;
      const entrySuccess = entryCount > 0 ? entryWins / entryCount : 0;
      const utility = (utilityDamage + enemiesFlashed * 7.5) / r;
      const ri = kpr * 0.35 + (adr / 100) * 0.35 + entrySuccess * 0.15 + utility * 0.15;
      let lp = 0;
      if (won) { lp = ri > 1.3 ? 25 : ri >= 1.0 ? 18 : 10; }
      else      { lp = ri > 1.3 ? -2 : ri >= 1.0 ? -10 : -20; }
      lp += v1Wins * 2 + v2Wins * 3 + mvps * 5 + enemy5ks * 5 + enemy4ks * 3;
      return Math.max(-20, Math.min(40, lp));
    };

    // Sort matches chronologically
    const sorted = [...userMatchHistory].sort(
      (a, b) => new Date(a.match.date).getTime() - new Date(b.match.date).getTime()
    );

    let cumLP = 0;
    const byMonth: Record<string, { lp: number; matchCount: number; level: number }> = {};

    for (const { stats, match } of sorted) {
      const rounds = ((match.team1Score || 0) + (match.team2Score || 0)) || 24;
      const won = match.winnerTeam ? match.winnerTeam === stats.team : false;
      const lp = calcMatchLPClient(
        won,
        stats.kills ?? 0, stats.damage ?? 0, rounds,
        stats.entryWins ?? 0, stats.entryCount ?? 0,
        stats.utilityDamage ?? 0, stats.enemiesFlashed ?? 0,
        stats.v1Wins ?? 0, stats.v2Wins ?? 0,
        stats.mvps ?? 0, stats.enemy5ks ?? 0, stats.enemy4ks ?? 0,
      );
      cumLP = Math.max(0, Math.min(2100, cumLP + lp));
      const date = new Date(match.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const level = Math.min(21, Math.floor(cumLP / 100) + 1);
      byMonth[key] = { lp: cumLP, matchCount: (byMonth[key]?.matchCount ?? 0) + 1, level };
    }

    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, d]) => {
        const [yearStr, monthStr] = key.split('-');
        const monthIdx = parseInt(monthStr) - 1;
        return {
          month: `${MONTH_NAMES_SHORT[monthIdx]}/${yearStr}`,
          levelPoints: d.lp,
          level: d.level,
          matchCount: d.matchCount,
        };
      });
  }, [userMatchHistory]);

  const generalRanking = (() => {
    if (!user || allUsers.length === 0) return { position: 0, total: 0 };
    const sorted = [...allUsers]
      .filter(u => u.totalMatches > 0)
      .sort((a, b) => (b.levelPoints ?? 500) - (a.levelPoints ?? 500));
    const pos = sorted.findIndex(u => u.id === user.id);
    return { position: pos >= 0 ? pos + 1 : 0, total: sorted.length };
  })();

  const getMonthlySkillRating = (p: { kills: number; deaths: number; headshots: number; damage: number; matchesPlayed: number; matchesWon: number; mvps: number; total5ks?: number; total4ks?: number; total3ks?: number }) => {
    const kd = p.deaths > 0 ? p.kills / p.deaths : p.kills;
    const hsPercent = p.kills > 0 ? (p.headshots / p.kills) * 100 : 0;
    const winRate = p.matchesPlayed > 0 ? (p.matchesWon / p.matchesPlayed) * 100 : 0;
    const estimatedRounds = p.matchesPlayed * 24;
    const adr = estimatedRounds > 0 ? p.damage / estimatedRounds : 0;
    let rating = 1000;
    rating += (kd - 1) * 150;
    rating += (hsPercent - 30) * 2;
    rating += (adr - 70) * 1.5;
    rating += (winRate - 50) * 3;
    rating += p.mvps * 2;
    rating += (p.total5ks || 0) * 30;
    rating += (p.total4ks || 0) * 15;
    rating += (p.total3ks || 0) * 5;
    return Math.max(100, Math.min(3000, Math.round(rating)));
  };

  const monthlyRanking = (() => {
    if (!user || !monthlyData?.players) return { position: 0, total: 0, kills: 0, deaths: 0, assists: 0, mvps: 0, matchesPlayed: 0, damage: 0, headshots: 0 };
    const eligible = monthlyData.players.filter(p => p.matchesPlayed >= 3);
    const sorted = [...eligible].sort((a, b) => getMonthlySkillRating(b) - getMonthlySkillRating(a));
    const pos = sorted.findIndex(p => p.userId === user.id);
    const myStats = monthlyData.players.find(p => p.userId === user.id);
    return {
      position: pos >= 0 ? pos + 1 : 0,
      total: sorted.length,
      kills: myStats?.kills || 0,
      deaths: myStats?.deaths || 0,
      assists: myStats?.assists || 0,
      mvps: myStats?.mvps || 0,
      matchesPlayed: myStats?.matchesPlayed || 0,
      damage: myStats?.damage || 0,
      headshots: myStats?.headshots || 0,
    };
  })();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      const response = await apiRequest("PATCH", "/api/users/me", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil Atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao Atualizar",
        description: error.message || "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickname: user.nickname || "",
        profileImageUrl: user.profileImageUrl || "",
        steamId64: user.steamId64 || "",
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const kdRatio = user.totalDeaths > 0
    ? (user.totalKills / user.totalDeaths).toFixed(2)
    : user.totalKills.toFixed(2);

  const headshotPercent = user.totalKills > 0
    ? ((user.totalHeadshots / user.totalKills) * 100).toFixed(1)
    : "0.0";

  const winRate = user.totalMatches > 0
    ? ((user.matchesWon / user.totalMatches) * 100).toFixed(1)
    : "0.0";

  const roundWinRate = user.totalRoundsPlayed > 0
    ? ((user.roundsWon / user.totalRoundsPlayed) * 100).toFixed(1)
    : "0.0";

  const accuracy = user.totalShotsFired > 0
    ? ((user.totalShotsOnTarget / user.totalShotsFired) * 100).toFixed(1)
    : "0.0";

  const adr = user.totalMatches > 0
    ? (user.totalDamage / user.totalMatches).toFixed(0)
    : "0";

  const clutchWinRate1v1 = user.total1v1Count > 0
    ? ((user.total1v1Wins / user.total1v1Count) * 100).toFixed(0)
    : "0";

  const entryWinRate = user.totalEntryCount > 0
    ? ((user.totalEntryWins / user.totalEntryCount) * 100).toFixed(0)
    : "0";

  const flashSuccessRate = user.totalFlashCount > 0
    ? ((user.totalFlashSuccesses / user.totalFlashCount) * 100).toFixed(0)
    : "0";

  const killsPerMatch = user.totalMatches > 0 ? (user.totalKills / user.totalMatches).toFixed(1) : "0.0";
  const deathsPerMatch = user.totalMatches > 0 ? (user.totalDeaths / user.totalMatches).toFixed(1) : "0.0";
  const assistsPerMatch = user.totalMatches > 0 ? (user.totalAssists / user.totalMatches).toFixed(1) : "0.0";
  const hsPerMatch = user.totalMatches > 0 ? (user.totalHeadshots / user.totalMatches).toFixed(1) : "0.0";
  const adrPerRound = user.totalRoundsPlayed > 0
    ? (user.totalDamage / user.totalRoundsPlayed).toFixed(1)
    : user.totalMatches > 0 ? (user.totalDamage / (user.totalMatches * 24)).toFixed(1) : "0.0";
  const mvpsPerMatch = user.totalMatches > 0 ? (user.totalMvps / user.totalMatches).toFixed(2) : "0.00";

  const getTrophyConfig = (type: string) => {
    const configs: Record<string, {
      icon: typeof Trophy;
      iconClass: string;
      iconBgClass: string;
      borderClass: string;
      bgClass: string;
    }> = {
      best_player: {
        icon: Trophy,
        iconClass: "text-yellow-500",
        iconBgClass: "bg-yellow-500/10",
        borderClass: "border-yellow-500/30",
        bgClass: "bg-yellow-500/5",
      },
      best_kd: {
        icon: Crosshair,
        iconClass: "text-red-500",
        iconBgClass: "bg-red-500/10",
        borderClass: "border-red-500/30",
        bgClass: "bg-red-500/5",
      },
      best_assists: {
        icon: Handshake,
        iconClass: "text-blue-500",
        iconBgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
        bgClass: "bg-blue-500/5",
      },
      best_hs: {
        icon: Target,
        iconClass: "text-orange-500",
        iconBgClass: "bg-orange-500/10",
        borderClass: "border-orange-500/30",
        bgClass: "bg-orange-500/5",
      },
      most_matches: {
        icon: Zap,
        iconClass: "text-purple-500",
        iconBgClass: "bg-purple-500/10",
        borderClass: "border-purple-500/30",
        bgClass: "bg-purple-500/5",
      },
      worst_player: {
        icon: AlertCircle,
        iconClass: "text-gray-500",
        iconBgClass: "bg-gray-500/10",
        borderClass: "border-gray-500/30",
        bgClass: "bg-gray-500/5",
      },
      worst_kd: {
        icon: Shield,
        iconClass: "text-gray-400",
        iconBgClass: "bg-gray-400/10",
        borderClass: "border-gray-400/30",
        bgClass: "bg-gray-400/5",
      },
      best_kills_avg: {
        icon: Target,
        iconClass: "text-red-500",
        iconBgClass: "bg-red-500/10",
        borderClass: "border-red-500/30",
        bgClass: "bg-red-500/5",
      },
    };
    return configs[type] || configs.best_player;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={editForm.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {editForm.nickname?.slice(0, 2).toUpperCase() || editForm.firstName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nickname">Apelido (Nick)</Label>
                  <Input
                    id="nickname"
                    placeholder="Seu nick no jogo"
                    value={editForm.nickname}
                    onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                    data-testid="input-nickname"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      placeholder="Nome"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      data-testid="input-firstname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      placeholder="Sobrenome"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      data-testid="input-lastname"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImageUrl">URL da Foto de Perfil</Label>
                  <Input
                    id="profileImageUrl"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={editForm.profileImageUrl}
                    onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
                    data-testid="input-profile-image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="steamId64" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    SteamID64
                  </Label>
                  <Input
                    id="steamId64"
                    placeholder="76561198000000000"
                    value={editForm.steamId64}
                    onChange={(e) => setEditForm({ ...editForm, steamId64: e.target.value })}
                    data-testid="input-steam-id"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se esse SteamID já existe, suas estatísticas serão mescladas automaticamente.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateProfileMutation.isPending ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleCancelEdit}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {user.nickname?.slice(0, 2).toUpperCase() || user.firstName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">
                    {user.nickname || user.firstName || "Jogador"}
                  </h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? "Admin" : "Jogador"}
                    </Badge>
                    <LevelBadge levelPoints={user.levelPoints ?? 500} size="sm" showTierLabel />
                  </div>
                  {user.steamId64 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-mono">{user.steamId64}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <LevelProgress levelPoints={user.levelPoints ?? 500} />
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full"
                    data-testid="button-edit-profile"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-primary" />
              Rankings e Destaques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg" data-testid="card-ranking-geral">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold font-mono">
                  {generalRanking.position > 0 ? `${generalRanking.position}°` : "-"}
                </div>
                <div className="text-sm text-muted-foreground">Ranking Geral</div>
                {generalRanking.total > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">de {generalRanking.total} jogadores</div>
                )}
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg" data-testid="card-ranking-mensal">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold font-mono">
                  {monthlyRanking.position > 0 ? `${monthlyRanking.position}°` : "-"}
                </div>
                <div className="text-sm text-muted-foreground">Ranking Mensal</div>
                {monthlyData?.monthName && (
                  <div className="text-xs text-muted-foreground mt-1 capitalize">{monthlyData.monthName}</div>
                )}
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg" data-testid="card-skill-rating">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold font-mono">
                  {getLevel(user.levelPoints ?? 500)}
                </div>
                <div className="text-sm text-muted-foreground">Nível</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg" data-testid="card-mvps-total">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold font-mono">{user.totalMvps}</div>
                <div className="text-sm text-muted-foreground">MVPs Total</div>
                {monthlyRanking.mvps > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">{monthlyRanking.mvps} este mês</div>
                )}
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg" data-testid="card-assists-total">
                <Handshake className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold font-mono">{user.totalAssists}</div>
                <div className="text-sm text-muted-foreground">Assistências Total</div>
                {monthlyRanking.assists > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">{monthlyRanking.assists} este mês</div>
                )}
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg" data-testid="card-kd-ratio">
                <Crosshair className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold font-mono">{kdRatio}</div>
                <div className="text-sm text-muted-foreground">K/D Ratio</div>
              </div>
            </div>

            {monthlyRanking.matchesPlayed > 0 && (
              <div className="mt-4 p-3 rounded-lg border border-border/50 bg-muted/30">
                <div className="text-sm font-medium mb-2 capitalize">Resumo Mensal - {monthlyData?.monthName}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Partidas</span>
                    <span className="font-mono font-bold">{monthlyRanking.matchesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kills</span>
                    <span className="font-mono font-bold text-green-500">{monthlyRanking.kills}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deaths</span>
                    <span className="font-mono font-bold text-red-500">{monthlyRanking.deaths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HS</span>
                    <span className="font-mono font-bold text-yellow-500">{monthlyRanking.headshots}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {lpEvolution.length > 0 && (
        <Card data-testid="card-skill-evolution">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolução de Desempenho
            </CardTitle>
            <CardDescription>
              Progressão de LP acumulada mês a mês com base nas suas partidas reais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lpEvolution} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 2100]}
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    formatter={(value: number, _name: string, props: any) => {
                      const lvl = props.payload?.level;
                      return [
                        <span key="v" className="font-mono font-bold">{value} LP{lvl ? ` — Nível ${lvl}` : ''}</span>,
                        'Pontos'
                      ];
                    }}
                  />
                  <ReferenceLine y={900}  stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" label={{ value: "Prata", position: "insideTopRight", fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                  <ReferenceLine y={1500} stroke="hsl(220 70% 60%)" strokeDasharray="4 4" label={{ value: "Dourado", position: "insideTopRight", fontSize: 9, fill: "hsl(220 70% 60%)" }} />
                  <ReferenceLine y={2000} stroke="hsl(var(--primary))" strokeDasharray="4 4" label={{ value: "Lendário", position: "insideTopRight", fontSize: 9, fill: "hsl(var(--primary))" }} />
                  <Line
                    type="monotone"
                    dataKey="levelPoints"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 8, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
              {lpEvolution.length >= 2 && (() => {
                const first = lpEvolution[0].levelPoints;
                const last = lpEvolution[lpEvolution.length - 1].levelPoints;
                const diff = last - first;
                return (
                  <Badge variant={diff >= 0 ? "default" : "destructive"} className="font-mono">
                    <TrendingUp className={`h-3 w-3 mr-1 ${diff < 0 ? "rotate-180" : ""}`} />
                    {diff >= 0 ? "+" : ""}{diff} LP no período
                  </Badge>
                );
              })()}
              <Badge variant="secondary" className="font-mono">
                Nível atual: {Math.min(21, Math.floor((user?.levelPoints ?? 0) / 100) + 1)}
              </Badge>
              <span className="text-xs">{lpEvolution.length} {lpEvolution.length === 1 ? "mês" : "meses"} com dados</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Itens e Modificadores ─────────────────────────────────────── */}
      <Card data-testid="card-items">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Itens e Modificadores de RP
          </CardTitle>
          <CardDescription>
            Ganhos completando objetivos. Use até 2 por dia entre 07:00 e 19:00 (BRT).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Streak */}
          {(itemsData?.winStreak ?? 0) >= 3 && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-orange-500/10 border border-orange-500/30">
              <Flame className="h-6 w-6 text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-orange-400">
                  Sequência de {itemsData?.winStreak} vitórias!
                </p>
                <p className="text-xs text-muted-foreground">
                  +{(itemsData?.winStreak ?? 0) >= 10 ? 12 : (itemsData?.winStreak ?? 0) >= 7 ? 8 : (itemsData?.winStreak ?? 0) >= 5 ? 5 : 3} LP bônus por vitória enquanto mantiver o streak
                </p>
              </div>
            </div>
          )}

          {/* Active Modifier */}
          {itemsData?.activeModifier && (
            <div className={`flex items-center justify-between gap-3 p-3 rounded-md border ${itemsData.activeModifier === 'desafio_rp' ? 'bg-primary/10 border-primary/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
              <div className="flex items-center gap-3">
                {itemsData.activeModifier === 'desafio_rp'
                  ? <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                  : <Snowflake className="h-5 w-5 text-blue-400 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-sm">
                    {itemsData.activeModifier === 'desafio_rp' ? 'Desafio RP ativo' : 'Freeze RP ativo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {itemsData.activeModifier === 'desafio_rp'
                      ? 'LP dobrado na próxima partida importada'
                      : 'LP zerado na próxima partida (sem perda)'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                data-testid="button-cancel-modifier"
                onClick={() => cancelModifierMutation.mutate()}
                disabled={cancelModifierMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </div>
          )}

          {/* Items inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Desafio RP */}
            <div className="p-4 rounded-md border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Desafio RP</p>
                  <p className="text-xs text-muted-foreground">Dobra os LP ganhos ou perdidos</p>
                </div>
                <Badge variant="secondary" className="ml-auto font-mono">
                  ×{itemsData?.desafioRpCount ?? 0}
                </Badge>
              </div>
              <Button
                size="sm"
                className="w-full"
                data-testid="button-activate-desafio-rp"
                disabled={
                  (itemsData?.desafioRpCount ?? 0) <= 0 ||
                  !!itemsData?.activeModifier ||
                  (itemsData?.itemsUsedToday ?? 0) >= 2 ||
                  isItemTimeBlocked ||
                  activateModifierMutation.isPending
                }
                onClick={() => activateModifierMutation.mutate('desafio_rp')}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                {itemsData?.activeModifier ? 'Modificador já ativo' : isItemTimeBlocked ? 'Bloqueado (fora do horário)' : (itemsData?.itemsUsedToday ?? 0) >= 2 ? 'Limite diário atingido' : 'Ativar'}
              </Button>
            </div>

            {/* Freeze RP */}
            <div className="p-4 rounded-md border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <Snowflake className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-sm">Freeze RP</p>
                  <p className="text-xs text-muted-foreground">Zera ganhos/perdas (sem LP)</p>
                </div>
                <Badge variant="secondary" className="ml-auto font-mono">
                  ×{itemsData?.freezeRpCount ?? 0}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                data-testid="button-activate-freeze-rp"
                disabled={
                  (itemsData?.freezeRpCount ?? 0) <= 0 ||
                  !!itemsData?.activeModifier ||
                  (itemsData?.itemsUsedToday ?? 0) >= 2 ||
                  isItemTimeBlocked ||
                  activateModifierMutation.isPending
                }
                onClick={() => activateModifierMutation.mutate('freeze_rp')}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                {itemsData?.activeModifier ? 'Modificador já ativo' : isItemTimeBlocked ? 'Bloqueado (fora do horário)' : (itemsData?.itemsUsedToday ?? 0) >= 2 ? 'Limite diário atingido' : 'Ativar'}
              </Button>
            </div>
          </div>

          {/* How to earn */}
          <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t">
            <p className="font-semibold text-foreground mb-1">Como ganhar itens:</p>
            <p>• Fazer 1 ACE (5K) em uma partida → +1 de cada</p>
            <p>• Ser MVP de uma partida → +1 de cada</p>
            <p>• Jogar 5 dias diferentes → +1 de cada (marco único)</p>
            <p>• Ter troféu no ranking do mês anterior → +1 de cada</p>
          </div>
        </CardContent>
      </Card>

      {userTrophies.length > 0 && (
        <Card data-testid="card-trophies">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              Medalhas e Troféus
            </CardTitle>
            <CardDescription>
              Conquistas baseadas no ranking mensal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {userTrophies.map((trophy) => {
                const trophyConfig = getTrophyConfig(trophy.type);
                return (
                  <div
                    key={trophy.id}
                    data-testid={`trophy-${trophy.type}-${trophy.month}-${trophy.year}`}
                    className={`relative p-4 rounded-md border ${trophyConfig.borderClass} ${trophyConfig.bgClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 p-2 rounded-md ${trophyConfig.iconBgClass}`}>
                        <trophyConfig.icon className={`h-6 w-6 ${trophyConfig.iconClass}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight">{trophy.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-snug">{trophy.description}</p>
                        {trophy.value && (
                          <Badge variant="secondary" className="mt-2 font-mono text-xs">
                            {trophy.value}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estatísticas Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <Crosshair className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold font-mono">{kdRatio}</div>
                <div className="text-sm text-muted-foreground">K/D Ratio</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold font-mono">{headshotPercent}%</div>
                <div className="text-sm text-muted-foreground">Headshot %</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold font-mono">{winRate}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Vitória</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold font-mono">{user.totalMatches}</div>
                <div className="text-sm text-muted-foreground">Partidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.totalMatches === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você ainda não tem partidas registradas. {!user.steamId64 && "Vincule seu SteamID64 para sincronizar suas estatísticas."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card data-testid="card-averages">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Médias por Partida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Kills / Partida
              </span>
              <span className="font-mono font-bold text-green-500">{killsPerMatch}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Skull className="h-4 w-4 text-red-500" />
                Deaths / Partida
              </span>
              <span className="font-mono font-bold text-red-500">{deathsPerMatch}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                Assists / Partida
              </span>
              <span className="font-mono font-bold">{assistsPerMatch}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-yellow-500" />
                Headshots / Partida
              </span>
              <span className="font-mono font-bold text-yellow-500">{hsPerMatch}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                ADR (Dano / Round)
              </span>
              <span className="font-mono font-bold text-primary">{adrPerRound}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                MVPs / Partida
              </span>
              <span className="font-mono font-bold">{mvpsPerMatch}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Combate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total de Kills</span>
              <span className="font-mono font-bold text-green-500">{user.totalKills}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total de Deaths</span>
              <span className="font-mono font-bold text-red-500">{user.totalDeaths}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Assistências</span>
              <span className="font-mono font-bold">{user.totalAssists}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Headshots</span>
              <span className="font-mono font-bold text-yellow-500">{user.totalHeadshots}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Dano Total</span>
              <span className="font-mono font-bold">{user.totalDamage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ADR (Estimado)</span>
              <span className="font-mono font-bold text-primary">{adr}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Partidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Vitórias</span>
              <span className="font-mono font-bold text-green-500">{user.matchesWon}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Derrotas</span>
              <span className="font-mono font-bold text-red-500">{user.matchesLost}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rounds Jogados</span>
              <span className="font-mono font-bold">{user.totalRoundsPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rounds Ganhos</span>
              <span className="font-mono font-bold">{user.roundsWon}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxa de Rounds</span>
              <span className="font-mono font-bold">{roundWinRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total de MVPs</span>
              <Badge variant="default" className="font-mono">
                <Star className="h-3 w-3 mr-1" />
                {user.totalMvps}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Kills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                ACE (5K)
              </span>
              <span className="font-mono font-bold text-yellow-500">{user.total5ks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">4K</span>
              <span className="font-mono font-bold">{user.total4ks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">3K</span>
              <span className="font-mono font-bold">{user.total3ks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">2K</span>
              <span className="font-mono font-bold">{user.total2ks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clutches & Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">1v1 Wins</span>
              <span className="font-mono font-bold">{user.total1v1Wins} / {user.total1v1Count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">1v1 Win Rate</span>
              <span className="font-mono font-bold text-primary">{clutchWinRate1v1}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">1v2 Wins</span>
              <span className="font-mono font-bold">{user.total1v2Wins} / {user.total1v2Count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Entry Frags</span>
              <span className="font-mono font-bold">{user.totalEntryWins} / {user.totalEntryCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Entry Win Rate</span>
              <span className="font-mono font-bold text-primary">{entryWinRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilitários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Flashes Lançadas
              </span>
              <span className="font-mono font-bold">{user.totalFlashCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Flashes Efetivas</span>
              <span className="font-mono font-bold">{user.totalFlashSuccesses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Inimigos Cegados</span>
              <span className="font-mono font-bold text-primary">{user.totalEnemiesFlashed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Dano de Utility</span>
              <span className="font-mono font-bold">{user.totalUtilityDamage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxa de Sucesso</span>
              <span className="font-mono font-bold">{flashSuccessRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precisão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Tiros Disparados
              </span>
              <span className="font-mono font-bold">{user.totalShotsFired}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tiros no Alvo</span>
              <span className="font-mono font-bold">{user.totalShotsOnTarget}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxa de Acerto</span>
              <span className="font-mono font-bold text-primary">{accuracy}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
