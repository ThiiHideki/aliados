import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import {
  Users, Clock, UserPlus, UserMinus, AlertTriangle,
  ChevronLeft, ChevronRight, CalendarDays, Shield, Swords,
  ShieldAlert, CheckCircle, Ban, X, Bell, BellOff, BellRing, Smartphone,
  Server, Copy
} from "lucide-react";
import { SERVER_IP, SERVER_CONNECT_URL, SERVER_CONSOLE_COMMAND } from "@/lib/mix-server";
import { SiDiscord } from "react-icons/si";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { User as UserType, MixAvailability } from "@shared/schema";

type MixEntry = MixAvailability & { user: UserType };

function getTodayDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0];
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = getTodayDate();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === today) return "Hoje";
  if (dateStr === tomorrowStr) return "Amanhã";

  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function ConnectServerPanel() {
  const { toast } = useToast();
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2" data-testid="panel-connect-server">
      <div className="flex items-center gap-2 text-sm">
        <Server className="h-4 w-4 text-primary" />
        <span className="font-medium">Conectar no servidor</span>
        <span className="text-xs text-muted-foreground font-mono ml-auto">{SERVER_IP}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button asChild className="flex-1 min-w-[160px]" data-testid="button-connect-server-list">
          <a href={SERVER_CONNECT_URL}>
            <Server className="h-4 w-4 mr-2" />
            Conectar no Jogo
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(SERVER_CONSOLE_COMMAND);
              toast({ title: "Comando copiado!", description: "Cole no console do CS2 (tecla ~)." });
            } catch {
              toast({
                title: "Não foi possível copiar",
                description: SERVER_CONSOLE_COMMAND,
                variant: "destructive",
              });
            }
          }}
          data-testid="button-copy-connect-list"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Se o botão não abrir o jogo, copie e cole no console (tecla <span className="font-mono">~</span>).
      </p>
    </div>
  );
}

export default function MixDisponibilidade() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [confirmMode, setConfirmMode] = useState(false);
  const [confirmedPlayerIds, setConfirmedPlayerIds] = useState<Set<string>>(new Set());
  const [adminAddUserId, setAdminAddUserId] = useState<string>("");
  const [adminAddAsSub, setAdminAddAsSub] = useState(false);
  const today = getTodayDate();
  const initialDate = today;

  const { data: selectedDate, refetch: refetchDate } = useQuery<string>({
    queryKey: ['mix-list-date'],
    queryFn: () => initialDate,
    staleTime: Infinity,
    initialData: initialDate,
  });

  const currentDate = selectedDate || today;

  const { data: mixList = [], isLoading } = useQuery<MixEntry[]>({
    queryKey: ['/api/mix/availability', currentDate],
    queryFn: async () => {
      const res = await fetch(`/api/mix/availability/${currentDate}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const { data: penaltyData } = useQuery<{ count: number; forcedSub: boolean; suspended: boolean }>({
    queryKey: ['/api/mix/penalties', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/mix/penalties/${user?.id}`, { credentials: 'include' });
      if (!res.ok) return { count: 0, forcedSub: false, suspended: false };
      return res.json();
    },
    enabled: !!user?.id,
  });

  const joinMutation = useMutation({
    mutationFn: async (isSub: boolean) => {
      return apiRequest('POST', '/api/mix/availability/join', { listDate: currentDate, isSub });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mix/availability', currentDate] });
      if (data.forcedSub) {
        toast({ title: "Adicionado como Suplente", description: "Devido a faltas anteriores, você só pode entrar como suplente.", variant: "destructive" });
      } else {
        toast({ title: "Adicionado na lista!", description: "Você está na lista do mix." });
      }
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Não foi possível entrar na lista", variant: "destructive" });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/mix/confirm-played', {
        listDate: currentDate,
        playedUserIds: Array.from(confirmedPlayerIds),
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mix/penalties'] });
      setConfirmMode(false);
      setConfirmedPlayerIds(new Set());
      toast({
        title: "Lista confirmada!",
        description: `${data.noShowCount} jogador(es) penalizado(s) por falta.`,
      });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Não foi possível confirmar a lista", variant: "destructive" });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/mix/availability/leave', { listDate: currentDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mix/availability', currentDate] });
      toast({ title: "Removido da lista", description: "Você saiu da lista do mix." });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Não foi possível sair da lista", variant: "destructive" });
    },
  });

  const adminRemoveMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      return apiRequest('POST', '/api/mix/availability/admin-remove', { listDate: currentDate, userId: targetUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mix/availability', currentDate] });
      toast({ title: "Jogador removido", description: "Jogador removido da lista sem penalidade." });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Não foi possível remover o jogador", variant: "destructive" });
    },
  });

  const { data: allUsers = [] } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
    enabled: !!user?.isAdmin,
  });

  const adminAddMutation = useMutation({
    mutationFn: async ({ userId, isSub }: { userId: string; isSub: boolean }) => {
      return apiRequest('POST', '/api/mix/availability/admin-add', { listDate: currentDate, userId, isSub });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mix/availability', currentDate] });
      setAdminAddUserId("");
      setAdminAddAsSub(false);
      toast({ title: "Jogador adicionado", description: "Jogador adicionado na lista pelo admin." });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Não foi possível adicionar o jogador", variant: "destructive" });
    },
  });

  const push = usePushNotifications();

  const pushNotifyMutation = useMutation({
    mutationFn: async () =>
      apiRequest('POST', '/api/mix/push-notify', {}),
    onSuccess: async (res: any) => {
      const data = await res.json().catch(() => ({} as any));
      toast({
        title: "Push enviado!",
        description: `Notificação enviada para ${data.sent ?? 0} dispositivo(s)${data.failed ? ` (${data.failed} falha(s))` : ""}.`,
      });
    },
    onError: (error: any) => {
      toast({ title: "Falha ao enviar push", description: error.message || "Erro desconhecido", variant: "destructive" });
    },
  });

  const discordNotifyMutation = useMutation({
    mutationFn: async () =>
      apiRequest('POST', '/api/discord/mix-notify', { date: currentDate }),
    onSuccess: () => {
      toast({ title: "Notificação enviada!", description: "Mensagem enviada no canal do Discord com o botão de entrar no mix." });
    },
    onError: (error: any) => {
      const msg = error.message || "Bot Discord não está conectado";
      const isMissingAccess = msg.toLowerCase().includes("missing access") || msg.toLowerCase().includes("sem acesso");
      toast({
        title: "Falha ao notificar Discord",
        description: isMissingAccess
          ? "O bot não tem acesso ao canal. Adicione o bot ao servidor Discord primeiro (ver página Vincular Discord)."
          : msg,
        variant: "destructive",
      });
    },
  });

  const isInList = mixList.some(e => e.userId === user?.id);
  const isToday = currentDate === today;
  const mainPlayers = mixList.filter(e => !e.isSub).sort((a, b) => a.position - b.position);
  const subPlayers = mixList.filter(e => e.isSub).sort((a, b) => a.position - b.position);

  const navigateDate = (days: number) => {
    const newDate = addDays(currentDate, days);
    queryClient.setQueryData(['mix-list-date'], newDate);
  };

  const getInitials = (u: UserType) => {
    if (u.nickname) return u.nickname.slice(0, 2).toUpperCase();
    if (u.firstName) return u.firstName.slice(0, 2).toUpperCase();
    return "??";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-mix-title">Lista do Mix</h1>
          <p className="text-muted-foreground">
            Disponibilize-se para jogar o mix de hoje
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4" data-testid="date-navigation">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateDate(-1)}
          data-testid="button-prev-date"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold capitalize" data-testid="text-current-date">
            {formatDateLabel(currentDate)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({new Date(currentDate + 'T12:00:00').toLocaleDateString('pt-BR')})
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateDate(1)}
          data-testid="button-next-date"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-primary/20" data-testid="card-mix-header">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Mix 19 horas - Inimigos da Bala
          </CardTitle>
          <CardDescription>
            {mainPlayers.length}/10 jogadores confirmados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {penaltyData && penaltyData.count > 0 && (
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${
              penaltyData.suspended 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`} data-testid="penalty-warning">
              <ShieldAlert className={`h-5 w-5 ${penaltyData.suspended ? 'text-red-500' : 'text-yellow-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {penaltyData.suspended
                    ? `Suspensão ativa! Você tem ${penaltyData.count} falta(s) e está suspenso por 1 lista.`
                    : `Atenção: Você tem ${penaltyData.count} falta(s). Só pode entrar como suplente.`
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {penaltyData.suspended
                    ? "Após 3 faltas, suspensão de 1 lista. Contate um admin para resolver."
                    : "Quem falta sem avisar entra apenas como suplente na próxima."
                  }
                </p>
              </div>
              <Badge variant={penaltyData.suspended ? "destructive" : "secondary"}>
                {penaltyData.count} falta{penaltyData.count > 1 ? "s" : ""}
              </Badge>
            </div>
          )}

          {!isToday ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-muted-foreground/20" data-testid="notice-not-today">
              <CalendarDays className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Você só pode entrar na lista do dia atual. Navegue até <strong>Hoje</strong> para se inscrever.
              </p>
            </div>
          ) : !isInList ? (
            penaltyData?.suspended ? (
              <Button disabled className="w-full" variant="destructive" data-testid="button-suspended">
                <Ban className="h-4 w-4 mr-2" />
                Suspenso desta lista
              </Button>
            ) : penaltyData?.forcedSub ? (
              <div className="space-y-2">
                <Button
                  onClick={() => joinMutation.mutate(true)}
                  disabled={joinMutation.isPending}
                  variant="outline"
                  className="w-full"
                  data-testid="button-join-sub"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Entrar como Suplente (obrigatório por falta anterior)
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => joinMutation.mutate(false)}
                  disabled={joinMutation.isPending}
                  className="flex-1"
                  data-testid="button-join-main"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Entrar como Titular
                </Button>
                <Button
                  onClick={() => joinMutation.mutate(true)}
                  disabled={joinMutation.isPending}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-join-sub"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Entrar como Suplente
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-2">
              <Button
                onClick={() => leaveMutation.mutate()}
                disabled={leaveMutation.isPending}
                variant="destructive"
                className="w-full"
                data-testid="button-leave-list"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Sair da Lista
              </Button>
              <ConnectServerPanel />
            </div>
          )}

          {push.supported && push.status !== "subscribed" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20" data-testid="push-enable-banner">
              <Smartphone className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Receber aviso quando a lista abrir</p>
                <p className="text-xs text-muted-foreground">
                  {push.status === "denied"
                    ? "Notificações bloqueadas. Habilite-as nas configurações do navegador/app."
                    : "Funciona no navegador e no app instalado."}
                </p>
              </div>
              {push.status !== "denied" && (
                <Button
                  size="sm"
                  onClick={() => push.subscribe().then((ok) => {
                    if (ok) toast({ title: "Notificações ativadas!", description: "Você receberá um aviso quando a lista do mix abrir." });
                    else toast({ title: "Não foi possível ativar", description: "Verifique as permissões do navegador.", variant: "destructive" });
                  })}
                  disabled={push.loading}
                  data-testid="button-push-enable"
                >
                  <BellRing className="h-4 w-4 mr-2" />
                  {push.loading ? "Ativando..." : "Ativar"}
                </Button>
              )}
            </div>
          )}

          {push.supported && push.status === "subscribed" && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border" data-testid="push-status-on">
              <BellRing className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground flex-1">Notificações ativas neste dispositivo.</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => push.unsubscribe().then(() => toast({ title: "Notificações desativadas" }))}
                disabled={push.loading}
                data-testid="button-push-disable"
              >
                <BellOff className="h-4 w-4 mr-2" />
                Desativar
              </Button>
            </div>
          )}

          {user?.isAdmin && (
            <div className="border-t pt-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ações Admin</p>
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={() => pushNotifyMutation.mutate()}
                disabled={pushNotifyMutation.isPending}
                data-testid="button-push-mix-notify"
              >
                <BellRing className="h-4 w-4" />
                {pushNotifyMutation.isPending ? "Enviando push..." : "Notificar Lista (Push Web/App)"}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => discordNotifyMutation.mutate()}
                disabled={discordNotifyMutation.isPending}
                data-testid="button-discord-mix-notify"
              >
                <SiDiscord className="h-4 w-4 text-[#5865F2]" />
                {discordNotifyMutation.isPending ? "Enviando..." : "Notificar Mix no Discord"}
              </Button>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-2">Adicionar jogador</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={adminAddUserId} onValueChange={setAdminAddUserId}>
                  <SelectTrigger className="flex-1" data-testid="select-admin-add-player">
                    <SelectValue placeholder="Selecionar jogador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers
                      .filter(u => !mixList.some(e => e.userId === u.id))
                      .sort((a, b) => (a.nickname || a.firstName || "").localeCompare(b.nickname || b.firstName || ""))
                      .map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nickname || u.firstName || u.email || "Jogador"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select value={adminAddAsSub ? "sub" : "main"} onValueChange={(v) => setAdminAddAsSub(v === "sub")}>
                  <SelectTrigger className="w-full sm:w-[140px]" data-testid="select-admin-add-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Titular</SelectItem>
                    <SelectItem value="sub">Suplente</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => adminAddUserId && adminAddMutation.mutate({ userId: adminAddUserId, isSub: adminAddAsSub })}
                  disabled={!adminAddUserId || adminAddMutation.isPending}
                  data-testid="button-admin-add-player"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          )}

          {user?.isAdmin && mainPlayers.length > 0 && (
            <div className="border-t pt-3 space-y-2">
              {!confirmMode ? (
                <Button
                  onClick={() => {
                    setConfirmMode(true);
                    setConfirmedPlayerIds(new Set(mainPlayers.map(p => p.userId)));
                  }}
                  variant="outline"
                  className="w-full"
                  data-testid="button-start-confirm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Presença (Admin)
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Desmarque quem NÃO jogou. Os desmarcados receberão falta.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => confirmMutation.mutate()}
                      disabled={confirmMutation.isPending}
                      data-testid="button-confirm-played"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar
                    </Button>
                    <Button
                      onClick={() => { setConfirmMode(false); setConfirmedPlayerIds(new Set()); }}
                      variant="outline"
                      data-testid="button-cancel-confirm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-main-players">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Titulares ({mainPlayers.length}/10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Array.from({ length: 10 }, (_, i) => {
              const player = mainPlayers[i];
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    player ? 'bg-muted/50' : 'bg-muted/20 border border-dashed border-muted-foreground/20'
                  }`}
                  data-testid={`slot-main-${i + 1}`}
                >
                  <span className="w-8 text-center font-mono font-bold text-lg text-muted-foreground">
                    {i + 1}
                  </span>
                  {player ? (
                    <>
                      {confirmMode && (
                        <Checkbox
                          checked={confirmedPlayerIds.has(player.userId)}
                          onCheckedChange={(checked) => {
                            const newSet = new Set(confirmedPlayerIds);
                            if (checked) { newSet.add(player.userId); } else { newSet.delete(player.userId); }
                            setConfirmedPlayerIds(newSet);
                          }}
                          data-testid={`checkbox-confirm-${i + 1}`}
                        />
                      )}
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.user.profileImageUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(player.user)}
                        </AvatarFallback>
                      </Avatar>
                      <Link href={`/jogador/${player.userId}`} className="font-medium flex-1 underline decoration-muted-foreground/30 underline-offset-2 cursor-pointer" data-testid={`link-player-main-${i + 1}`}>
                        {player.user.nickname || player.user.firstName || "Jogador"}
                      </Link>
                      {confirmMode && !confirmedPlayerIds.has(player.userId) && (
                        <Badge variant="destructive">Faltou</Badge>
                      )}
                      {player.userId === user?.id && (
                        <Badge variant="default">Você</Badge>
                      )}
                      {user?.isAdmin && !confirmMode && player.userId !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => adminRemoveMutation.mutate(player.userId)}
                          disabled={adminRemoveMutation.isPending}
                          data-testid={`button-admin-remove-main-${i + 1}`}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm italic flex-1">
                      Vaga disponível
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-sub-players">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Suplentes ({subPlayers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {subPlayers.length === 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-dashed border-muted-foreground/20">
                <span className="w-8 text-center font-mono font-bold text-lg text-muted-foreground">1</span>
                <span className="text-muted-foreground text-sm italic flex-1">
                  Nenhum suplente
                </span>
              </div>
            ) : (
              subPlayers.map((player, i) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  data-testid={`slot-sub-${i + 1}`}
                >
                  <span className="w-8 text-center font-mono font-bold text-lg text-muted-foreground">
                    {i + 1}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.user.profileImageUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(player.user)}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/jogador/${player.userId}`} className="font-medium flex-1 underline decoration-muted-foreground/30 underline-offset-2 cursor-pointer" data-testid={`link-player-sub-${i + 1}`}>
                    {player.user.nickname || player.user.firstName || "Jogador"}
                  </Link>
                  {player.userId === user?.id && (
                    <Badge variant="default">Você</Badge>
                  )}
                  {user?.isAdmin && player.userId !== user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => adminRemoveMutation.mutate(player.userId)}
                      disabled={adminRemoveMutation.isPending}
                      data-testid={`button-admin-remove-sub-${i + 1}`}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))
            )}
            {subPlayers.length > 0 && (
              <div
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-dashed border-muted-foreground/20"
              >
                <span className="w-8 text-center font-mono font-bold text-lg text-muted-foreground">
                  {subPlayers.length + 1}
                </span>
                <span className="text-muted-foreground text-sm italic flex-1">
                  Vaga disponível
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {mainPlayers.length >= 2 && (
        <Button
          onClick={() => {
            const playerIds = mainPlayers.map(e => e.userId).join(",");
            setLocation(`/mix/escolher-time?players=${playerIds}`);
          }}
          className="w-full"
          data-testid="button-go-team-selection"
        >
          <Swords className="h-4 w-4 mr-2" />
          Escolher Times com Jogadores da Lista ({mainPlayers.length})
        </Button>
      )}

      <Card className="border-yellow-500/20 bg-yellow-500/5" data-testid="card-rules">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Regras da Lista
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Devido aos recentes abandonos sem aviso, quem colocar o nome na lista e não comparecer ou avisar 
            antecipadamente ficará restrito a colocar o nome como suplente nas próximas listas, liberando a vaga principal.
          </p>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">
              Limite de horário de chegada: 19h10. Após isso, suplentes serão acionados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
