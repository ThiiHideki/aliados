import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Trophy, CheckCircle, Clock, Users, Calendar } from "lucide-react";
import type { CopaTeam, CopaMatch } from "@shared/schema";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

type MatchWithTeams = CopaMatch & { team1: CopaTeam | null; team2: CopaTeam | null; winner: CopaTeam | null };

function statusBadge(m: MatchWithTeams) {
  if (m.isFinished) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"><CheckCircle className="h-3 w-3 mr-1" />Finalizada</Badge>;
  if (m.scheduledAt) return <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" />Agendada</Badge>;
  return <Badge variant="outline" className="text-xs">Aguardando</Badge>;
}

function MatchCard({ match }: { match: MatchWithTeams }) {
  const { team1, team2, winner } = match;
  const t1Win = winner?.id === team1?.id;
  const t2Win = winner?.id === team2?.id;

  return (
    <Card className="bg-muted/20 border-border/60" data-testid={`match-card-${match.id}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-muted-foreground font-medium">{match.round}</span>
          <div className="flex items-center gap-2">
            {match.mapName && <Badge variant="outline" className="text-xs font-mono">{match.mapName}</Badge>}
            {statusBadge(match)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Team 1 */}
          <div className={`flex-1 text-center p-3 rounded-lg transition-colors
            ${t1Win ? "bg-green-500/15 border border-green-500/30" : "bg-muted/30"}`}
          >
            <p className={`font-bold text-sm ${t1Win ? "text-green-400" : ""}`}>
              {team1?.teamName ?? "A definir"}
            </p>
            {match.isFinished && (
              <p className={`text-2xl font-black mt-1 ${t1Win ? "text-green-400" : "text-muted-foreground"}`}>
                {match.team1Score ?? 0}
              </p>
            )}
          </div>

          <div className="text-center px-2">
            <Swords className="h-5 w-5 text-primary mx-auto" />
            {!match.isFinished && match.scheduledAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(match.scheduledAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </p>
            )}
          </div>

          {/* Team 2 */}
          <div className={`flex-1 text-center p-3 rounded-lg transition-colors
            ${t2Win ? "bg-green-500/15 border border-green-500/30" : "bg-muted/30"}`}
          >
            <p className={`font-bold text-sm ${t2Win ? "text-green-400" : ""}`}>
              {team2?.teamName ?? "A definir"}
            </p>
            {match.isFinished && (
              <p className={`text-2xl font-black mt-1 ${t2Win ? "text-green-400" : "text-muted-foreground"}`}>
                {match.team2Score ?? 0}
              </p>
            )}
          </div>
        </div>

        {match.streamUrl && (
          <div className="mt-2 text-center">
            <a href={match.streamUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline">
              Assistir transmissão
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CopaTabela() {
  const { data: matches = [], isLoading } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/copa/matches"],
  });
  const { data: teams = [] } = useQuery<(CopaTeam & { players: any[] })[]>({
    queryKey: ["/api/copa/teams"],
  });

  const confirmedTeams = teams.filter(t => t.status === "confirmed");
  const rounds = [...new Set(matches.map(m => m.round))];
  const matchesByRound = (round: string) => matches.filter(m => m.round === round);

  const TOURNAMENT_DATE = "18 de Abril de 2026";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={copaImg} alt="Copa" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-black text-white">Tabela do Campeonato</h1>
          <p className="text-blue-300 text-sm">Copa Inimigos da Bala · Mata-Mata</p>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users, label: "Times", value: confirmedTeams.length || "—" },
          { icon: Swords, label: "Partidas", value: matches.length || "—" },
          { icon: CheckCircle, label: "Finalizadas", value: matches.filter(m => m.isFinished).length || 0 },
          { icon: Calendar, label: "Data Prevista", value: "18/04" },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="bg-muted/30">
            <CardContent className="pt-3 pb-3 text-center">
              <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Swords className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="font-semibold">Sorteio ainda não realizado</p>
            <p className="text-sm text-muted-foreground">
              As partidas serão definidas após o encerramento das inscrições.
            </p>
            <Badge variant="outline" className="text-sm px-4 py-1.5">
              <Calendar className="h-4 w-4 mr-2" />
              Data prevista: {TOURNAMENT_DATE}
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {rounds.map(round => (
            <div key={round} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary px-2">{round}</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {matchesByRound(round).map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teams list */}
      {confirmedTeams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">Times Confirmados</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {confirmedTeams.map(team => (
              <Card key={team.id} className="bg-muted/20 border-green-500/20">
                <CardContent className="pt-3 pb-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{team.teamName}</p>
                    <p className="text-xs text-muted-foreground">{team.players.length} jogador(es)</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
