import { useEffect, useRef, useCallback } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { Lock, Ban, Skull } from "lucide-react";
import { SiSteam } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { queryClient, RELOGIN_MESSAGE } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminUsers from "@/pages/admin-users";
import MixEscolherTime from "@/pages/mix-escolher-time";
import Perfil from "@/pages/perfil";
import Rankings from "@/pages/rankings";
import ServidorComandos from "@/pages/servidor-comandos";
import ServidorMapas from "@/pages/servidor-mapas";
import ServidorSkins from "@/pages/servidor-skins";
import ServidorSteamId from "@/pages/servidor-steamid";
import Patrocinadores from "@/pages/patrocinadores";
import PartidasMinhas from "@/pages/partidas-minhas";
import PartidasTodas from "@/pages/partidas-todas";
import AdminImport from "@/pages/admin-import";
import AdminFinanceiro from "@/pages/admin-financeiro";
import Denuncias from "@/pages/denuncias";
import AdminDenuncias from "@/pages/admin-denuncias";
import PioresJogadores from "@/pages/piores-jogadores";
import PerfilJogador from "@/pages/perfil-jogador";
import CompararJogadores from "@/pages/comparar-jogadores";
import MapasMaisJogados from "@/pages/mapas-mais-jogados";
import Jogadores from "@/pages/jogadores";
import Campeonato from "@/pages/campeonato";
import AdminCampeonato from "@/pages/admin-campeonato";
import RankingMensal from "@/pages/ranking-mensal";
import MixVetoMapas from "@/pages/mix-veto-mapas";
import MixDisponibilidade from "@/pages/mix-disponibilidade";
import AdminHistoricoRankings from "@/pages/admin-historico-rankings";
import AdminPunicoes from "@/pages/admin-punicoes";
import Apostas from "@/pages/apostas";
import Cassino from "@/pages/cassino";
import JogatinaFantasy from "@/pages/jogatina-fantasy";
import Mural from "@/pages/mural";
import AdminPesquisa from "@/pages/admin-pesquisa";
import AdminRelatorio from "@/pages/admin-relatorio";
import CopaInscricao from "@/pages/copa-inscricao";
import CopaTabela from "@/pages/copa-tabela";
import CopaEstatisticas from "@/pages/copa-estatisticas";
import CopaPremiacoes from "@/pages/copa-premiacoes";
import CopaRegras from "@/pages/copa-regras";
import AdminCopa from "@/pages/admin-copa";
import AdminSorteios from "@/pages/admin-sorteios";
import Torneio2x2 from "@/pages/torneio-2x2";
import { RaffleWinnerAlert } from "@/components/raffle-winner-alert";
import VincularDiscord from "@/pages/vincular-discord";
import logoUrl from "@assets/WhatsApp_Image_2025-11-17_at_01.47.14_(1)_1764723428520.jpeg";

function SurveyGuard({ children }: { children: React.ReactNode }) {
  // Pesquisa não é mais obrigatória — admins podem consultar respostas em /admin/pesquisa.
  return <>{children}</>;
}

function DiscordGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="Aliados" className="h-8 w-8 rounded object-contain" />
          <span className="font-semibold text-sm hidden sm:inline">Aliados</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href="/api/auth/steam" className="flex items-center gap-2">
              <SiSteam className="h-4 w-4" />
              <span className="hidden sm:inline">Steam</span>
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="/api/login">Entrar</a>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

function LoginRequired() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Lock className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Acesso restrito</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Você precisa estar logado para acessar esta página.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <a href="/api/auth/steam" className="flex items-center gap-2">
            <SiSteam className="h-4 w-4" />
            Entrar com Steam
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/api/login">Entrar com Replit</a>
        </Button>
      </div>
    </div>
  );
}

function BannedScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/30">
        <Ban className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-destructive mb-2">Acesso Bloqueado</h1>
        <p className="text-muted-foreground max-w-sm">
          Você não está podendo acessar. Contate um administrador para mais informações.
        </p>
      </div>
      <Button variant="outline" asChild>
        <a href="/api/logout">Sair</a>
      </Button>
    </div>
  );
}

function CheaterBannedScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background px-4 text-center">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/40">
        <Skull className="h-12 w-12 text-red-500" />
      </div>
      <div>
        <h1 className="text-3xl font-black text-red-500 tracking-widest mb-3">CHEATER</h1>
        <p className="text-xl font-semibold text-foreground mb-2">Você não é bem-vindo aqui.</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Sua conta foi banida permanentemente por uso de cheats. Este ban não pode ser revertido.
        </p>
      </div>
      <Button variant="outline" asChild>
        <a href="/api/logout">Sair</a>
      </Button>
    </div>
  );
}

function Router() {
  const { user, isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <img 
          src={logoUrl} 
          alt="Aliados" 
          className="h-24 w-24 rounded-lg object-contain animate-pulse"
        />
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || isError) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/copa/tabela">
          <PublicLayout><CopaTabela /></PublicLayout>
        </Route>
        <Route path="/copa/regras">
          <PublicLayout><CopaRegras /></PublicLayout>
        </Route>
        <Route path="/copa/premiacoes">
          <PublicLayout><CopaPremiacoes /></PublicLayout>
        </Route>
        <Route path="/copa/estatisticas">
          <PublicLayout><CopaEstatisticas /></PublicLayout>
        </Route>
        <Route path="/copa/inscricao">
          <PublicLayout><CopaInscricao /></PublicLayout>
        </Route>
        <Route path="/torneio-2x2">
          <PublicLayout><Torneio2x2 /></PublicLayout>
        </Route>
        <Route>
          <PublicLayout><LoginRequired /></PublicLayout>
        </Route>
      </Switch>
    );
  }

  return (
    <SurveyGuard>
      <DiscordGuard>
      <Switch>
        <Route path="/vincular-discord" component={VincularDiscord} />
        <Route path="/" component={Mural} />
        <Route path="/dashboard" component={user?.isAdmin ? AdminDashboard : Dashboard} />
        <Route path="/perfil" component={Perfil} />
        <Route path="/mix/escolher-time" component={MixEscolherTime} />
        <Route path="/mix/veto-mapas" component={MixVetoMapas} />
        <Route path="/mix/disponibilidade" component={MixDisponibilidade} />
        <Route path="/jogadores" component={Jogadores} />
        <Route path="/rankings" component={Rankings} />
        <Route path="/piores-jogadores" component={PioresJogadores} />
        <Route path="/ranking-mensal" component={RankingMensal} />
        <Route path="/jogador/:id" component={PerfilJogador} />
        <Route path="/comparar-jogadores" component={CompararJogadores} />
        <Route path="/servidor/comandos" component={ServidorComandos} />
        <Route path="/servidor/mapas" component={ServidorMapas} />
        <Route path="/servidor/skins" component={ServidorSkins} />
        <Route path="/servidor/steamid" component={ServidorSteamId} />
        <Route path="/patrocinadores" component={Patrocinadores} />
        <Route path="/campeonato" component={Campeonato} />
        <Route path="/denuncias" component={Denuncias} />
        <Route path="/cassino/apostas" component={Apostas} />
        <Route path="/cassino/jogos" component={Cassino} />
        <Route path="/jogatina/fantasy" component={JogatinaFantasy} />
        <Route path="/partidas/minhas" component={PartidasMinhas} />
        <Route path="/partidas/todas" component={PartidasTodas} />
        <Route path="/partidas/mapas" component={MapasMaisJogados} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/import" component={AdminImport} />
        <Route path="/admin/financeiro" component={AdminFinanceiro} />
        <Route path="/admin/denuncias" component={AdminDenuncias} />
        <Route path="/admin/campeonato" component={AdminCampeonato} />
        <Route path="/admin/historico-rankings" component={AdminHistoricoRankings} />
        <Route path="/admin/punicoes" component={AdminPunicoes} />
        <Route path="/admin/pesquisa" component={AdminPesquisa} />
        <Route path="/admin/relatorio" component={AdminRelatorio} />
        <Route path="/copa/inscricao" component={CopaInscricao} />
        <Route path="/copa/tabela" component={CopaTabela} />
        <Route path="/copa/estatisticas" component={CopaEstatisticas} />
        <Route path="/copa/premiacoes" component={CopaPremiacoes} />
        <Route path="/copa/regras" component={CopaRegras} />
        <Route path="/admin/copa" component={AdminCopa} />
        <Route path="/admin/sorteios" component={AdminSorteios} />
        <Route path="/torneio-2x2" component={Torneio2x2} />
        <Route component={NotFound} />
      </Switch>
      </DiscordGuard>
    </SurveyGuard>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-2 p-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <img 
                src={logoUrl} 
                alt="Aliados" 
                className="h-8 w-8 rounded object-contain"
              />
              <span className="font-semibold hidden sm:inline">Aliados</span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) {
    return <Router />;
  }

  if (!isAuthenticated || isError) {
    return <Router />;
  }

  if ((user as any)?.isCheaterBanned) {
    return <CheaterBannedScreen />;
  }

  if ((user as any)?.isBanned) {
    return <BannedScreen />;
  }

  return (
    <AuthenticatedLayout>
      <Router />
    </AuthenticatedLayout>
  );
}

function SessionExpiredListener() {
  const { toast } = useToast();
  const shownRef = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      queryClient.clear();
      toast({
        title: "Sessão expirada",
        description: RELOGIN_MESSAGE,
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);
    };
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, [toast]);

  return null;
}

function ChunkLoadErrorHandler() {
  const reloadedRef = useRef(false);

  const handleChunkError = useCallback((error: Error | PromiseRejectionEvent) => {
    const err = error instanceof Error ? error : (error as PromiseRejectionEvent).reason;
    if (!err) return;
    const msg = err.message || String(err);
    const isChunkError =
      err.name === "ChunkLoadError" ||
      /Loading chunk \d+ failed/.test(msg) ||
      /Failed to fetch dynamically imported module/.test(msg) ||
      /error loading dynamically imported module/i.test(msg) ||
      /Importing a module script failed/.test(msg);

    if (isChunkError && !reloadedRef.current) {
      reloadedRef.current = true;
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const onUnhandledRejection = (e: PromiseRejectionEvent) => handleChunkError(e);
    const onError = (e: ErrorEvent) => {
      if (e.error) handleChunkError(e.error);
    };
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, [handleChunkError]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChunkLoadErrorHandler />
        <AppContent />
        <RaffleWinnerAlert />
        <SessionExpiredListener />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
