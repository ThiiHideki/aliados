import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Trophy, Users, Swords, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight,
  Plus, Edit2, BarChart3, Eye, Shield, Star, Trash2, Lock, Unlock, Shuffle, AlertTriangle
} from "lucide-react";
import type { CopaTeam, CopaPlayer, CopaMatch, CopaMatchStats } from "@shared/schema";

type TeamWithPlayers = CopaTeam & { players: CopaPlayer[] };
type MatchWithTeams = CopaMatch & { team1: CopaTeam | null; team2: CopaTeam | null; winner: CopaTeam | null };

const STATUS_CONFIG = {
  pending: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  rejected: { label: "Rejeitado", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

const ROUNDS = ["Fase de Grupos","Oitavas de Final","Quartas de Final","Semifinal","Final"];
const MAPS = ["de_mirage","de_inferno","de_nuke","de_ancient","de_anubis","de_dust2","de_vertigo"];

function TeamStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return <Badge className={`${cfg.color} text-xs`}><Icon className="h-3 w-3 mr-1" />{cfg.label}</Badge>;
}

function TeamCard({ team, onStatusChange }: { team: TeamWithPlayers; onStatusChange: (id: number, status: string, notes?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(team.adminNotes ?? "");

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card data-testid={`team-card-${team.id}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-bold">{team.teamName}</p>
                  <p className="text-xs text-muted-foreground">{team.leaderName} · {team.leaderContact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TeamStatusBadge status={team.status} />
                <Badge variant="outline" className="text-xs">{team.players.length} jog.</Badge>
                {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <div className="border-t pt-4">
              {/* Players */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Jogadores</p>
                {team.players.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <div className="text-xs w-4 text-center text-muted-foreground">{p.playerOrder + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.playerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.steamProfile}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-0.5">
                      <Badge variant="outline" className="text-xs">{p.position}</Badge>
                      <div className="flex gap-1 justify-end">
                        {p.faceitLevel && p.faceitLevel > 0 && <Badge variant="secondary" className="text-xs">F{p.faceitLevel}</Badge>}
                        {p.gcLevel && p.gcLevel > 0 && <Badge variant="secondary" className="text-xs">GC{p.gcLevel}</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment proof */}
              {team.paymentProof && (
                <div className="mb-4 space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Comprovante</p>
                  <img
                    src={team.paymentProof}
                    alt="Comprovante"
                    className="max-h-48 rounded-lg border object-contain cursor-pointer"
                    onClick={() => window.open(team.paymentProof!, "_blank")}
                    data-testid={`payment-proof-${team.id}`}
                  />
                </div>
              )}

              {/* Admin notes */}
              <div className="space-y-1.5 mb-4">
                <Label className="text-xs">Observações do Admin</Label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Notas sobre o pagamento ou inscrição..."
                  rows={2}
                  data-testid={`notes-${team.id}`}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm" variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onStatusChange(team.id, "confirmed", notes)}
                  data-testid={`confirm-team-${team.id}`}
                  disabled={team.status === "confirmed"}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirmar Pagamento
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                  onClick={() => onStatusChange(team.id, "rejected", notes)}
                  data-testid={`reject-team-${team.id}`}
                  disabled={team.status === "rejected"}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
                <Button size="sm" variant="outline"
                  onClick={() => onStatusChange(team.id, "pending", notes)}
                  disabled={team.status === "pending"}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Pendente
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function StatsRow({
  label, value, onChange,
}: { label: string; value: string | number; onChange: (v: string) => void }) {
  return (
    <div className="space-y-0.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number" min="0" value={value}
        onChange={e => onChange(e.target.value)}
        className="h-8 text-sm"
      />
    </div>
  );
}

type StatForm = {
  playerName: string; teamId: string;
  kills: string; deaths: string; assists: string; headshots: string;
  damage: string; adr: string; firstKills: string; flashAssists: string;
  twoK: string; threeK: string; fourK: string; fiveK: string;
  clutch1v1Wins: string; clutch1v2Wins: string;
};

const emptyStatForm = (playerName = "", teamId = ""): StatForm => ({
  playerName, teamId,
  kills: "0", deaths: "0", assists: "0", headshots: "0",
  damage: "0", adr: "0", firstKills: "0", flashAssists: "0",
  twoK: "0", threeK: "0", fourK: "0", fiveK: "0",
  clutch1v1Wins: "0", clutch1v2Wins: "0",
});

function MatchDialog({
  open, onClose, teams, match,
}: {
  open: boolean; onClose: () => void;
  teams: TeamWithPlayers[];
  match?: MatchWithTeams;
}) {
  const { toast } = useToast();
  const isEdit = !!match;

  const [round, setRound] = useState(match?.round ?? "");
  const [roundNumber, setRoundNumber] = useState(String(match?.roundNumber ?? 1));
  const [team1Id, setTeam1Id] = useState(String(match?.team1Id ?? ""));
  const [team2Id, setTeam2Id] = useState(String(match?.team2Id ?? ""));
  const [team1Score, setTeam1Score] = useState(String(match?.team1Score ?? ""));
  const [team2Score, setTeam2Score] = useState(String(match?.team2Score ?? ""));
  const [winnerId, setWinnerId] = useState(String(match?.winnerId ?? ""));
  const [mapName, setMapName] = useState(match?.mapName ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    match?.scheduledAt ? new Date(match.scheduledAt).toISOString().slice(0, 16) : ""
  );
  const [streamUrl, setStreamUrl] = useState(match?.streamUrl ?? "");
  const [notes, setNotes] = useState(match?.notes ?? "");
  const [isFinished, setIsFinished] = useState(match?.isFinished ?? false);

  // Stats management
  const t1 = teams.find(t => t.id === Number(team1Id));
  const t2 = teams.find(t => t.id === Number(team2Id));
  const [stats, setStats] = useState<StatForm[]>(() => {
    const rows: StatForm[] = [];
    if (t1) t1.players.forEach(p => rows.push(emptyStatForm(p.playerName, String(t1.id))));
    if (t2) t2.players.forEach(p => rows.push(emptyStatForm(p.playerName, String(t2.id))));
    return rows;
  });

  const updateTeams = (t1Val: string, t2Val: string) => {
    const newT1 = teams.find(t => t.id === Number(t1Val));
    const newT2 = teams.find(t => t.id === Number(t2Val));
    const rows: StatForm[] = [];
    if (newT1) newT1.players.forEach(p => rows.push(emptyStatForm(p.playerName, t1Val)));
    if (newT2) newT2.players.forEach(p => rows.push(emptyStatForm(p.playerName, t2Val)));
    setStats(rows);
  };

  const updateStat = (idx: number, field: keyof StatForm, val: string) => {
    setStats(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const addStat = () => setStats(prev => [...prev, emptyStatForm()]);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/copa/matches", {
      round, roundNumber: parseInt(roundNumber),
      team1Id: team1Id ? Number(team1Id) : null,
      team2Id: team2Id ? Number(team2Id) : null,
      scheduledAt: scheduledAt || null, streamUrl, notes,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/matches"] });
      toast({ title: "Partida criada!" });
      onClose();
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/copa/matches/${match!.id}`, {
      team1Score: team1Score !== "" ? Number(team1Score) : null,
      team2Score: team2Score !== "" ? Number(team2Score) : null,
      winnerId: winnerId ? Number(winnerId) : null,
      mapName: mapName || null,
      streamUrl: streamUrl || null,
      notes: notes || null,
      isFinished,
      scheduledAt: scheduledAt || null,
      stats: stats.map(s => ({
        matchId: match!.id,
        teamId: s.teamId ? Number(s.teamId) : null,
        playerName: s.playerName,
        kills: parseInt(s.kills) || 0,
        deaths: parseInt(s.deaths) || 0,
        assists: parseInt(s.assists) || 0,
        headshots: parseInt(s.headshots) || 0,
        damage: parseInt(s.damage) || 0,
        adr: parseFloat(s.adr) || 0,
        firstKills: parseInt(s.firstKills) || 0,
        flashAssists: parseInt(s.flashAssists) || 0,
        twoK: parseInt(s.twoK) || 0,
        threeK: parseInt(s.threeK) || 0,
        fourK: parseInt(s.fourK) || 0,
        fiveK: parseInt(s.fiveK) || 0,
        clutch1v1Wins: parseInt(s.clutch1v1Wins) || 0,
        clutch1v2Wins: parseInt(s.clutch1v2Wins) || 0,
      })),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/copa/stats"] });
      toast({ title: "Partida atualizada!" });
      onClose();
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const confirmedTeams = teams.filter(t => t.status === "confirmed");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Partida" : "Criar Partida"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Fase *</Label>
              <Select value={round} onValueChange={setRound}>
                <SelectTrigger><SelectValue placeholder="Selecione a fase" /></SelectTrigger>
                <SelectContent>
                  {ROUNDS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Número da Rodada</Label>
              <Input type="number" value={roundNumber} onChange={e => setRoundNumber(e.target.value)} min="1" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Time 1</Label>
              <Select value={team1Id} onValueChange={v => { setTeam1Id(v); updateTeams(v, team2Id); }}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {confirmedTeams.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.teamName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Time 2</Label>
              <Select value={team2Id} onValueChange={v => { setTeam2Id(v); updateTeams(team1Id, v); }}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {confirmedTeams.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.teamName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEdit && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Placar Time 1</Label>
                  <Input type="number" value={team1Score} onChange={e => setTeam1Score(e.target.value)} min="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>Placar Time 2</Label>
                  <Input type="number" value={team2Score} onChange={e => setTeam2Score(e.target.value)} min="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>Vencedor</Label>
                  <Select value={winnerId} onValueChange={setWinnerId}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {[match?.team1, match?.team2].filter(Boolean).map(t => t && (
                        <SelectItem key={t.id} value={String(t.id)}>{t.teamName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is-finished" checked={isFinished} onChange={e => setIsFinished(e.target.checked)} />
                <Label htmlFor="is-finished" className="cursor-pointer">Partida Finalizada</Label>
              </div>
            </>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Mapa</Label>
              <Select value={mapName} onValueChange={setMapName}>
                <SelectTrigger><SelectValue placeholder="Selecione o mapa" /></SelectTrigger>
                <SelectContent>
                  {MAPS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Data/Hora Agendada</Label>
              <Input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>URL da Transmissão</Label>
            <Input placeholder="https://twitch.tv/..." value={streamUrl} onChange={e => setStreamUrl(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea rows={2} placeholder="Notas da partida..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* Stats entry (only when editing) */}
          {isEdit && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Estatísticas dos Jogadores</Label>
                <Button size="sm" variant="outline" onClick={addStat}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Adicionar
                </Button>
              </div>
              {stats.map((s, idx) => (
                <Card key={idx} className="bg-muted/20 border-border/50">
                  <CardContent className="pt-3 pb-3">
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 mb-2">
                      <div className="space-y-0.5 col-span-2 sm:col-span-1">
                        <Label className="text-xs">Jogador</Label>
                        <Input value={s.playerName} onChange={e => updateStat(idx, "playerName", e.target.value)} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-xs">Time</Label>
                        <Select value={s.teamId} onValueChange={v => updateStat(idx, "teamId", v)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Time" /></SelectTrigger>
                          <SelectContent>
                            {[t1, t2].filter(Boolean).map(t => t && (
                              <SelectItem key={t.id} value={String(t.id)}>{t.teamName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
                      {(["kills","deaths","assists","headshots","damage","adr","firstKills","twoK","threeK","fourK","fiveK","clutch1v1Wins","clutch1v2Wins"] as (keyof StatForm)[]).map(field => (
                        <StatsRow key={field} label={field} value={s[field]} onChange={v => updateStat(idx, field, v)} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => isEdit ? updateMutation.mutate() : createMutation.mutate()}
            disabled={createMutation.isPending || updateMutation.isPending}
            data-testid="button-save-match"
          >
            {(createMutation.isPending || updateMutation.isPending)
              ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              : <CheckCircle className="h-4 w-4 mr-2" />}
            {isEdit ? "Salvar Alterações" : "Criar Partida"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCopa() {
  const { toast } = useToast();
  const [matchDialog, setMatchDialog] = useState<{ open: boolean; match?: MatchWithTeams }>({ open: false });
  const [closeDialog, setCloseDialog] = useState(false);
  const [drawDialog, setDrawDialog] = useState(false);

  const { data: teams = [], isLoading: loadingTeams } = useQuery<TeamWithPlayers[]>({
    queryKey: ["/api/copa/teams"],
  });
  const { data: matches = [], isLoading: loadingMatches } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/copa/matches"],
  });
  const { data: regStatus } = useQuery<{ closed: boolean }>({
    queryKey: ["/api/copa/registration-status"],
    refetchInterval: false,
  });

  const registrationClosed = regStatus?.closed ?? false;

  const statusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      apiRequest("PATCH", `/api/copa/teams/${id}/status`, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/teams"] });
      toast({ title: "Status atualizado!" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const closeMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/copa/close-registration"),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/registration-status"] });
      toast({ title: data.closed ? "Inscrições encerradas!" : "Inscrições reabertas!" });
      setCloseDialog(false);
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const drawMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/copa/draw"),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/matches"] });
      toast({ title: `Sorteio realizado! ${data.matches?.length ?? 0} partidas criadas — ${data.round}` });
      setDrawDialog(false);
    },
    onError: (e: any) => toast({ title: "Erro no sorteio", description: e.message, variant: "destructive" }),
  });

  const pending = teams.filter(t => t.status === "pending");
  const confirmed = teams.filter(t => t.status === "confirmed");
  const rejected = teams.filter(t => t.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Admin — Copa Inimigos da Bala</h1>
              <p className="text-muted-foreground text-sm">Gerenciar inscrições e partidas</p>
            </div>
          </div>
          <Button onClick={() => setMatchDialog({ open: true })} data-testid="button-new-match">
            <Plus className="h-4 w-4 mr-2" />
            Nova Partida
          </Button>
        </div>

        {/* Action buttons row */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className={registrationClosed
              ? "border-green-500/50 text-green-400"
              : "border-red-500/50 text-red-400"}
            onClick={() => setCloseDialog(true)}
            data-testid="button-close-registration"
          >
            {registrationClosed
              ? <><Unlock className="h-4 w-4 mr-2" />Reabrir Inscrições</>
              : <><Lock className="h-4 w-4 mr-2" />Finalizar Inscrições</>}
          </Button>
          <Button
            variant="outline"
            className="border-primary/50 text-primary"
            onClick={() => setDrawDialog(true)}
            disabled={confirmed.length < 2}
            data-testid="button-draw"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Realizar Sorteio
            {confirmed.length >= 2 && (
              <Badge variant="secondary" className="ml-2 text-xs">{confirmed.length} times</Badge>
            )}
          </Button>
        </div>

        {registrationClosed && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-3 pb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400 font-medium">Inscrições encerradas — novos times não podem se inscrever.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Close registration dialog */}
      <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {registrationClosed
                ? <><Unlock className="h-5 w-5 text-green-400" />Reabrir Inscrições</>
                : <><Lock className="h-5 w-5 text-red-400" />Finalizar Inscrições</>}
            </DialogTitle>
            <DialogDescription>
              {registrationClosed
                ? "Times voltarão a poder se inscrever na Copa."
                : "Novos times não poderão mais se inscrever na Copa após confirmar."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {!registrationClosed && (
              <Card className="bg-muted/30">
                <CardContent className="pt-3 pb-3 text-sm space-y-1">
                  <p><span className="font-semibold">{pending.length}</span> time(s) pendente(s) de confirmação</p>
                  <p><span className="font-semibold">{confirmed.length}</span> time(s) confirmado(s)</p>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCloseDialog(false)}>Cancelar</Button>
            <Button
              variant={registrationClosed ? "default" : "destructive"}
              onClick={() => closeMutation.mutate()}
              disabled={closeMutation.isPending}
              data-testid="confirm-close-registration"
            >
              {closeMutation.isPending
                ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                : registrationClosed
                  ? <Unlock className="h-4 w-4 mr-2" />
                  : <Lock className="h-4 w-4 mr-2" />}
              {registrationClosed ? "Reabrir" : "Encerrar Inscrições"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draw dialog */}
      <Dialog open={drawDialog} onOpenChange={setDrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-primary" />
              Realizar Sorteio
            </DialogTitle>
            <DialogDescription>
              Os times confirmados serão sorteados aleatoriamente e as partidas criadas automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Card className="bg-muted/30">
              <CardContent className="pt-3 pb-3">
                <p className="text-sm font-semibold mb-2 text-primary">{confirmed.length} time(s) no sorteio:</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {confirmed.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground w-4 text-right">{i + 1}.</span>
                      <Trophy className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="font-medium">{t.teamName}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {confirmed.length % 2 !== 0 && (
              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="pt-3 pb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-400">Número ímpar de times — o último ficará sem adversário nesta fase.</span>
                </CardContent>
              </Card>
            )}
            {matches.length > 0 && (
              <Card className="border-red-500/30 bg-red-500/5">
                <CardContent className="pt-3 pb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-400">Já existem {matches.length} partida(s) cadastrada(s). O sorteio adicionará novas partidas.</span>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDrawDialog(false)}>Cancelar</Button>
            <Button
              onClick={() => drawMutation.mutate()}
              disabled={drawMutation.isPending || confirmed.length < 2}
              data-testid="confirm-draw"
            >
              {drawMutation.isPending
                ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                : <Shuffle className="h-4 w-4 mr-2" />}
              Sortear Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Times", value: teams.length, color: "text-primary" },
          { label: "Pendentes", value: pending.length, color: "text-yellow-400" },
          { label: "Confirmados", value: confirmed.length, color: "text-green-400" },
          { label: "Partidas", value: matches.length, color: "text-blue-400" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-3xl font-black font-mono ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Times {pending.length > 0 && <Badge variant="destructive" className="text-xs ml-1">{pending.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Partidas
          </TabsTrigger>
        </TabsList>

        {/* Teams tab */}
        <TabsContent value="teams" className="mt-4 space-y-4">
          {pending.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-yellow-400">Aguardando Confirmação ({pending.length})</h3>
              </div>
              {pending.map(t => (
                <TeamCard key={t.id} team={t} onStatusChange={(id, status, notes) => statusMutation.mutate({ id, status, notes })} />
              ))}
            </div>
          )}
          {confirmed.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-green-400">Confirmados ({confirmed.length})</h3>
              </div>
              {confirmed.map(t => (
                <TeamCard key={t.id} team={t} onStatusChange={(id, status, notes) => statusMutation.mutate({ id, status, notes })} />
              ))}
            </div>
          )}
          {rejected.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-red-400">Rejeitados ({rejected.length})</h3>
              </div>
              {rejected.map(t => (
                <TeamCard key={t.id} team={t} onStatusChange={(id, status, notes) => statusMutation.mutate({ id, status, notes })} />
              ))}
            </div>
          )}
          {teams.length === 0 && !loadingTeams && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum time inscrito ainda.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Matches tab */}
        <TabsContent value="matches" className="mt-4 space-y-3">
          {matches.length === 0 && !loadingMatches ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Swords className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhuma partida cadastrada.</p>
                <Button className="mt-4" onClick={() => setMatchDialog({ open: true })}>
                  <Plus className="h-4 w-4 mr-2" />Criar Partida
                </Button>
              </CardContent>
            </Card>
          ) : (
            matches.map(m => (
              <Card key={m.id} className="bg-muted/20" data-testid={`admin-match-${m.id}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{m.round}</Badge>
                        {m.mapName && <Badge variant="secondary" className="text-xs font-mono">{m.mapName}</Badge>}
                        {m.isFinished
                          ? <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Finalizada</Badge>
                          : <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Pendente</Badge>
                        }
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-bold text-sm">{m.team1?.teamName ?? "A definir"}</span>
                        {m.isFinished && <span className="font-mono font-black text-primary">{m.team1Score ?? 0} x {m.team2Score ?? 0}</span>}
                        <span className="font-bold text-sm">{m.team2?.teamName ?? "A definir"}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setMatchDialog({ open: true, match: m })} data-testid={`edit-match-${m.id}`}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {matchDialog.open && (
        <MatchDialog
          open={matchDialog.open}
          onClose={() => setMatchDialog({ open: false })}
          teams={teams}
          match={matchDialog.match}
        />
      )}
    </div>
  );
}
