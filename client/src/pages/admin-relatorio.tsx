import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Activity, UserX, BellRing, Clock, Users as UsersIcon, CalendarDays } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ReportUser = {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  steamId64: string | null;
  discordUserId: string | null;
  totalMatches: number;
  matchesWon: number;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
  hasPush: boolean;
  hasDiscord: boolean;
};

type ReportData = {
  totals: {
    totalUsers: number;
    neverPlayed: number;
    discordEnabled: number;
    pushEnabled: number;
    pushSubscriptions: number;
  };
  mostActive: ReportUser[];
  neverPlayed: ReportUser[];
  discordEnabled: ReportUser[];
  pushEnabled: ReportUser[];
  inactive: ReportUser[];
  prevMonthLabel: string;
  daysPlayedPrevMonth: (ReportUser & { daysPlayed: number; matchesPlayed: number })[];
};

function formatRelative(date: string | null) {
  if (!date) return "—";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  } catch {
    return "—";
  }
}

function UserRow({
  user,
  rightSlot,
  index,
}: {
  user: ReportUser;
  rightSlot?: React.ReactNode;
  index?: number;
}) {
  const initials = (user.nickname || "?").slice(0, 2).toUpperCase();
  return (
    <Link
      href={`/jogador/${user.id}`}
      className="flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2"
      data-testid={`row-user-${user.id}`}
    >
      {typeof index === "number" && (
        <span className="text-sm font-mono text-muted-foreground w-6 text-right">{index + 1}</span>
      )}
      <Avatar className="h-9 w-9">
        {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.nickname} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate" data-testid={`text-name-${user.id}`}>
            {user.nickname}
          </span>
          {user.isAdmin && (
            <Badge variant="outline" className="text-[10px]">
              ADMIN
            </Badge>
          )}
          {user.isBanned && (
            <Badge variant="destructive" className="text-[10px]">
              BAN
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          {user.hasDiscord && <SiDiscord className="h-3 w-3 text-[#5865F2]" />}
          {user.hasPush && <BellRing className="h-3 w-3 text-primary" />}
          <span>Último login: {formatRelative(user.lastLoginAt)}</span>
        </div>
      </div>
      {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
    </Link>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-muted-foreground text-center p-6">{children}</div>
  );
}

export default function AdminRelatorio() {
  const { user, isLoading: authLoading } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery<ReportData>({
    queryKey: ["/api/admin/report"],
    enabled: !!user?.isAdmin,
  });

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <ShieldAlert className="h-10 w-10 mx-auto text-destructive mb-3" />
            <h2 className="text-lg font-semibold">Acesso negado</h2>
            <p className="text-sm text-muted-foreground">Esta página é exclusiva para administradores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
            <h2 className="text-lg font-semibold">Erro ao carregar relatório</h2>
            <p className="text-sm text-muted-foreground" data-testid="text-error-message">
              {(error as any)?.message || "Não foi possível buscar os dados."}
            </p>
            <button
              onClick={() => refetch()}
              className="text-sm font-medium text-primary hover:underline"
              data-testid="button-retry"
            >
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totals = data?.totals;

  const summaryCards = [
    { label: "Usuários totais", value: totals?.totalUsers ?? 0, icon: UsersIcon },
    { label: "Discord linkado", value: totals?.discordEnabled ?? 0, icon: SiDiscord },
    { label: "Push ativo", value: totals?.pushEnabled ?? 0, icon: BellRing },
    { label: "Nunca jogaram", value: totals?.neverPlayed ?? 0, icon: UserX },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
          <Activity className="h-6 w-6 text-primary" />
          Relatório de Atividade
        </h1>
        <p className="text-sm text-muted-foreground">
          Visão geral de engajamento e participação dos jogadores.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map((c) => (
          <Card key={c.label} data-testid={`card-summary-${c.label}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <c.icon className="h-3.5 w-3.5" />
                <span>{c.label}</span>
              </div>
              <div className="text-2xl font-bold mt-1" data-testid={`stat-${c.label}`}>
                {isLoading ? <Skeleton className="h-7 w-12" /> : c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto justify-start gap-1">
          <TabsTrigger value="active" data-testid="tab-active">
            <Activity className="h-4 w-4 mr-2" /> Mais ativos
          </TabsTrigger>
          <TabsTrigger value="never" data-testid="tab-never">
            <UserX className="h-4 w-4 mr-2" /> Nunca jogaram
          </TabsTrigger>
          <TabsTrigger value="discord" data-testid="tab-discord">
            <SiDiscord className="h-4 w-4 mr-2" /> Discord
          </TabsTrigger>
          <TabsTrigger value="push" data-testid="tab-push">
            <BellRing className="h-4 w-4 mr-2" /> Push
          </TabsTrigger>
          <TabsTrigger value="inactive" data-testid="tab-inactive">
            <Clock className="h-4 w-4 mr-2" /> Sem login há mais tempo
          </TabsTrigger>
          <TabsTrigger value="daysplayed" data-testid="tab-daysplayed">
            <CalendarDays className="h-4 w-4 mr-2" /> Dias jogados (mês anterior)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Jogadores mais ativos</CardTitle>
              <CardDescription>Top 50 por número de partidas disputadas.</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !data?.mostActive.length ? (
                <EmptyState>Nenhum jogador com partidas registradas ainda.</EmptyState>
              ) : (
                <div className="divide-y">
                  {data.mostActive.map((u, i) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      index={i}
                      rightSlot={
                        <div className="text-right">
                          <div className="font-bold text-sm" data-testid={`stat-matches-${u.id}`}>
                            {u.totalMatches}
                          </div>
                          <div className="text-xs text-muted-foreground">partidas</div>
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="never">
          <Card>
            <CardHeader>
              <CardTitle>Nunca jogaram nenhuma partida</CardTitle>
              <CardDescription>
                Jogadores cadastrados sem nenhuma partida registrada (
                {data?.neverPlayed.length ?? 0}).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !data?.neverPlayed.length ? (
                <EmptyState>Todos os jogadores já disputaram pelo menos uma partida.</EmptyState>
              ) : (
                <div className="divide-y">
                  {data.neverPlayed.map((u) => (
                    <UserRow key={u.id} user={u} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discord">
          <Card>
            <CardHeader>
              <CardTitle>Notificação do Discord ativada</CardTitle>
              <CardDescription>
                Jogadores com conta do Discord vinculada ({data?.discordEnabled.length ?? 0}).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !data?.discordEnabled.length ? (
                <EmptyState>Nenhum jogador vinculou conta do Discord ainda.</EmptyState>
              ) : (
                <div className="divide-y">
                  {data.discordEnabled.map((u) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      rightSlot={
                        <Badge variant="outline" className="gap-1">
                          <SiDiscord className="h-3 w-3 text-[#5865F2]" />
                          ID
                        </Badge>
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle>Notificação push ativada</CardTitle>
              <CardDescription>
                {data?.pushEnabled.length ?? 0} jogadores com push web/app ativo (
                {data?.totals.pushSubscriptions ?? 0} dispositivos no total).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !data?.pushEnabled.length ? (
                <EmptyState>Ninguém ativou notificações push ainda.</EmptyState>
              ) : (
                <div className="divide-y">
                  {data.pushEnabled.map((u) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      rightSlot={
                        <Badge variant="outline" className="gap-1">
                          <BellRing className="h-3 w-3 text-primary" />
                          Ativo
                        </Badge>
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Não logam no site há mais tempo</CardTitle>
              <CardDescription>
                Top 50 ordenados pela última atividade (login/atualização de perfil).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !data?.inactive.length ? (
                <EmptyState>Sem dados de atividade.</EmptyState>
              ) : (
                <div className="divide-y">
                  {data.inactive.map((u, i) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      index={i}
                      rightSlot={
                        <div className="text-right">
                          <div className="text-xs font-medium" data-testid={`stat-last-${u.id}`}>
                            {formatRelative(u.lastLoginAt)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">último login</div>
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daysplayed">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">
                Dias jogados em {data?.prevMonthLabel ?? "mês anterior"}
              </CardTitle>
              <CardDescription>
                Quantidade de dias distintos em que cada jogador disputou ao menos uma partida no mês anterior (
                {data?.daysPlayedPrevMonth.length ?? 0} jogadores).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !data?.daysPlayedPrevMonth.length ? (
                <EmptyState>Nenhuma partida registrada no mês anterior.</EmptyState>
              ) : (
                <div className="divide-y">
                  {data.daysPlayedPrevMonth.map((u, i) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      index={i}
                      rightSlot={
                        <div className="text-right">
                          <div className="font-bold text-sm" data-testid={`stat-days-${u.id}`}>
                            {u.daysPlayed} {u.daysPlayed === 1 ? "dia" : "dias"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {u.matchesPlayed} {u.matchesPlayed === 1 ? "partida" : "partidas"}
                          </div>
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
