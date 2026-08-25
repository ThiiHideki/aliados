import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Heart, Copy, Check, Server, Globe, 
  Sparkles, Star, Trophy, Users, Calendar, 
  TrendingUp, ArrowRight, User, Gamepad2, 
  CheckCircle, ClipboardList, Megaphone, Award, Target,
  DollarSign, ExternalLink, Handshake, Skull,
  Newspaper, ChevronDown, ChevronRight, Plus, Trash2, Send,
  Gift, Shirt
} from "lucide-react";
import { SiInstagram, SiDiscord } from "react-icons/si";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { User as UserType, Match, MatchStats, News, Trophy as TrophyType, Survey } from "@shared/schema";
import skinsLabLogo from "@assets/skins_lab_logo1_1771007653832.png";
import awpCrakowImg from "@assets/image_1779807707665.png";
import thomaziniLogo from "@assets/thomazini_logo_1771007598394.jpeg";
import dukinhaLogo from "@assets/WhatsApp_Image_2026-02-13_at_15.40.31_1771008050723.jpeg";
import zenthorLogo from "@assets/zenthor_logo_1771007572398.png";

type NewsWithAuthor = News & { author: UserType };

export default function Mural() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [notifyDiscord, setNotifyDiscord] = useState(true);
  const [mentionEveryone, setMentionEveryone] = useState(false);
  const pixKey = "12982690148";

  const { data: users = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
  });

  const { data: allNews = [] } = useQuery<NewsWithAuthor[]>({
    queryKey: ["/api/news"],
  });

  const createNewsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/news', { title: newsTitle, content: newsContent, notifyDiscord, mentionEveryone });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setNewsTitle("");
      setNewsContent("");
      setShowNewsForm(false);
      setNotifyDiscord(true);
      setMentionEveryone(false);
      toast({ title: "Notícia publicada!", description: notifyDiscord ? "Notificação enviada no Discord." : undefined });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Erro ao publicar", variant: "destructive" });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Notícia removida" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Erro ao remover", variant: "destructive" });
    },
  });

  const { data: latestMvp } = useQuery<{ match: Match; mvpStats: MatchStats; mvpUser: UserType } | null>({
    queryKey: ["/api/matches/latest-mvp"],
    queryFn: async () => {
      const res = await fetch("/api/matches/latest-mvp", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: allTrophies = [] } = useQuery<TrophyType[]>({
    queryKey: ["/api/trophies"],
  });

  const { data: latestAceData } = useQuery<{ match: any; aceStats: any; aceUser: any } | null>({
    queryKey: ["/api/matches/latest-ace"],
    queryFn: async () => {
      const res = await fetch("/api/matches/latest-ace", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' });

  const latestTrophyMonth = allTrophies.length > 0
    ? allTrophies.reduce((latest, t) => {
        const tDate = t.year * 100 + t.month;
        const lDate = latest.year * 100 + latest.month;
        return tDate > lDate ? t : latest;
      }, allTrophies[0])
    : null;
  const prevMonth = latestTrophyMonth?.month || 0;
  const prevYear = latestTrophyMonth?.year || 0;
  const prevMonthTrophies = allTrophies.filter(t => t.month === prevMonth && t.year === prevYear);
  const prevMonthName = prevMonth > 0 ? new Date(prevYear, prevMonth - 1).toLocaleString('pt-BR', { month: 'long' }) : "";
  const userMap = new Map(users.map(u => [u.id, u]));

  const getTrophyDisplay = (type: string) => {
    const configs: Record<string, { label: string; iconClass: string; bgClass: string; borderClass: string }> = {
      best_player: { label: "Craque do Mês", iconClass: "text-yellow-500", bgClass: "bg-yellow-500/10", borderClass: "border-yellow-500/30" },
      best_kd: { label: "Matador Nato", iconClass: "text-red-500", bgClass: "bg-red-500/10", borderClass: "border-red-500/30" },
      best_assists: { label: "Amigão do Server", iconClass: "text-blue-500", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/30" },
      best_hs: { label: "Mira de Aimbot", iconClass: "text-orange-500", bgClass: "bg-orange-500/10", borderClass: "border-orange-500/30" },
      most_matches: { label: "Viciado Oficial", iconClass: "text-purple-500", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/30" },
      worst_player: { label: "Troféu Abacaxi", iconClass: "text-gray-500", bgClass: "bg-gray-500/10", borderClass: "border-gray-500/30" },
      worst_kd: { label: "Ímã de Bala", iconClass: "text-gray-400", bgClass: "bg-gray-400/10", borderClass: "border-gray-400/30" },
      best_kills_avg: { label: "Ceifador", iconClass: "text-red-500", bgClass: "bg-red-500/10", borderClass: "border-red-500/30" },
    };
    return configs[type] || configs.best_player;
  };

  const { data: cheaterBannedUsers = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users/cheater-banned"],
    queryFn: async () => {
      const res = await fetch("/api/users/cheater-banned", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: mySurvey } = useQuery<Survey | null>({
    queryKey: ["/api/survey"],
  });
  const surveyCompleted = !!mySurvey;

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      toast({
        title: "Chave PIX copiada!",
        description: "Cole no seu app de banco para fazer a transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Copie manualmente: " + pixKey,
        variant: "destructive",
      });
    }
  };

  const acePlayerName = latestAceData?.aceUser
    ? (latestAceData.aceUser.nickname || latestAceData.aceUser.firstName || "Jogador")
    : null;

  const mvpName = latestMvp?.mvpUser
    ? (latestMvp.mvpUser.nickname || latestMvp.mvpUser.firstName || "Jogador")
    : null;

  const mvpKd = latestMvp?.mvpStats
    ? ((latestMvp.mvpStats.kills || 0) / Math.max(1, latestMvp.mvpStats.deaths || 1)).toFixed(2)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Mural de Informações</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.nickname || user?.firstName || "Jogador"}! Confira as novidades da comunidade.
          </p>
        </div>
      </div>

      {cheaterBannedUsers.length > 0 && (
        <div className="space-y-3" data-testid="section-cheaters">
          <div className="flex items-center gap-2">
            <Skull className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-bold text-red-500 uppercase tracking-wider">Cheaters Banidos</h2>
          </div>
          {cheaterBannedUsers.map((cheater) => (
            <Card
              key={cheater.id}
              className="border-red-500/40 bg-red-500/5 overflow-hidden"
              data-testid={`card-cheater-${cheater.id}`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
                  <div className="flex items-center justify-center bg-red-500/15 sm:w-36 py-6 px-6 shrink-0">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-red-500/60">
                          <AvatarImage src={cheater.profileImageUrl ?? undefined} />
                          <AvatarFallback className="bg-red-500/20 text-red-400 font-bold text-xl">
                            {(cheater.nickname || cheater.firstName || "?")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 border-2 border-background">
                          <Skull className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-5 flex-1 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl font-bold text-foreground">
                        {cheater.nickname || cheater.firstName || "Jogador"}
                      </span>
                      <Badge variant="destructive" className="text-xs font-black tracking-widest uppercase">
                        <Skull className="h-3 w-3 mr-1" />
                        CHEATER
                      </Badge>
                    </div>
                    <p className="text-sm text-red-400 font-semibold">Ban permanente por uso de cheats</p>
                    <p className="text-xs text-muted-foreground">
                      Esta conta foi banida permanentemente e não pode participar do servidor.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center px-8 bg-red-500/10 border-l border-red-500/20">
                    <Skull className="h-12 w-12 text-red-500/30" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}



      {user?.isAdmin && (
      <Collapsible open={newsOpen} onOpenChange={setNewsOpen}>
        <Card className="border-primary/20" data-testid="card-news">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer select-none">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Newspaper className="h-6 w-6 text-primary" />
                  Jornal Aliados
                </CardTitle>
                <div className="flex items-center gap-2">
                  {allNews.length > 0 && (
                    <Badge variant="secondary">{allNews.length} notícia{allNews.length > 1 ? "s" : ""}</Badge>
                  )}
                  {newsOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
              <CardDescription>
                Clique para {newsOpen ? "fechar" : "abrir"} o jornal da comunidade
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {user?.isAdmin && (
                <div className="space-y-3">
                  {!showNewsForm ? (
                    <Button
                      onClick={() => setShowNewsForm(true)}
                      variant="outline"
                      className="w-full"
                      data-testid="button-new-news"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Publicar Notícia
                    </Button>
                  ) : (
                    <Card className="border-primary/30">
                      <CardContent className="pt-4 space-y-3">
                        <Input
                          placeholder="Título da notícia..."
                          value={newsTitle}
                          onChange={(e) => setNewsTitle(e.target.value)}
                          data-testid="input-news-title"
                        />
                        <Textarea
                          placeholder="Escreva o conteúdo da notícia..."
                          value={newsContent}
                          onChange={(e) => setNewsContent(e.target.value)}
                          rows={4}
                          data-testid="input-news-content"
                        />
                        <div className="space-y-2 border rounded-md p-3">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <SiDiscord className="w-3 h-3 text-[#5865F2]" /> Notificações Discord
                          </p>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="notify-discord"
                              checked={notifyDiscord}
                              onCheckedChange={(v) => setNotifyDiscord(!!v)}
                              data-testid="checkbox-notify-discord"
                            />
                            <Label htmlFor="notify-discord" className="text-sm cursor-pointer">
                              Enviar notificação no Discord
                            </Label>
                          </div>
                          {notifyDiscord && (
                            <div className="flex items-center gap-2 pl-1">
                              <Checkbox
                                id="mention-everyone"
                                checked={mentionEveryone}
                                onCheckedChange={(v) => setMentionEveryone(!!v)}
                                data-testid="checkbox-mention-everyone"
                              />
                              <Label htmlFor="mention-everyone" className="text-sm cursor-pointer">
                                Mencionar @everyone
                              </Label>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={() => createNewsMutation.mutate()}
                            disabled={!newsTitle.trim() || !newsContent.trim() || createNewsMutation.isPending}
                            data-testid="button-publish-news"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {createNewsMutation.isPending ? "Publicando..." : "Publicar"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => { setShowNewsForm(false); setNewsTitle(""); setNewsContent(""); setNotifyDiscord(true); setMentionEveryone(false); }}
                            data-testid="button-cancel-news"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {allNews.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Newspaper className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma notícia publicada ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allNews.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border bg-muted/30 space-y-2"
                      data-testid={`news-item-${item.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={item.author?.profileImageUrl || undefined} />
                              <AvatarFallback className="text-[10px]">
                                {(item.author?.nickname || item.author?.firstName || "A").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {item.author?.nickname || item.author?.firstName || "Admin"}
                              {" · "}
                              {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        {user?.isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNewsMutation.mutate(item.id)}
                            disabled={deleteNewsMutation.isPending}
                            data-testid={`button-delete-news-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      )}





      <div className="grid gap-6 md:grid-cols-2">
        {latestMvp && mvpName && (
          <Card className="border-blue-500/30 bg-blue-500/5" data-testid="card-mvp-last-match">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                MVP da Última Partida
                <Award className="h-5 w-5 text-blue-500" />
              </CardTitle>
              <CardDescription>
                Destaque da partida mais recente no servidor!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-blue-500">
                    <AvatarImage src={latestMvp.mvpUser.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-blue-500/20 text-blue-600 text-xl font-bold">
                      {mvpName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-primary">{mvpName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Melhor jogador na partida de {latestMvp.match.map}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                    <Target className="h-4 w-4 text-red-500 mb-1" />
                    <span className="font-mono font-bold">{latestMvp.mvpStats.kills}</span>
                    <span className="text-xs text-muted-foreground">Kills</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                    <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                    <span className="font-mono font-bold">{mvpKd}</span>
                    <span className="text-xs text-muted-foreground">K/D</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                    <Award className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="font-mono font-bold">{latestMvp.mvpStats.mvps}</span>
                    <span className="text-xs text-muted-foreground">MVPs</span>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {latestMvp.match.map} - {latestMvp.match.team1Score} x {latestMvp.match.team2Score}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {latestAceData && (
          <Card className="border-yellow-500/30 bg-yellow-500/5" data-testid="card-ace-player">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                ACE! 5K!
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </CardTitle>
              <CardDescription>Último jogador a fazer um ACE!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-yellow-500">
                    <AvatarImage src={latestAceData.aceUser.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-yellow-500/20 text-yellow-600 text-xl font-bold">
                      {acePlayerName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-1.5">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-primary">{acePlayerName}</h3>
                  <p className="text-sm text-muted-foreground">
                    fez {latestAceData.aceStats.enemy5ks} ACE{latestAceData.aceStats.enemy5ks > 1 ? "s" : ""} nessa partida!
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <Badge variant="secondary" className="font-mono">
                  {latestAceData.match.map} - {latestAceData.match.team1Score} x {latestAceData.match.team2Score}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {new Date(latestAceData.match.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card data-testid="card-monthly-ranking">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Ranking Mensal
            </CardTitle>
            <CardDescription>Confira quem está dominando neste mês!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-1 capitalize">
                {currentMonth}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              O ranking mensal mostra o desempenho dos jogadores apenas no mês atual. 
              Todos os dados são zerados automaticamente quando o mês vira!
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                <Trophy className="h-6 w-6 text-yellow-500 mb-1" />
                <span className="text-xs font-medium">Top K/D</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                <TrendingUp className="h-6 w-6 text-green-500 mb-1" />
                <span className="text-xs font-medium">Win Rate</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                <Calendar className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">Atualizado</span>
              </div>
            </div>

            <Button onClick={() => setLocation("/ranking-mensal")} className="w-full" data-testid="button-go-monthly-ranking">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Ranking Mensal
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-championship">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Campeonato Aliados
            </CardTitle>
            <CardDescription>O primeiro campeonato oficial está chegando!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                Em Preparação
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Estamos preparando o primeiro campeonato competitivo 5v5 da comunidade. 
              Demonstre seu interesse e seja notificado quando tivermos mais detalhes!
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                <Users className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">5v5</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                <Calendar className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">Em breve</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                <Trophy className="h-6 w-6 text-yellow-500 mb-1" />
                <span className="text-xs font-medium">Prêmios</span>
              </div>
            </div>

            <Button onClick={() => setLocation("/campeonato")} className="w-full" data-testid="button-go-championship">
              <Trophy className="h-4 w-4 mr-2" />
              Quero Participar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>



      {prevMonthTrophies.length > 0 && (
        <Card className="border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent" data-testid="card-trophies-month">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-6 w-6 text-yellow-500" />
              Troféus de {prevMonthName.charAt(0).toUpperCase() + prevMonthName.slice(1)} {prevYear}
            </CardTitle>
            <CardDescription className="text-base">
              Destaques do mês anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {prevMonthTrophies.map((trophy) => {
                const display = getTrophyDisplay(trophy.type);
                const trophyUser = userMap.get(trophy.userId);
                return (
                  <div
                    key={trophy.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${display.borderClass} ${display.bgClass}`}
                    data-testid={`trophy-winner-${trophy.type}`}
                  >
                    <Avatar className="h-10 w-10 border-2 border-muted">
                      <AvatarImage src={trophyUser?.profileImageUrl || undefined} />
                      <AvatarFallback>{(trophyUser?.nickname || trophyUser?.firstName || "?").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Trophy className={`h-4 w-4 shrink-0 ${display.iconClass}`} />
                        <span className="text-sm font-bold truncate">{display.label}</span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        {trophyUser?.nickname || trophyUser?.firstName || "Jogador"}
                      </p>
                      {trophy.description && (
                        <p className="text-xs text-muted-foreground leading-snug">{trophy.description}</p>
                      )}
                      {trophy.value && (
                        <p className="text-xs font-mono font-bold mt-1">{trophy.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-apoiadores">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
            Apoiadores
          </CardTitle>
          <CardDescription>Marcas que apoiam a comunidade Aliados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="flex flex-col items-center gap-3 p-4 rounded-lg border"
              data-testid="card-sponsor-skinslab"
            >
              <img src={skinsLabLogo} alt="Skins Lab" className="h-16 w-auto object-contain rounded-md" />
              <span className="font-semibold text-sm">Skins Lab</span>
              <span className="text-xs text-muted-foreground text-center">Artesanato de Skins de CS2</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.skinslab.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-sponsor-skinslab-site"
                >
                  <Badge variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Site
                  </Badge>
                </a>
                <a
                  href="https://www.instagram.com/skinslab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-sponsor-skinslab-instagram"
                >
                  <Badge variant="outline" className="text-xs">
                    <SiInstagram className="h-3 w-3 mr-1" />
                    Instagram
                  </Badge>
                </a>
              </div>
            </div>

            <a
              href="https://www.instagram.com/thomazini.sp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 rounded-lg border hover-elevate"
              data-testid="link-sponsor-thomazini"
            >
              <img src={thomaziniLogo} alt="Supermercados Thomazini" className="h-16 w-16 object-contain rounded-full" />
              <span className="font-semibold text-sm">Supermercados Thomazini</span>
              <Badge variant="outline" className="text-xs">
                <SiInstagram className="h-3 w-3 mr-1" />
                Instagram
              </Badge>
            </a>

            <a
              href="https://www.dukinhacamisas.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 rounded-lg border hover-elevate"
              data-testid="link-sponsor-dukinha"
            >
              <img src={dukinhaLogo} alt="Dukinha Camisas" className="h-16 w-auto object-contain rounded-md" />
              <span className="font-semibold text-sm">Dukinha Camisas</span>
              <span className="text-xs text-muted-foreground text-center">Camisas de Time</span>
              <Badge variant="outline" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Site
              </Badge>
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 py-4 border-t" data-testid="footer-built-by">
        <span className="text-xs text-muted-foreground">Built by</span>
        <a
          href="https://ZenthorTech.replit.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1"
        >
          <img src={zenthorLogo} alt="Zenthor Tech" className="h-6 w-6 rounded-md object-contain" />
          <span className="text-xs font-semibold text-primary">Zenthor Tech</span>
        </a>
      </div>
    </div>
  );
}
