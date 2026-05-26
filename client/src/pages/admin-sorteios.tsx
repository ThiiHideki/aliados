import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dice5, Sparkles, Trophy, Users, Calendar, ShieldCheck,
  ChevronDown, ChevronRight, BellRing, RefreshCw, Hash, Gift,
} from "lucide-react";
import type { Raffle, RaffleEligibleEntry } from "@shared/schema";

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function userInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

interface EligibleResponse {
  year: number;
  month: number;
  minMatches: number;
  eligible: RaffleEligibleEntry[];
}

export default function AdminSorteios() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const now = new Date();
  const [title, setTitle] = useState(`Sorteio de ${MONTHS_PT[now.getMonth()]}`);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [minMatches, setMinMatches] = useState(3);

  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<Raffle | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const spinTimerRef = useRef<number[]>([]);

  const eligibleQuery = useQuery<EligibleResponse>({
    queryKey: ["/api/admin/raffles/eligible", year, month, minMatches],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/raffles/eligible?year=${year}&month=${month}&minMatches=${minMatches}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Erro ao carregar elegíveis");
      return res.json();
    },
    enabled: !!user?.isAdmin,
  });

  const historyQuery = useQuery<Raffle[]>({
    queryKey: ["/api/admin/raffles"],
    enabled: !!user?.isAdmin,
  });

  const drawMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/raffles", {
        title, year, month, minMatches,
      });
      return (await res.json()) as Raffle;
    },
    onSuccess: (raffle) => {
      const snapshot = (raffle.eligibleSnapshot as RaffleEligibleEntry[]) || [];
      runRouletteAnimation(snapshot, raffle.winnerIndex, raffle);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/raffles"] });
    },
    onError: (err: any) => {
      toast({ title: "Erro ao sortear", description: err?.message || "Tente novamente", variant: "destructive" });
    },
  });

  const notifyMutation = useMutation({
    mutationFn: async (raffleId: string) => {
      const res = await apiRequest("POST", `/api/admin/raffles/${raffleId}/notify`, {});
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Vencedor avisado!",
        description: `Push enviado: ${data?.push?.sent ?? 0}/${data?.push?.total ?? 0}. O vencedor verá um aviso ao abrir o site.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/raffles"] });
    },
    onError: (err: any) => {
      toast({ title: "Erro ao avisar", description: err?.message || "Tente novamente", variant: "destructive" });
    },
  });

  function clearSpinTimers() {
    spinTimerRef.current.forEach((id) => window.clearTimeout(id));
    spinTimerRef.current = [];
  }

  function runRouletteAnimation(list: RaffleEligibleEntry[], winnerIndex: number, raffle: Raffle) {
    clearSpinTimers();
    setSpinning(true);
    setSpinResult(null);
    const n = list.length;
    if (n === 0) return;
    const totalDuration = 4500;
    const initialInterval = 60;
    const finalInterval = 400;
    let elapsed = 0;
    let current = Math.floor(Math.random() * n);
    setHighlightIndex(current);

    const tick = () => {
      const progress = Math.min(1, elapsed / totalDuration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const interval = initialInterval + (finalInterval - initialInterval) * eased;
      if (progress >= 1) {
        setHighlightIndex(winnerIndex);
        setSpinning(false);
        setSpinResult(raffle);
        return;
      }
      current = (current + 1) % n;
      setHighlightIndex(current);
      elapsed += interval;
      const id = window.setTimeout(tick, interval);
      spinTimerRef.current.push(id);
    };
    const id = window.setTimeout(tick, initialInterval);
    spinTimerRef.current.push(id);
  }

  useEffect(() => () => clearSpinTimers(), []);

  // IMPORTANT: keep this list in the SAME order returned by the server (sorted by userId asc),
  // because the draw uses this exact order. The roulette animation indexes into it,
  // so it must match `eligibleSnapshot` of the resulting raffle.
  const eligible = eligibleQuery.data?.eligible ?? [];
  // For visual browsing only (separate "Jogadores Elegíveis" list)
  const eligibleByName = useMemo(
    () => [...eligible].sort((a, b) => a.nickname.localeCompare(b.nickname, "pt-BR", { sensitivity: "base" })),
    [eligible],
  );

  if (authLoading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>;
  }
  if (!user?.isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso restrito</CardTitle>
            <CardDescription>Esta página é apenas para administradores.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const winnerFromSpin = spinResult ? (spinResult.eligibleSnapshot as RaffleEligibleEntry[])[spinResult.winnerIndex] : null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto" data-testid="page-admin-sorteios">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="h-12 w-12 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Gift className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Sorteios</h1>
          <p className="text-sm text-muted-foreground">
            Sorteie um jogador entre os elegíveis do mês. Cada sorteio é auditável.
          </p>
        </div>
      </div>

      <Tabs defaultValue="sortear">
        <TabsList>
          <TabsTrigger value="sortear" data-testid="tab-sortear">
            <Dice5 className="h-4 w-4 mr-2" />
            Sortear
          </TabsTrigger>
          <TabsTrigger value="auditoria" data-testid="tab-auditoria">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Auditoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sortear" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Configurar Sorteio
              </CardTitle>
              <CardDescription>
                Defina o mês de referência e quantas partidas mínimas o jogador precisa ter para ser elegível.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="raffle-title">Título</Label>
                  <Input
                    id="raffle-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sorteio de Maio - AWP Crakow"
                    data-testid="input-raffle-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mês</Label>
                  <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                    <SelectTrigger data-testid="select-raffle-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS_PT.map((m, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raffle-year">Ano</Label>
                  <Input
                    id="raffle-year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    data-testid="input-raffle-year"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raffle-min">Partidas mínimas</Label>
                  <Input
                    id="raffle-min"
                    type="number"
                    min={1}
                    value={minMatches}
                    onChange={(e) => setMinMatches(Math.max(1, Number(e.target.value)))}
                    data-testid="input-raffle-min"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {MONTHS_PT[month - 1]}/{year}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {eligible.length} elegíveis
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => eligibleQuery.refetch()}
                  disabled={eligibleQuery.isFetching}
                  data-testid="button-refresh-eligible"
                  className="ml-auto"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${eligibleQuery.isFetching ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Jogadores Elegíveis ({eligible.length})
              </CardTitle>
              <CardDescription>
                Jogadores com pelo menos {minMatches} partida{minMatches > 1 ? "s" : ""} em {MONTHS_PT[month - 1]}/{year}.
                Banidos e marcados como cheaters não entram.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eligibleQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando elegíveis...</p>
              ) : eligible.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum jogador atinge o mínimo de partidas neste mês.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                  {eligibleByName.map((p) => (
                    <div
                      key={p.userId}
                      className="flex items-center gap-2 p-2 rounded-md border bg-muted/30"
                      data-testid={`eligible-${p.userId}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={p.profileImageUrl ?? undefined} />
                        <AvatarFallback className="text-xs">{userInitials(p.nickname)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{p.nickname}</p>
                        <p className="text-[10px] text-muted-foreground">{p.matchesPlayed} partidas</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dice5 className="h-5 w-5 text-primary" />
                Roleta
              </CardTitle>
              <CardDescription>
                Clique em "Sortear" — a roleta gira e revela o vencedor. O sorteio é gravado para auditoria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RouletteStrip
                items={spinResult ? (spinResult.eligibleSnapshot as RaffleEligibleEntry[]) : eligible}
                highlightIndex={highlightIndex}
              />

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="lg"
                  onClick={() => drawMutation.mutate()}
                  disabled={spinning || drawMutation.isPending || eligible.length === 0 || !title.trim()}
                  data-testid="button-spin-raffle"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {drawMutation.isPending ? "Sorteando..." : spinning ? "Girando..." : "Sortear"}
                </Button>
                {spinResult && winnerFromSpin && !spinning && (
                  <Button
                    size="lg"
                    variant="default"
                    onClick={() => notifyMutation.mutate(spinResult.id)}
                    disabled={notifyMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-notify-winner"
                  >
                    <BellRing className="h-5 w-5 mr-2" />
                    {notifyMutation.isPending ? "Enviando..." : "Avisar Sorteado"}
                  </Button>
                )}
              </div>

              {spinResult && winnerFromSpin && !spinning && (
                <div className="p-4 rounded-md border-2 border-primary bg-primary/10 flex items-center gap-3 flex-wrap" data-testid="result-winner">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={winnerFromSpin.profileImageUrl ?? undefined} />
                    <AvatarFallback>{userInitials(winnerFromSpin.nickname)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Vencedor</p>
                    <p className="text-xl font-bold">{winnerFromSpin.nickname}</p>
                    <p className="text-xs text-muted-foreground">
                      Posição {spinResult.winnerIndex + 1} de {(spinResult.eligibleSnapshot as RaffleEligibleEntry[]).length}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auditoria" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Histórico e Auditoria
              </CardTitle>
              <CardDescription>
                Cada sorteio guarda a lista exata de elegíveis, a semente aleatória e o valor derivado. Qualquer pessoa pode recalcular e verificar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {historyQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando histórico...</p>
              ) : (historyQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum sorteio realizado ainda.</p>
              ) : (
                (historyQuery.data ?? []).map((r) => (
                  <RaffleAuditCard key={r.id} raffle={r} onNotify={() => notifyMutation.mutate(r.id)} notifying={notifyMutation.isPending} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RouletteStrip({ items, highlightIndex }: { items: RaffleEligibleEntry[]; highlightIndex: number | null }) {
  if (items.length === 0) {
    return (
      <div className="h-24 rounded-md border-2 border-dashed flex items-center justify-center text-sm text-muted-foreground">
        Sem jogadores elegíveis.
      </div>
    );
  }
  return (
    <div className="rounded-md border-2 border-primary/30 bg-background/60 p-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {items.map((p, i) => {
          const active = i === highlightIndex;
          return (
            <div
              key={p.userId}
              className={`flex items-center gap-2 px-2 py-1 rounded-md border transition-all duration-100 ${
                active
                  ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg"
                  : "bg-muted/40 border-transparent"
              }`}
              data-testid={`roulette-item-${p.userId}`}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={p.profileImageUrl ?? undefined} />
                <AvatarFallback className="text-[10px]">{userInitials(p.nickname)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium truncate max-w-[120px]">{p.nickname}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RaffleAuditCard({ raffle, onNotify, notifying }: { raffle: Raffle; onNotify: () => void; notifying: boolean }) {
  const [open, setOpen] = useState(false);
  const snapshot = (raffle.eligibleSnapshot as RaffleEligibleEntry[]) || [];
  const created = new Date(raffle.createdAt);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-md border bg-card" data-testid={`audit-${raffle.id}`}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full p-3 text-left flex items-center gap-3 flex-wrap hover-elevate"
          >
            {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <Trophy className="h-4 w-4 text-yellow-500" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{raffle.title}</p>
              <p className="text-xs text-muted-foreground">
                {MONTHS_PT[raffle.month - 1]}/{raffle.year} · mín {raffle.minMatches} partidas · {snapshot.length} elegíveis
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Vencedor</p>
              <p className="font-bold text-sm">{raffle.winnerNickname}</p>
            </div>
            <Badge variant={raffle.notifiedAt ? "default" : "outline"} className="ml-1">
              {raffle.notifiedAt ? "Avisado" : "Não avisado"}
            </Badge>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground">Realizado em</p>
                <p className="font-mono">{created.toLocaleString("pt-BR")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Índice do vencedor (0-based)</p>
                <p className="font-mono">{raffle.winnerIndex} de {snapshot.length}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> Semente (SHA-256 será computado em cima dela)</p>
                <p className="font-mono break-all text-[11px] bg-muted/40 p-2 rounded">{raffle.seed}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-muted-foreground">Valor aleatório normalizado (0..1)</p>
                <p className="font-mono text-[11px]">{raffle.randomValue}</p>
                <p className="text-[10px] text-muted-foreground">
                  Fórmula (a lista abaixo está ordenada por userId crescente): SHA-256(semente) →
                  primeiros 6 bytes interpretados como inteiro sem sinal (big-endian) ÷ 2^48 →
                  valor × {snapshot.length} → piso = {raffle.winnerIndex}.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-semibold mb-2">Lista ordenada de elegíveis (ordem usada no sorteio)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 max-h-64 overflow-y-auto">
                {snapshot.map((p, i) => (
                  <div
                    key={p.userId}
                    className={`flex items-center justify-between gap-2 text-xs p-1.5 rounded ${
                      i === raffle.winnerIndex ? "bg-primary/15 border border-primary" : "bg-muted/30"
                    }`}
                  >
                    <span className="truncate">
                      <span className="text-muted-foreground font-mono mr-1">{i}.</span>
                      {p.nickname}
                    </span>
                    <span className="text-muted-foreground">{p.matchesPlayed}p</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant={raffle.notifiedAt ? "outline" : "default"}
                onClick={onNotify}
                disabled={notifying}
                data-testid={`button-audit-notify-${raffle.id}`}
              >
                <BellRing className="h-4 w-4 mr-2" />
                {raffle.notifiedAt ? "Reavisar vencedor" : "Avisar sorteado"}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
