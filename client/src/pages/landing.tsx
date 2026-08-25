import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Target,
  Users,
  BarChart3,
  Trophy,
  Shield,
  Swords,
} from "lucide-react";
import { SiSteam } from "react-icons/si";
import logoUrl from "/aliados_logo.png";

export default function Landing() {
  const features = [
    {
      icon: BarChart3,
      title: "Estatísticas Detalhadas",
      description:
        "Acompanhe K/D, headshots, taxa de vitória e muito mais em tempo real",
    },
    {
      icon: Swords,
      title: "Balanceamento de Times",
      description:
        "Sistema inteligente para criar partidas equilibradas entre amigos",
    },
    {
      icon: Trophy,
      title: "Rankings",
      description:
        "Veja quem são os melhores jogadores do seu grupo de amigos",
    },
    {
      icon: Shield,
      title: "Perfis Personalizados",
      description:
        "Cada jogador tem seu próprio perfil com estatísticas individuais",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Glow background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-900/20 via-primary/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <header className="border-b border-purple-900/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Aliados Gaming"
              className="h-12 w-12 rounded-lg object-contain drop-shadow-[0_0_10px_rgba(118,224,38,0.4)]"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider uppercase text-white drop-shadow">ALIADOS</span>
              <span className="text-xs text-primary font-bold tracking-widest uppercase">Gaming Community</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeToggle />
            <Button variant="default" className="font-bold gap-2 shadow-[0_0_15px_rgba(118,224,38,0.3)] hover:shadow-[0_0_25px_rgba(118,224,38,0.5)] transition-all" asChild data-testid="button-login-steam-header">
              <a href="/api/auth/steam">
                <SiSteam className="h-5 w-5" />
                Entrar com Steam
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 pointer-events-none" />
              <img
                src={logoUrl}
                alt="Aliados Gaming"
                className="h-44 w-44 rounded-2xl object-contain drop-shadow-[0_0_25px_rgba(118,224,38,0.5)] transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-purple-950/60 border border-primary/40 rounded-full shadow-[0_0_15px_rgba(118,224,38,0.15)]">
              <Target className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold tracking-wide text-primary uppercase">
                Comunidade CS2 • Aliados Gaming
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase">
              BEM-VINDO AO{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-purple-400 drop-shadow-[0_0_20px_rgba(118,224,38,0.3)]">
                ALIADOS GAMING
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Estatísticas avançadas, balanceamento automático de mix, rankings competitivos
              e fantasy league. Tudo que o seu squad precisa em um só lugar.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="text-base font-bold px-8 py-6 gap-3 shadow-[0_0_20px_rgba(118,224,38,0.4)] hover:shadow-[0_0_30px_rgba(118,224,38,0.6)] transition-all" asChild data-testid="button-get-started-steam">
                <a href="/api/auth/steam">
                  <SiSteam className="h-6 w-6" />
                  ENTRAR COM A STEAM
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              O login via Steam captura seu SteamID64 automaticamente e vincula sua conta existente.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 bg-card/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Tudo que você precisa para suas partidas
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Funcionalidades pensadas para jogadores que levam suas partidas
                a sério
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8">Nossa Comunidade</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold font-mono text-primary mb-2">
                  <Users className="h-10 w-10 mx-auto mb-2" />
                  10+
                </div>
                <div className="text-sm text-muted-foreground">
                  Jogadores Ativos
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold font-mono text-primary mb-2">
                  <Swords className="h-10 w-10 mx-auto mb-2" />
                  500+
                </div>
                <div className="text-sm text-muted-foreground">
                  Partidas Jogadas
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold font-mono text-primary mb-2">
                  <Trophy className="h-10 w-10 mx-auto mb-2" />
                  1.5+
                </div>
                <div className="text-sm text-muted-foreground">K/D Médio</div>
              </div>
              <div>
                <div className="text-4xl font-bold font-mono text-primary mb-2">
                  <Target className="h-10 w-10 mx-auto mb-2" />
                  45%
                </div>
                <div className="text-sm text-muted-foreground">
                  Headshot Rate
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <img
            src={logoUrl}
            alt="Aliados"
            className="h-16 w-16 mx-auto mb-4 rounded-md object-contain"
          />
          <p className="text-sm text-muted-foreground">
            Aliados - Counter-Strike 2
          </p>
        </div>
      </footer>
    </div>
  );
}
