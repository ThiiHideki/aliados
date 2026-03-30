import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Swords, Trophy, CheckCircle, Clock, Users, Calendar, AlertCircle, Star
} from "lucide-react";
import type { CopaTeam, CopaMatch } from "@shared/schema";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

const REGISTRATION_DEADLINE = "18/04/2026 às 12:00";
const TOURNAMENT_START = "18/04/2026 às 14:00";

type MatchWithTeams = CopaMatch & {
  team1: CopaTeam | null;
  team2: CopaTeam | null;
  winner: CopaTeam | null;
};
type TeamWithPlayers = CopaTeam & { players: any[] };

/* ── individual match card inside bracket ─────────────────────────────── */
function MatchCard({ match }: { match: MatchWithTeams }) {
  const { team1, team2, winner } = match;
  const t1Win = !!winner && winner.id === team1?.id;
  const t2Win = !!winner && winner.id === team2?.id;

  return (
    <Card className="bg-muted/20 border-border/60" data-testid={`match-card-${match.id}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs text-muted-foreground font-medium">{match.round}</span>
          <div className="flex items-center gap-2 flex-wrap">
            {match.mapName && (
              <Badge variant="outline" className="text-xs font-mono">{match.mapName}</Badge>
            )}
            {match.isFinished ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />Finalizada
              </Badge>
            ) : match.scheduledAt ? (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(match.scheduledAt).toLocaleString("pt-BR", {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                })}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Aguardando</Badge>
            )}
          </div>
        </div>

        <div className="flex items-stretch gap-2">
          {/* Team 1 */}
          <div className={`flex-1 text-center p-3 rounded-lg
            ${t1Win ? "bg-green-500/15 border border-green-500/40" : "bg-muted/30"}`}>
            <p className={`font-bold text-sm leading-tight ${t1Win ? "text-green-400" : ""}`}>
              {team1?.teamName ?? "A definir"}
            </p>
            {match.isFinished && (
              <p className={`text-3xl font-black mt-1 font-mono
                ${t1Win ? "text-green-400" : "text-muted-foreground"}`}>
                {match.team1Score ?? 0}
              </p>
            )}
            {t1Win && <p className="text-xs text-green-400 mt-1 font-medium">Vencedor</p>}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center px-1 gap-1">
            <Swords className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-bold">VS</span>
          </div>

          {/* Team 2 */}
          <div className={`flex-1 text-center p-3 rounded-lg
            ${t2Win ? "bg-green-500/15 border border-green-500/40" : "bg-muted/30"}`}>
            <p className={`font-bold text-sm leading-tight ${t2Win ? "text-green-400" : ""}`}>
              {team2?.teamName ?? "A definir"}
            </p>
            {match.isFinished && (
              <p className={`text-3xl font-black mt-1 font-mono
                ${t2Win ? "text-green-400" : "text-muted-foreground"}`}>
                {match.team2Score ?? 0}
              </p>
            )}
            {t2Win && <p className="text-xs text-green-400 mt-1 font-medium">Vencedor</p>}
          </div>
        </div>

        {match.streamUrl && (
          <div className="mt-3 text-center">
            <a
              href={match.streamUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Assistir transmissão ao vivo
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── bracket: groups matches by round and renders columns ─────────────── */
function BracketView({ matches }: { matches: MatchWithTeams[] }) {
  const rounds = [...new Set(matches.map(m => m.round))];

  return (
    <div className="space-y-8">
      {rounds.map(round => {
        const roundMatches = matches.filter(m => m.round === round);
        return (
          <div key={round} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary px-3
                bg-primary/10 border border-primary/20 rounded-full py-1">
                {round}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {roundMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── teams list (shown before bracket is defined) ─────────────────────── */
function TeamsList({ teams }: { teams: TeamWithPlayers[] }) {
  const confirmed = teams.filter(t => t.status === "confirmed");
  const pending   = teams.filter(t => t.status === "pending");

  if (teams.length === 0) return null;

  return (
    <div className="space-y-5">
      {confirmed.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-green-400 px-2">
              Times Confirmados ({confirmed.length})
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {confirmed.map(team => (
              <Card key={team.id} className="bg-muted/20 border-green-500/25"
                data-testid={`team-confirmed-${team.id}`}>
                <CardContent className="pt-3 pb-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 border border-green-500/40
                    flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{team.teamName}</p>
                    <p className="text-xs text-muted-foreground">
                      Capitão: {team.leaderName} · {team.players.length} jog.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-yellow-400 px-2">
              Inscrições Pendentes ({pending.length})
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map(team => (
              <Card key={team.id} className="bg-muted/20 border-yellow-500/20"
                data-testid={`team-pending-${team.id}`}>
                <CardContent className="pt-3 pb-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/20 border border-yellow-500/40
                    flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{team.teamName}</p>
                    <p className="text-xs text-muted-foreground">
                      Capitão: {team.leaderName} · {team.players.length} jog.
                    </p>
                  </div>
                  <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-xs ml-auto flex-shrink-0">
                    Aguardando
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Times aguardando confirmação de pagamento pelos administradores.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────────────────── */
export default function CopaTabela() {
  const { data: matches = [], isLoading: loadingMatches } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/copa/matches"],
  });
  const { data: teams = [], isLoading: loadingTeams } = useQuery<TeamWithPlayers[]>({
    queryKey: ["/api/copa/teams"],
  });

  const visibleTeams  = teams.filter(t => t.status !== "rejected");
  const confirmedTeams = teams.filter(t => t.status === "confirmed");
  const finished      = matches.filter(m => m.isFinished).length;
  const hasBracket    = matches.length > 0;
  const isLoading     = loadingMatches || loadingTeams;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={copaImg} alt="Copa" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-black text-white">Tabela e Chaveamento</h1>
          <p className="text-blue-300 text-sm">Copa Inimigos da Bala · Mata-Mata</p>
        </div>
      </div>

      {/* Dates banner */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-3 pb-3 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-red-400">Prazo de inscrição</p>
              <p className="text-muted-foreground">{REGISTRATION_DEADLINE}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-3 pb-3 flex items-center gap-3">
            <Swords className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-primary">Início dos Jogos</p>
              <p className="text-muted-foreground">{TOURNAMENT_START}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users,       label: "Inscritos",   value: visibleTeams.length || "—" },
          { icon: CheckCircle, label: "Confirmados", value: confirmedTeams.length || "—" },
          { icon: Swords,      label: "Partidas",    value: matches.length || "—" },
          { icon: Trophy,      label: "Finalizadas", value: finished },
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
      ) : (
        <>
          {/* Bracket (when matches exist) */}
          {hasBracket && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary px-2">
                  Chaveamento
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <BracketView matches={matches} />
            </div>
          )}

          {/* Teams list */}
          {visibleTeams.length > 0 ? (
            <TeamsList teams={visibleTeams} />
          ) : (
            <Card>
              <CardContent className="py-14 text-center space-y-3">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="font-semibold">Nenhuma inscrição ainda</p>
                <p className="text-sm text-muted-foreground">
                  Seja o primeiro a inscrever seu time!
                </p>
              </CardContent>
            </Card>
          )}

          {/* No bracket yet but there are teams */}
          {!hasBracket && visibleTeams.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4 flex items-center gap-3 flex-wrap">
                <Star className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  O chaveamento será definido após o encerramento das inscrições.
                  Os jogos iniciam em <strong>18/04/2026 às 14:00</strong>.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
