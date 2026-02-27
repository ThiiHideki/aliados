import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldX,
  Trash2,
  Plus,
  Users,
  Calendar,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User, MixPenalty } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminPunicoes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [clearUserId, setClearUserId] = useState<string | null>(null);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: allPenalties = [], isLoading } = useQuery<MixPenalty[]>({
    queryKey: ["/api/mix/penalties"],
  });

  const addPenaltyMutation = useMutation({
    mutationFn: async (userId: string) => {
      const today = new Date().toISOString().split("T")[0];
      return apiRequest("POST", "/api/mix/penalties", { userId, listDate: today });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mix/penalties"] });
      toast({ title: "Punição aplicada", description: "O jogador foi punido com sucesso." });
      setSelectedUserId("");
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Erro ao aplicar punição", variant: "destructive" });
    },
  });

  const clearPenaltiesMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/mix/penalties/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mix/penalties"] });
      toast({ title: "Punições limpas", description: "Todas as punições do jogador foram removidas." });
      setClearUserId(null);
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Erro ao limpar punições", variant: "destructive" });
    },
  });

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso restrito a administradores.</p>
      </div>
    );
  }

  const userMap = new Map(users.map(u => [u.id, u]));
  const getPlayerName = (u: User | undefined) => u?.nickname || u?.firstName || "Jogador";

  const penaltiesByUser = new Map<string, MixPenalty[]>();
  for (const p of allPenalties) {
    const existing = penaltiesByUser.get(p.userId) || [];
    existing.push(p);
    penaltiesByUser.set(p.userId, existing);
  }

  const punishedUsers = Array.from(penaltiesByUser.entries())
    .map(([userId, penalties]) => ({
      userId,
      user: userMap.get(userId),
      penalties,
      count: penalties.length,
    }))
    .sort((a, b) => b.count - a.count);

  const getStatusBadge = (count: number) => {
    if (count >= 3) {
      return (
        <Badge variant="destructive" className="gap-1">
          <ShieldX className="h-3 w-3" />
          Suspenso
        </Badge>
      );
    }
    if (count >= 1) {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
          <ShieldAlert className="h-3 w-3" />
          Reserva Forçada ({count}/3)
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Shield className="h-3 w-3" />
        Sem punição
      </Badge>
    );
  };

  const playersWithSteam = users.filter(u => u.steamId64 && u.totalMatches > 0);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          Gerenciar Punições do Mix
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualize jogadores punidos e aplique ou remova punições manualmente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <ShieldAlert className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono" data-testid="text-total-punished">
                  {punishedUsers.length}
                </p>
                <p className="text-sm text-muted-foreground">Jogadores punidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono" data-testid="text-forced-sub-count">
                  {punishedUsers.filter(u => u.count >= 1 && u.count < 3).length}
                </p>
                <p className="text-sm text-muted-foreground">Reserva forçada</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ShieldX className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono" data-testid="text-suspended-count">
                  {punishedUsers.filter(u => u.count >= 3).length}
                </p>
                <p className="text-sm text-muted-foreground">Suspensos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Aplicar Punição Manual
          </CardTitle>
          <CardDescription>
            Selecione um jogador para aplicar uma punição. Com 1-2 punições o jogador só entra como reserva.
            Com 3+ punições, o jogador fica suspenso do mix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1" data-testid="select-player-penalty">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecione um jogador" />
              </SelectTrigger>
              <SelectContent>
                {playersWithSteam.map(u => (
                  <SelectItem key={u.id} value={u.id}>
                    {getPlayerName(u)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => selectedUserId && addPenaltyMutation.mutate(selectedUserId)}
              disabled={!selectedUserId || addPenaltyMutation.isPending}
              data-testid="button-apply-penalty"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {addPenaltyMutation.isPending ? "Aplicando..." : "Aplicar Punição"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-yellow-500" />
            Jogadores com Punições ({punishedUsers.length})
          </CardTitle>
          <CardDescription>
            Lista de todos os jogadores que possuem punições ativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : punishedUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum jogador com punições no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {punishedUsers.map(({ userId, user: punishedUser, penalties, count }) => (
                <div
                  key={userId}
                  className={`rounded-lg p-4 ${
                    count >= 3
                      ? "bg-red-500/5 border border-red-500/20"
                      : "bg-yellow-500/5 border border-yellow-500/20"
                  }`}
                  data-testid={`card-penalty-user-${userId}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={punishedUser?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {getPlayerName(punishedUser).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getPlayerName(punishedUser)}</div>
                        <div className="text-xs text-muted-foreground">
                          {count} {count === 1 ? "punição" : "punições"}
                        </div>
                      </div>
                      {getStatusBadge(count)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setClearUserId(userId)}
                      data-testid={`button-clear-penalty-${userId}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Punições
                    </Button>
                  </div>
                  <div className="mt-3 space-y-1">
                    {penalties.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Calendar className="h-3 w-3" />
                        <span>
                          Falta no mix de {format(new Date(p.listDate + "T12:00:00"), "dd/MM/yyyy")}
                        </span>
                        <span className="text-xs">
                          ({formatDistanceToNow(new Date(p.createdAt!), { addSuffix: true, locale: ptBR })})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!clearUserId} onOpenChange={() => setClearUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar punições?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover todas as punições de{" "}
              <strong>{getPlayerName(userMap.get(clearUserId || ""))}</strong>?
              O jogador voltará a participar do mix normalmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clearUserId && clearPenaltiesMutation.mutate(clearUserId)}
              data-testid="button-confirm-clear"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
