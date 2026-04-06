import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Swords, Trophy, CheckCircle, Clock, Users, Calendar, AlertCircle, Star,
  ChevronDown, ChevronUp, User, Pencil, Plus, Trash2, Save
} from "lucide-react";
import type { CopaTeam, CopaMatch } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

const REGISTRATION_DEADLINE = "18/04/2026 às 12:00";
const TOURNAMENT_START = "18/04/2026 às 14:00";

type MatchWithTeams = CopaMatch & {
  team1: CopaTeam | null;
  team2: CopaTeam | null;
  winner: CopaTeam | null;
};
type TeamWithPlayers = CopaTeam & { players: any[] };

/* ── reusable inline player list ───────────────────────────────────────── */
function PlayerList({ players }: { players: any[] }) {
  if (!players || players.length === 0) return (
    <p className="text-xs text-muted-foreground italic px-1">Sem jogadores cadastrados</p>
  );
  return (
    <ul className="space-y-1">
      {players.map((p, i) => (
        <li key={i} className="flex items-center gap-2 text-xs">
          <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="font-medium truncate">{p.playerName || p.player_name}</span>
          {(p.position) && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-auto ml-auto flex-shrink-0">
              {p.position}
            </Badge>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ── admin: edit team dialog ─────────────────────────────────────────── */
type PlayerForm = {
  playerName: string; steamProfile: string; age: string;
  position: string; gcLevel: string; faceitLevel: string;
};

function emptyPlayer(): PlayerForm {
  return { playerName: "", steamProfile: "", age: "", position: "Rifler", gcLevel: "", faceitLevel: "" };
}

const POSITIONS = ["AWPer", "Rifler", "IGL", "Support", "Entry", "Lurker"];

function EditTeamDialog({ team, open, onOpenChange }: {
  team: TeamWithPlayers;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [teamName, setTeamName] = useState(team.teamName);
  const [leaderName, setLeaderName] = useState(team.leaderName);
  const [leaderContact, setLeaderContact] = useState(team.leaderContact);
  const [players, setPlayers] = useState<PlayerForm[]>(() =>
    team.players.length > 0
      ? team.players.map(p => ({
          playerName: p.playerName ?? "",
          steamProfile: p.steamProfile ?? "",
          age: p.age != null ? String(p.age) : "",
          position: p.position ?? "Rifler",
          gcLevel: p.gcLevel != null ? String(p.gcLevel) : "",
          faceitLevel: p.faceitLevel != null ? String(p.faceitLevel) : "",
        }))
      : [emptyPlayer(), emptyPlayer(), emptyPlayer(), emptyPlayer(), emptyPlayer()]
  );

  const editMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/copa/teams/${team.id}/edit`, {
        teamName, leaderName, leaderContact,
        players: players.map((p, i) => ({
          playerName: p.playerName,
          steamProfile: p.steamProfile,
          age: parseInt(p.age) || 0,
          position: p.position,
          gcLevel: p.gcLevel ? parseInt(p.gcLevel) : null,
          faceitLevel: p.faceitLevel ? parseInt(p.faceitLevel) : null,
          isLeader: i === 0,
          playerOrder: i,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/teams"] });
      toast({ title: "Time atualizado!", description: "As alterações foram salvas." });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    },
  });

  const updatePlayer = (i: number, field: keyof PlayerForm, value: string) => {
    setPlayers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };
  const addPlayer = () => setPlayers(prev => [...prev, emptyPlayer()]);
  const removePlayer = (i: number) => setPlayers(prev => prev.filter((_, idx) => idx !== i));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-primary" />
            Editar Time: {team.teamName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Team info */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dados do Time</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-team-name">Nome do Time</Label>
                <Input id="edit-team-name" value={teamName} onChange={e => setTeamName(e.target.value)}
                  data-testid="input-edit-team-name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-leader-name">Nome do Capitão</Label>
                <Input id="edit-leader-name" value={leaderName} onChange={e => setLeaderName(e.target.value)}
                  data-testid="input-edit-leader-name" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-leader-contact">Contato do Capitão</Label>
                <Input id="edit-leader-contact" value={leaderContact} onChange={e => setLeaderContact(e.target.value)}
                  data-testid="input-edit-leader-contact" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Jogadores ({players.length})
              </p>
              <Button size="sm" variant="outline" onClick={addPlayer} data-testid="button-add-player-edit">
                <Plus className="h-3 w-3 mr-1" /> Adicionar
              </Button>
            </div>

            {players.map((p, i) => (
              <Card key={i} className="bg-muted/20">
                <CardContent className="pt-3 pb-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {i === 0 ? "Capitão" : `Jogador ${i + 1}`}
                      </span>
                    </div>
                    {players.length > 5 && i > 0 && (
                      <Button size="icon" variant="ghost" onClick={() => removePlayer(i)}
                        data-testid={`button-remove-player-${i}`}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Nome</Label>
                      <Input className="h-8 text-sm" value={p.playerName}
                        onChange={e => updatePlayer(i, "playerName", e.target.value)}
                        data-testid={`input-player-name-${i}`} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Steam / Perfil</Label>
                      <Input className="h-8 text-sm" value={p.steamProfile}
                        onChange={e => updatePlayer(i, "steamProfile", e.target.value)}
                        data-testid={`input-player-steam-${i}`} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Posição</Label>
                      <Select value={p.position} onValueChange={v => updatePlayer(i, "position", v)}>
                        <SelectTrigger className="h-8 text-sm" data-testid={`select-position-${i}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Idade</Label>
                      <Input className="h-8 text-sm" type="number" value={p.age}
                        onChange={e => updatePlayer(i, "age", e.target.value)}
                        data-testid={`input-player-age-${i}`} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">GC Level</Label>
                      <Input className="h-8 text-sm" type="number" placeholder="0–21" value={p.gcLevel}
                        onChange={e => updatePlayer(i, "gcLevel", e.target.value)}
                        data-testid={`input-player-gc-${i}`} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Faceit Level</Label>
                      <Input className="h-8 text-sm" type="number" placeholder="0–10" value={p.faceitLevel}
                        onChange={e => updatePlayer(i, "faceitLevel", e.target.value)}
                        data-testid={`input-player-faceit-${i}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => editMutation.mutate()}
            disabled={editMutation.isPending || !teamName.trim() || !leaderName.trim()}
            data-testid="button-save-team-edit"
          >
            {editMutation.isPending
              ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              : <Save className="h-4 w-4 mr-2" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── collapsible team panel (used inside match card) ──────────────────── */
function TeamPanel({
  teamName, players, isWinner, align = "center"
}: {
  teamName: string;
  players?: any[];
  isWinner: boolean;
  align?: "left" | "center" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex-1 rounded-lg transition-all
      ${isWinner ? "bg-green-500/15 border border-green-500/40" : "bg-muted/30"}`}>
      <button
        onClick={() => players && players.length > 0 && setOpen(o => !o)}
        className={`w-full p-3 text-${align} ${players && players.length > 0 ? "cursor-pointer" : "cursor-default"}`}
        data-testid={`team-panel-${teamName}`}
      >
        <p className={`font-bold text-sm leading-tight ${isWinner ? "text-green-400" : ""}`}>
          {teamName}
        </p>
        {isWinner && <p className="text-xs text-green-400 mt-0.5 font-medium">Vencedor</p>}
        {players && players.length > 0 && (
          <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5 mt-1">
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {players.length} jogadores
          </span>
        )}
      </button>
      {open && players && (
        <div className="px-3 pb-3 border-t border-border/40 pt-2">
          <PlayerList players={players} />
        </div>
      )}
    </div>
  );
}

/* ── individual match card inside bracket ─────────────────────────────── */
function MatchCard({ match, teamsMap }: { match: MatchWithTeams; teamsMap: Map<number, TeamWithPlayers> }) {
  const { team1, team2, winner } = match;
  const t1Win = !!winner && winner.id === team1?.id;
  const t2Win = !!winner && winner.id === team2?.id;

  const t1Players = team1 ? teamsMap.get(team1.id)?.players : undefined;
  const t2Players = team2 ? teamsMap.get(team2.id)?.players : undefined;

  return (
    <Card className="bg-muted/20 border-border/60" data-testid={`match-card-${match.id}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
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

        <div className="flex items-start gap-2">
          {/* Team 1 */}
          {team1 ? (
            <TeamPanel
              teamName={team1.teamName}
              players={t1Players}
              isWinner={t1Win}
            />
          ) : (
            <div className="flex-1 text-center p-3 rounded-lg bg-muted/30">
              <p className="font-bold text-sm text-muted-foreground">A definir</p>
            </div>
          )}

          {/* VS */}
          <div className="flex flex-col items-center justify-start pt-3 px-1 gap-1 flex-shrink-0">
            <Swords className="h-4 w-4 text-primary" />
            {match.isFinished && (
              <span className="text-xs font-mono font-black text-muted-foreground">
                {match.team1Score ?? 0} – {match.team2Score ?? 0}
              </span>
            )}
            {!match.isFinished && (
              <span className="text-xs text-muted-foreground font-bold">VS</span>
            )}
          </div>

          {/* Team 2 */}
          {team2 ? (
            <TeamPanel
              teamName={team2.teamName}
              players={t2Players}
              isWinner={t2Win}
            />
          ) : (
            <div className="flex-1 text-center p-3 rounded-lg bg-muted/30">
              <p className="font-bold text-sm text-muted-foreground">A definir</p>
            </div>
          )}
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

/* ── bracket: groups matches by round ────────────────────────────────── */
function BracketView({ matches, teamsMap }: { matches: MatchWithTeams[]; teamsMap: Map<number, TeamWithPlayers> }) {
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
              {roundMatches.map(m => <MatchCard key={m.id} match={m} teamsMap={teamsMap} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── collapsible team card in teams list ─────────────────────────────── */
function TeamCard({ team, variant, isAdmin }: {
  team: TeamWithPlayers;
  variant: "confirmed" | "pending";
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const isConfirmed = variant === "confirmed";

  return (
    <>
      <Card
        className={isConfirmed ? "bg-muted/20 border-green-500/25" : "bg-muted/20 border-yellow-500/20"}
        data-testid={`team-${variant}-${team.id}`}
      >
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0
              ${isConfirmed
                ? "bg-green-500/20 border border-green-500/40"
                : "bg-yellow-500/20 border border-yellow-500/40"}`}>
              {isConfirmed
                ? <CheckCircle className="h-4 w-4 text-green-400" />
                : <Clock className="h-4 w-4 text-yellow-400" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm truncate">{team.teamName}</p>
              <p className="text-xs text-muted-foreground">
                Capitão: {team.leaderName} · {team.players.length} jog.
              </p>
            </div>
            {!isConfirmed && (
              <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-xs flex-shrink-0">
                Aguardando
              </Badge>
            )}
            {isAdmin && (
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0"
                onClick={() => setEditing(true)}
                data-testid={`button-edit-team-${team.id}`}
                title="Editar time"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            {team.players.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0"
                onClick={() => setOpen(o => !o)}
                data-testid={`toggle-players-${team.id}`}
              >
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>

          {open && team.players.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/40">
              <PlayerList players={team.players} />
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <EditTeamDialog team={team} open={editing} onOpenChange={setEditing} />
      )}
    </>
  );
}

/* ── teams list (shown before bracket is defined) ─────────────────────── */
function TeamsList({ teams, isAdmin }: { teams: TeamWithPlayers[]; isAdmin: boolean }) {
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
            {confirmed.map(team => <TeamCard key={team.id} team={team} variant="confirmed" isAdmin={isAdmin} />)}
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
            {pending.map(team => <TeamCard key={team.id} team={team} variant="pending" isAdmin={isAdmin} />)}
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
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && !!(user as any)?.isAdmin;

  const { data: matches = [], isLoading: loadingMatches } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/copa/matches"],
  });
  const { data: teams = [], isLoading: loadingTeams } = useQuery<TeamWithPlayers[]>({
    queryKey: ["/api/copa/teams"],
  });

  const visibleTeams   = teams.filter(t => t.status !== "rejected");
  const confirmedTeams = teams.filter(t => t.status === "confirmed");
  const finished       = matches.filter(m => m.isFinished).length;
  const hasBracket     = matches.length > 0;
  const isLoading      = loadingMatches || loadingTeams;

  const teamsMap = new Map<number, TeamWithPlayers>(
    (teams as TeamWithPlayers[]).map(t => [t.id, t])
  );

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
          {/* Bracket */}
          {hasBracket && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary px-2">
                  Chaveamento
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <BracketView matches={matches} teamsMap={teamsMap} />
            </div>
          )}

          {/* Teams list */}
          {visibleTeams.length > 0 ? (
            <TeamsList teams={visibleTeams} isAdmin={isAdmin} />
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
