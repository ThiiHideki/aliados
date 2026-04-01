import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Trophy, Users, Star, TrendingUp, Zap, Target,
  Shield, Calculator, Plus, RefreshCw, Trash2, Info,
  ChevronRight, Crown, Medal, Swords, Lock, PlusCircle,
  CheckCircle2, Calendar, Clock, DollarSign, Wallet,
} from "lucide-react";
import type { User } from "@shared/schema";

const FANTASY_BUDGET = 100;

function calcPlayerPrice(skillRating: number): number {
  const sr = Math.max(0, skillRating || 0);
  return Math.max(5, Math.min(40, Math.round(5 + (sr / 3000) * 35)));
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Round = {
  id: number; name: string; status: string;
  start_date: string; end_date: string; created_at: string;
};
type Pick = {
  id: number; team_id: number; picked_user_id: string; points: number; price: number;
  nickname?: string; first_name?: string; last_name?: string;
  profile_image_url?: string; steam_id_64?: string;
};
type TeamData = { team: { id: number; total_points: number; budget_used: number }; picks: Pick[] };
type FantasyPlayer = {
  id: string; nickname?: string; first_name?: string; last_name?: string;
  profile_image_url?: string; skill_rating: number; price: number;
  total_matches: number;
  avg_kills: number; avg_deaths: number; avg_assists: number;
  avg_damage: number; kd_ratio: number; hs_pct: number;
};
type RankingEntry = {
  id: number; total_points: number; user_id: string;
  nickname?: string; first_name?: string; last_name?: string;
  profile_image_url?: string; playerCount: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function displayName(p: { nickname?: string | null; first_name?: string | null; last_name?: string | null }) {
  return p.nickname || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Jogador";
}

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

// Remove acentos e normaliza para busca
function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Busca fuzzy: todos os tokens da query devem aparecer em algum lugar no nome
function fuzzyMatch(name: string, query: string): boolean {
  if (!query) return true;
  const n = normalize(name);
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  return tokens.every(token => n.includes(token));
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  open: { label: "Aberta", color: "text-green-400" },
  calculating: { label: "Calculando...", color: "text-yellow-400" },
  finished: { label: "Encerrada", color: "text-muted-foreground" },
};

// ─── Scoring rules ────────────────────────────────────────────────────────────
const RULES = [
  { icon: Swords, label: "Kill", pts: "+1.0", color: "text-green-400" },
  { icon: Target, label: "Assistência", pts: "+0.3", color: "text-green-400" },
  { icon: Shield, label: "Morte", pts: "-0.5", color: "text-red-400" },
  { icon: Zap, label: "Headshot", pts: "+0.15", color: "text-green-400" },
  { icon: Star, label: "ACE (5K)", pts: "+10", color: "text-orange-400" },
  { icon: Star, label: "4K", pts: "+5", color: "text-orange-400" },
  { icon: Star, label: "3K", pts: "+3", color: "text-orange-400" },
  { icon: Star, label: "Double Kill", pts: "+1", color: "text-orange-400" },
  { icon: Trophy, label: "Clutch 1v1", pts: "+5", color: "text-yellow-400" },
  { icon: Trophy, label: "Clutch 1v2", pts: "+8", color: "text-yellow-400" },
  { icon: TrendingUp, label: "First Kill", pts: "+1.5", color: "text-blue-400" },
  { icon: Medal, label: "MVP da partida", pts: "+4", color: "text-yellow-400" },
  { icon: CheckCircle2, label: "Vitória", pts: "+3", color: "text-green-400" },
];

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ rounds, onRefresh }: { rounds: Round[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creating, setCreating] = useState(false);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/fantasy/rounds", { name, startDate, endDate }),
    onSuccess: () => {
      toast({ title: "Rodada criada!" });
      setName(""); setStartDate(""); setEndDate("");
      setCreating(false);
      onRefresh();
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const calcMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/fantasy/rounds/${id}/calculate`, {}),
    onSuccess: () => { toast({ title: "Pontuação calculada!" }); onRefresh(); },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/fantasy/rounds/${id}`),
    onSuccess: () => { toast({ title: "Rodada removida." }); onRefresh(); },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-orange-400">
          <Shield className="w-4 h-4" /> Painel Admin — Fantasy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!creating ? (
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setCreating(true)}
            data-testid="button-create-round">
            <PlusCircle className="w-4 h-4" /> Nova Rodada
          </Button>
        ) : (
          <div className="space-y-3 p-3 rounded-md bg-muted/40">
            <Label className="text-xs">Nome da Rodada</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Rodada 1 — Abril" />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Início</Label>
                <Input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fim</Label>
                <Input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !name || !startDate || !endDate}>
                {createMutation.isPending ? "Criando..." : "Criar"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {rounds.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Rodadas</p>
            {rounds.map(r => (
              <div key={r.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className={`text-xs ${STATUS_LABEL[r.status]?.color}`}>{STATUS_LABEL[r.status]?.label}</p>
                </div>
                {r.status === "open" && (
                  <Button size="sm" variant="outline" className="gap-1 shrink-0"
                    onClick={() => calcMutation.mutate(r.id)} disabled={calcMutation.isPending}
                    data-testid={`button-calculate-${r.id}`}>
                    <Calculator className="w-3 h-3" />
                    Calcular
                  </Button>
                )}
                <Button size="icon" variant="ghost"
                  onClick={() => deleteMutation.mutate(r.id)} disabled={deleteMutation.isPending}
                  data-testid={`button-delete-round-${r.id}`}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Tier badge helper ────────────────────────────────────────────────────────
function PriceTierBadge({ price }: { price: number }) {
  let label: string, cls: string;
  if (price >= 35) { label = "Elite"; cls = "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"; }
  else if (price >= 25) { label = "Alto"; cls = "bg-orange-500/20 text-orange-400 border-orange-500/40"; }
  else if (price >= 15) { label = "Médio"; cls = "bg-blue-500/20 text-blue-400 border-blue-500/40"; }
  else { label = "Baixo"; cls = "bg-muted text-muted-foreground border-border"; }
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${cls}`}>{label}</span>
  );
}

// ─── Player selection dialog ──────────────────────────────────────────────────
function PlayerPickerDialog({
  selected, onConfirm, disabled,
}: { selected: string[]; onConfirm: (ids: string[]) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [picks, setPicks] = useState<string[]>(selected);

  const { data: playersData } = useQuery<{ players: FantasyPlayer[]; budget: number }>({
    queryKey: ["/api/fantasy/players"],
    queryFn: () => fetch("/api/fantasy/players", { credentials: "include" }).then(r => r.json()),
  });

  const allPlayers = playersData?.players ?? [];

  const filtered = allPlayers
    .filter(p => {
      if (!search) return true;
      const fullName = displayName(p);
      // Fuzzy match: busca nos campos nome, nickname, first_name
      return (
        fuzzyMatch(fullName, search) ||
        fuzzyMatch(p.nickname || "", search) ||
        fuzzyMatch(p.first_name || "", search)
      );
    })
    .sort((a, b) => displayName(a).localeCompare(displayName(b), "pt-BR", { sensitivity: "base" }));

  const priceMap = Object.fromEntries(allPlayers.map(p => [p.id, p.price]));
  const totalCost = picks.reduce((sum, id) => sum + (priceMap[id] ?? 0), 0);
  const remaining = FANTASY_BUDGET - totalCost;
  const budgetPct = Math.min(100, (totalCost / FANTASY_BUDGET) * 100);
  const overBudget = totalCost > FANTASY_BUDGET;

  function toggle(id: string) {
    const price = priceMap[id] ?? 0;
    setPicks(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) return prev;
      if (totalCost + price > FANTASY_BUDGET) return prev; // budget guard
      return [...prev, id];
    });
  }

  function handleOpen(o: boolean) {
    if (o) setPicks(selected);
    setOpen(o);
  }

  function handleConfirm() {
    onConfirm(picks);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2" data-testid="button-open-picker">
          <Users className="w-4 h-4" />
          {selected.length > 0 ? "Alterar Escalação" : "Montar Escalação"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Escale até 5 jogadores
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">

          {/* Budget bar */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <Wallet className="w-4 h-4 text-primary" />
                Orçamento
              </span>
              <span className={`font-bold tabular-nums ${overBudget ? "text-destructive" : remaining <= 10 ? "text-yellow-400" : "text-green-400"}`}>
                R${totalCost} / R${FANTASY_BUDGET}
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${overBudget ? "bg-destructive" : budgetPct > 80 ? "bg-yellow-500" : "bg-primary"}`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{picks.length}/5 jogadores</span>
              <span>{remaining >= 0 ? `R$${remaining} disponível` : `R${Math.abs(remaining)} acima do limite`}</span>
            </div>
          </div>

          <Input placeholder="Buscar jogador..." value={search}
            onChange={e => setSearch(e.target.value)} data-testid="input-search-player" />

          <div className="max-h-80 overflow-y-auto space-y-1">
            {filtered.map(p => {
              const name = displayName(p);
              const isSelected = picks.includes(p.id);
              const wouldExceed = !isSelected && (totalCost + p.price > FANTASY_BUDGET);
              const atMax = !isSelected && picks.length >= 5;
              const isDisabled = wouldExceed || atMax;
              const hasMatches = (p.total_matches || 0) > 0;
              return (
                <button key={p.id} onClick={() => !isDisabled && toggle(p.id)}
                  data-testid={`pick-player-${p.id}`}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-md text-left transition-colors
                    ${isSelected ? "bg-primary/20 border border-primary/40" : "hover:bg-muted/60"}
                    ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}>
                  <Avatar className="w-9 h-9 shrink-0 mt-0.5">
                    <AvatarImage src={p.profile_image_url || undefined} />
                    <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate leading-tight">{name}</p>
                    {hasMatches ? (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          <span className="text-foreground/70 font-medium">SR</span> {p.skill_rating}
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          <span className="text-foreground/70 font-medium">K/D</span> {p.kd_ratio.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          <span className="text-foreground/70 font-medium">Kills</span> {p.avg_kills}
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          <span className="text-foreground/70 font-medium">HS%</span> {p.hs_pct.toFixed(1)}%
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          <span className="text-foreground/70 font-medium">ADR</span> {p.avg_damage}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground mt-0.5">SR {p.skill_rating} · sem partidas</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-sm font-bold tabular-nums ${isSelected ? "text-primary" : "text-foreground"}`}>
                      R${p.price}
                    </span>
                    <PriceTierBadge price={p.price} />
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                    {wouldExceed && !isSelected && (
                      <span className="text-[10px] text-destructive font-medium">sem saldo</span>
                    )}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">Nenhum jogador encontrado.</p>
            )}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleConfirm}
              disabled={picks.length === 0 || overBudget} data-testid="button-confirm-picks">
              Confirmar — R${totalCost} ({picks.length} jogador{picks.length !== 1 ? "es" : ""})
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Ranking Tab ──────────────────────────────────────────────────────────────
function RankingTab({ roundId, myUserId }: { roundId: number; myUserId: string }) {
  const { data: ranking = [], isLoading } = useQuery<RankingEntry[]>({
    queryKey: ["/api/fantasy/ranking", roundId],
    queryFn: () => fetch(`/api/fantasy/ranking/${roundId}`, { credentials: "include" }).then(r => r.json()),
  });

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  if (!ranking.length) return (
    <div className="text-center py-10 text-muted-foreground space-y-2">
      <Trophy className="w-10 h-10 mx-auto opacity-30" />
      <p>Nenhuma escalação ainda.</p>
    </div>
  );

  const medalIcon = (pos: number) => {
    if (pos === 0) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (pos === 1) return <Medal className="w-4 h-4 text-slate-300" />;
    if (pos === 2) return <Medal className="w-4 h-4 text-orange-600" />;
    return <span className="text-xs text-muted-foreground w-4 text-center">{pos + 1}</span>;
  };

  return (
    <div className="space-y-2">
      {ranking.map((entry, i) => {
        const name = displayName(entry as any);
        const isMe = entry.user_id === myUserId;
        return (
          <div key={entry.id}
            className={`flex items-center gap-3 p-3 rounded-md ${isMe ? "bg-primary/10 border border-primary/30" : "bg-muted/30"}`}>
            <div className="w-5 flex items-center justify-center shrink-0">{medalIcon(i)}</div>
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarImage src={(entry as any).profile_image_url || undefined} />
              <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {name} {isMe && <span className="text-xs text-primary">(você)</span>}
              </p>
              <p className="text-xs text-muted-foreground">{entry.playerCount} jogador{entry.playerCount !== 1 ? "es" : ""}</p>
            </div>
            <p className="text-base font-bold text-primary shrink-0">{entry.total_points.toFixed(1)} pts</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function JogatinaFantasy() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("escalacao");

  const { data: rounds = [], refetch: refetchRounds } = useQuery<Round[]>({
    queryKey: ["/api/fantasy/rounds"],
  });

  const { data: activeRound, isLoading: roundLoading } = useQuery<Round | null>({
    queryKey: ["/api/fantasy/rounds/active"],
    queryFn: () => fetch("/api/fantasy/rounds/active", { credentials: "include" }).then(r => r.json()),
  });

  const { data: myTeam, isLoading: teamLoading, refetch: refetchTeam } = useQuery<TeamData | null>({
    queryKey: ["/api/fantasy/my-team", activeRound?.id],
    queryFn: () => activeRound
      ? fetch(`/api/fantasy/my-team/${activeRound.id}`, { credentials: "include" }).then(r => r.json())
      : Promise.resolve(null),
    enabled: !!activeRound,
  });

  const saveMutation = useMutation({
    mutationFn: (playerIds: string[]) =>
      apiRequest("POST", "/api/fantasy/teams", { roundId: activeRound?.id, playerIds }),
    onSuccess: () => {
      toast({ title: "Escalação salva!" });
      refetchTeam();
      queryClient.invalidateQueries({ queryKey: ["/api/fantasy/ranking", activeRound?.id] });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const isAdmin = (user as any)?.isAdmin;
  const myUserId = (user as any)?.id || "";
  const picks = myTeam?.picks || [];
  const pickedIds = picks.map(p => p.picked_user_id);

  const statusInfo = activeRound ? STATUS_LABEL[activeRound.status] : null;
  const isOpen = activeRound?.status === "open";

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-primary/20 shrink-0">
          <Trophy className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">Inimigos da Bala Fantasy</h1>
          <p className="text-muted-foreground text-sm">
            Escale até 5 jogadores com orçamento de <span className="text-primary font-semibold">R${FANTASY_BUDGET}</span>. Jogadores mais fortes custam mais caro — gerencie bem o budget!
          </p>
        </div>
      </div>

      {/* Admin panel */}
      {isAdmin && (
        <AdminPanel rounds={rounds} onRefresh={() => { refetchRounds(); queryClient.invalidateQueries({ queryKey: ["/api/fantasy/rounds/active"] }); }} />
      )}

      {/* Active round banner */}
      {roundLoading ? (
        <div className="h-16 rounded-lg bg-muted/30 animate-pulse" />
      ) : activeRound ? (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">{activeRound.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(activeRound.start_date).toLocaleDateString("pt-BR")}
                  </span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(activeRound.end_date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              {statusInfo && (
                <Badge variant="secondary" className={statusInfo.color}>{statusInfo.label}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center space-y-2">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-sm">
              {isAdmin ? "Nenhuma rodada aberta. Crie uma no painel acima." : "Nenhuma rodada aberta no momento."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs — only shown when there's an active round */}
      {activeRound && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="escalacao" className="flex-1" data-testid="tab-escalacao">Minha Escalação</TabsTrigger>
            <TabsTrigger value="pontuacao" className="flex-1" data-testid="tab-pontuacao">Pontuação</TabsTrigger>
            <TabsTrigger value="ranking" className="flex-1" data-testid="tab-ranking">Ranking</TabsTrigger>
          </TabsList>

          {/* ─── Minha Escalação ─────────────────────────────────────────────── */}
          <TabsContent value="escalacao" className="space-y-4 mt-4">
            {/* My picks */}
            {teamLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-md bg-muted/30 animate-pulse" />)}
              </div>
            ) : picks.length > 0 ? (
              <div className="space-y-2">
                {/* Budget summary */}
                {myTeam && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 text-sm mb-1">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Wallet className="w-3.5 h-3.5" />
                      Orçamento usado
                    </span>
                    <span className="font-bold text-primary">
                      R${myTeam.team.budget_used} / R${FANTASY_BUDGET}
                    </span>
                  </div>
                )}
                {picks.map(pick => {
                  const name = displayName(pick as any);
                  return (
                    <div key={pick.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/30"
                      data-testid={`pick-row-${pick.picked_user_id}`}>
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={pick.profile_image_url || undefined} />
                        <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{name}</p>
                        {activeRound.status !== "open" ? (
                          <p className="text-xs text-muted-foreground">{pick.points.toFixed(1)} pts</p>
                        ) : (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> R${pick.price ?? 0}
                          </p>
                        )}
                      </div>
                      {activeRound.status !== "open"
                        ? <span className="text-sm font-bold text-primary shrink-0">{pick.points.toFixed(1)} pts</span>
                        : <PriceTierBadge price={pick.price ?? 0} />
                      }
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Users className="w-10 h-10 mx-auto text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-sm">
                  {isOpen ? "Você ainda não escalou nenhum jogador." : "Você não escalou nenhum jogador nesta rodada."}
                </p>
              </div>
            )}

            {/* Action */}
            {isOpen && (
              <PlayerPickerDialog
                selected={pickedIds}
                disabled={saveMutation.isPending}
                onConfirm={(ids) => saveMutation.mutate(ids)}
              />
            )}
            {!isOpen && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {activeRound.status === "finished" ? "Rodada encerrada — escalação bloqueada." : "Escalação bloqueada durante o cálculo."}
              </p>
            )}
          </TabsContent>

          {/* ─── Pontuação ───────────────────────────────────────────────────── */}
          <TabsContent value="pontuacao" className="space-y-4 mt-4">
            {/* My score */}
            {picks.length > 0 && activeRound.status !== "open" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" /> Minha pontuação total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    {(myTeam?.team?.total_points || 0).toFixed(1)} <span className="text-base text-muted-foreground font-normal">pts</span>
                  </p>
                  <div className="mt-3 space-y-1">
                    {picks.map(pick => (
                      <div key={pick.id} className="flex justify-between text-sm py-0.5">
                        <span className="text-muted-foreground">{displayName(pick as any)}</span>
                        <span className="font-mono font-semibold">{pick.points.toFixed(1)} pts</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {picks.length > 0 && activeRound.status === "open" && (
              <div className="p-4 rounded-md bg-muted/30 text-center text-sm text-muted-foreground">
                <Clock className="w-5 h-5 mx-auto mb-1.5 opacity-50" />
                A pontuação será calculada pelo admin ao fechar a rodada.
              </div>
            )}

            {/* Budget / pricing tiers info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Sistema de Orçamento
                </CardTitle>
                <CardDescription className="text-xs">Você tem R${FANTASY_BUDGET} para montar seu time de 5 jogadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { tier: "Elite", range: "SR acima de ~2570", price: "R$35–40", cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
                    { tier: "Alto",  range: "SR acima de ~1710", price: "R$25–34", cls: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
                    { tier: "Médio", range: "SR acima de ~855",  price: "R$15–24", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
                    { tier: "Baixo", range: "SR até ~855",       price: "R$5–14",  cls: "bg-muted text-muted-foreground border-border" },
                  ].map(t => (
                    <div key={t.tier} className={`p-2 rounded border ${t.cls}`}>
                      <p className="font-bold">{t.tier} — {t.price}</p>
                      <p className="opacity-80">{t.range}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Preço calculado pelo Skill Rating (SR) de cada jogador. Quanto melhor o SR, mais caro.
                  Com R${FANTASY_BUDGET}, é impossível escalar os 5 melhores do servidor.
                </p>
              </CardContent>
            </Card>

            {/* Scoring rules */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" /> Como funciona a pontuação
                </CardTitle>
                <CardDescription className="text-xs">Baseado no desempenho nos mix e campeonatos da rodada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-1.5">
                  {RULES.map(r => (
                    <div key={r.label} className="flex items-center justify-between gap-2 text-sm py-0.5">
                      <div className="flex items-center gap-2">
                        <r.icon className={`w-3.5 h-3.5 shrink-0 ${r.color}`} />
                        <span className="text-muted-foreground">{r.label}</span>
                      </div>
                      <span className={`font-mono font-bold ${r.color}`}>{r.pts}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Ranking ─────────────────────────────────────────────────────── */}
          <TabsContent value="ranking" className="mt-4">
            <RankingTab roundId={activeRound.id} myUserId={myUserId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
