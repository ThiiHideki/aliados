import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, DollarSign, Users, Star, Shield, Swords, CheckCircle, Calendar } from "lucide-react";
import type { CopaTeam } from "@shared/schema";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

const ENTRY_FEE = 50;
const FIRST_PLACE_PCT = 0.60;
const SECOND_PLACE_PCT = 0.20;
const PRIZE_POOL_PCT = 0.80;

function PrizeTier({
  place, pct, color, description,
  teams,
}: { place: string; pct: number; color: string; description: string; teams: number }) {
  const totalPool = teams * ENTRY_FEE * PRIZE_POOL_PCT;
  const prize = Math.round(totalPool * (pct / (FIRST_PLACE_PCT + SECOND_PLACE_PCT)));
  return (
    <Card className={`border-2 ${color}`}>
      <CardContent className="pt-5 pb-5 text-center space-y-2">
        <Trophy className={`h-10 w-10 mx-auto ${color.includes("yellow") ? "text-yellow-400" : color.includes("slate") ? "text-slate-400" : "text-amber-600"}`} />
        <p className="text-2xl font-black">{place}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {teams > 0 ? (
          <div className="mt-2">
            <p className="text-3xl font-black text-primary font-mono">R$ {prize.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">{Math.round(pct * 100)}% do prêmio</p>
          </div>
        ) : (
          <p className="text-lg font-bold text-muted-foreground">{Math.round(pct * 100)}% do arrecadado</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function CopaPremiacoes() {
  const { data: teams = [] } = useQuery<(CopaTeam & { players: any[] })[]>({
    queryKey: ["/api/copa/teams"],
  });

  const confirmedTeams = teams.filter(t => t.status === "confirmed");
  const totalTeams = confirmedTeams.length;
  const totalRaised = totalTeams * ENTRY_FEE;
  const prizePool = Math.round(totalRaised * PRIZE_POOL_PCT);
  const firstPrize = Math.round(prizePool * (FIRST_PLACE_PCT / (FIRST_PLACE_PCT + SECOND_PLACE_PCT)));
  const secondPrize = Math.round(prizePool * (SECOND_PLACE_PCT / (FIRST_PLACE_PCT + SECOND_PLACE_PCT)));

  const scenarios = [
    { teams: 8, pool: 8 * ENTRY_FEE * PRIZE_POOL_PCT },
    { teams: 16, pool: 16 * ENTRY_FEE * PRIZE_POOL_PCT },
    { teams: 32, pool: 32 * ENTRY_FEE * PRIZE_POOL_PCT },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={copaImg} alt="Copa" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-black text-white">Premiações</h1>
          <p className="text-blue-300 text-sm">Copa Inimigos da Bala · CS2</p>
        </div>
      </div>

      {/* Live prize pool */}
      {totalTeams > 0 ? (
        <Card className="border-2 border-primary/40 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-6 w-6 text-primary" />
              <div>
                <p className="font-bold text-lg">Premiação Atual</p>
                <p className="text-xs text-muted-foreground">Baseada em {totalTeams} time(s) confirmado(s)</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-lg bg-muted/40">
                <p className="text-xs text-muted-foreground">Arrecadado</p>
                <p className="font-bold font-mono">R$ {totalRaised.toLocaleString("pt-BR")}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-muted-foreground">1° Lugar</p>
                <p className="font-bold font-mono text-yellow-500">R$ {firstPrize.toLocaleString("pt-BR")}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-500/10 border border-slate-500/20">
                <p className="text-xs text-muted-foreground">2° Lugar</p>
                <p className="font-bold font-mono text-slate-400">R$ {secondPrize.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-sm text-muted-foreground">
              A premiação será calculada conforme os times forem confirmados.
              Com <strong>mais times inscritos = maior premiação!</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Prize structure */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-2 border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="pt-5 pb-5 text-center space-y-2">
            <Trophy className="h-12 w-12 mx-auto text-yellow-400" />
            <p className="text-xl font-black">1° Lugar</p>
            <p className="text-sm text-muted-foreground">Campeão da Copa</p>
            <div className="mt-2 p-3 rounded-lg bg-yellow-500/10">
              <p className="text-3xl font-black text-yellow-400">60%</p>
              <p className="text-xs text-muted-foreground">do prêmio total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-slate-400/40 bg-slate-400/5">
          <CardContent className="pt-5 pb-5 text-center space-y-2">
            <Trophy className="h-12 w-12 mx-auto text-slate-400" />
            <p className="text-xl font-black">2° Lugar</p>
            <p className="text-sm text-muted-foreground">Vice-campeão</p>
            <div className="mt-2 p-3 rounded-lg bg-slate-400/10">
              <p className="text-3xl font-black text-slate-400">20%</p>
              <p className="text-xs text-muted-foreground">do prêmio total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenarios */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Simulador de Premiação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2 text-muted-foreground font-medium">Times</th>
                  <th className="text-right pb-2 text-muted-foreground font-medium">Arrecadado</th>
                  <th className="text-right pb-2 text-yellow-500 font-medium">1° Lugar</th>
                  <th className="text-right pb-2 text-slate-400 font-medium">2° Lugar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {scenarios.map(({ teams: n, pool }) => (
                  <tr key={n} className="hover-elevate">
                    <td className="py-2.5 font-medium">{n} times</td>
                    <td className="py-2.5 text-right font-mono">R$ {(n * ENTRY_FEE).toLocaleString("pt-BR")}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-yellow-500">
                      R$ {Math.round(pool * (FIRST_PLACE_PCT / (FIRST_PLACE_PCT + SECOND_PLACE_PCT))).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-400">
                      R$ {Math.round(pool * (SECOND_PLACE_PCT / (FIRST_PLACE_PCT + SECOND_PLACE_PCT))).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">* 20% do arrecadado destinado aos custos operacionais (servidor, admins, transmissão)</p>
        </CardContent>
      </Card>

      {/* Tournament info */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Sobre o Campeonato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { icon: Calendar, text: "Data prevista: 18 de Abril de 2026" },
            { icon: Swords, text: "Formato: Mata-Mata com sorteio dos adversários" },
            { icon: Shield, text: "Servidor com Anti-Cheat ativo em todas as partidas" },
            { icon: Users, text: "Admins acompanhando e arbitrando todas as partidas" },
            { icon: Star, text: "Transmissão ao vivo das partidas" },
            { icon: CheckCircle, text: "Estatísticas completas de todos os jogadores" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
