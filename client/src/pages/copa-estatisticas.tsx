import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Skull, Zap, Star, TrendingUp, Award, BarChart3 } from "lucide-react";
import type { CopaTeam, CopaMatchStats } from "@shared/schema";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

type StatsData = { stats: CopaMatchStats[]; teams: (CopaTeam & { players: any[] })[] };

type AggregatedPlayer = {
  playerName: string; teamName: string; teamId: number | null;
  kills: number; deaths: number; assists: number; headshots: number;
  damage: number; rounds: number; kd: number; hsPct: number; adr: number;
  matches: number; aces: number; fourK: number;
};

function aggregateStats(data: StatsData): AggregatedPlayer[] {
  const map = new Map<string, AggregatedPlayer>();
  const teamMap = new Map(data.teams.map(t => [t.id, t.teamName]));

  data.stats.forEach(s => {
    const key = `${s.playerName}:${s.teamId}`;
    if (!map.has(key)) {
      map.set(key, {
        playerName: s.playerName,
        teamName: s.teamId ? (teamMap.get(s.teamId) ?? "—") : "—",
        teamId: s.teamId ?? null,
        kills: 0, deaths: 0, assists: 0, headshots: 0,
        damage: 0, rounds: 0, kd: 0, hsPct: 0, adr: 0,
        matches: 0, aces: 0, fourK: 0,
      });
    }
    const p = map.get(key)!;
    p.kills += s.kills;
    p.deaths += s.deaths;
    p.assists += s.assists;
    p.headshots += s.headshots;
    p.damage += s.damage;
    p.matches += 1;
    p.aces += s.fiveK ?? 0;
    p.fourK += s.fourK ?? 0;
  });

  return Array.from(map.values()).map(p => ({
    ...p,
    kd: p.deaths > 0 ? parseFloat((p.kills / p.deaths).toFixed(2)) : p.kills,
    hsPct: p.kills > 0 ? Math.round((p.headshots / p.kills) * 100) : 0,
    adr: p.matches > 0 ? Math.round(p.damage / p.matches) : 0,
  }));
}

function Leaderboard({
  title, icon: Icon, players, valueKey, valueLabel, decimals = 0, color = "text-primary",
}: {
  title: string; icon: any; players: AggregatedPlayer[];
  valueKey: keyof AggregatedPlayer; valueLabel: string; decimals?: number; color?: string;
}) {
  const sorted = [...players].sort((a, b) => (Number(b[valueKey]) - Number(a[valueKey]))).slice(0, 10);
  if (sorted.length === 0) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-5 w-5 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map((p, i) => (
          <div key={`${p.playerName}-${i}`}
            className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/20"}`}
          >
            <span className={`text-sm font-bold w-5 text-center ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
              {i + 1}
            </span>
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="text-xs">{p.playerName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{p.playerName}</p>
              <p className="text-xs text-muted-foreground truncate">{p.teamName}</p>
            </div>
            <div className="text-right">
              <p className={`font-mono font-bold text-sm ${i === 0 ? color : ""}`}>
                {decimals > 0 ? Number(p[valueKey]).toFixed(decimals) : Number(p[valueKey])}
              </p>
              <p className="text-xs text-muted-foreground">{valueLabel}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function CopaEstatisticas() {
  const { data, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/copa/stats"],
  });

  const players = data ? aggregateStats(data) : [];
  const totalKills = players.reduce((s, p) => s + p.kills, 0);
  const totalMatches = data?.stats ? [...new Set(data.stats.map(s => s.matchId))].length : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={copaImg} alt="Copa" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-black text-white">Estatísticas</h1>
          <p className="text-blue-300 text-sm">Copa Inimigos da Bala · CS2</p>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: "Kills totais", value: totalKills },
          { icon: BarChart3, label: "Partidas", value: totalMatches },
          { icon: Star, label: "Jogadores", value: players.length },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="bg-muted/30">
            <CardContent className="pt-3 pb-3 text-center">
              <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-bold font-mono">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : players.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="font-semibold">Sem estatísticas ainda</p>
            <p className="text-sm text-muted-foreground">As stats serão exibidas conforme as partidas forem disputadas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Leaderboard title="Mais Kills" icon={Target} players={players} valueKey="kills" valueLabel="kills" color="text-red-400" />
          <Leaderboard title="Melhor K/D" icon={TrendingUp} players={players} valueKey="kd" valueLabel="K/D" decimals={2} color="text-green-400" />
          <Leaderboard title="Mais Assistências" icon={Zap} players={players} valueKey="assists" valueLabel="assists" color="text-blue-400" />
          <Leaderboard title="Maior HS%" icon={Award} players={players} valueKey="hsPct" valueLabel="HS%" color="text-orange-400" />
          <Leaderboard title="Maior ADR" icon={BarChart3} players={players} valueKey="adr" valueLabel="ADR" color="text-purple-400" />
          <Leaderboard title="Mais ACEs" icon={Star} players={players} valueKey="aces" valueLabel="ACEs" color="text-yellow-400" />
        </div>
      )}
    </div>
  );
}
