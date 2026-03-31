import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, CheckCircle2, ExternalLink, HelpCircle, Unlink, Wifi, WifiOff, AlertCircle, Smartphone, Monitor } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useLocation } from "wouter";

export default function VincularDiscord() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [discordId, setDiscordId] = useState("");

  const { data: status } = useQuery<{ connected: boolean }>({
    queryKey: ["/api/discord/status"],
  });

  const linkMutation = useMutation({
    mutationFn: async (discordUserId: string) =>
      apiRequest("POST", "/api/discord/link", { discordUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Discord vinculado!", description: "Agora você pode entrar no mix pelo Discord." });
      setLocation("/mix/disponibilidade");
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: err.message || "Não foi possível vincular o Discord.", variant: "destructive" });
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async () => apiRequest("DELETE", "/api/discord/link"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Discord desvinculado" });
      setDiscordId("");
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const alreadyLinked = !!(user as any)?.discordUserId;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = discordId.trim();
    if (!trimmed) {
      toast({ title: "Campo vazio", description: "Insira o ID numérico do Discord.", variant: "destructive" });
      return;
    }
    if (!/^\d{15,20}$/.test(trimmed)) {
      toast({ title: "ID inválido", description: "O ID do Discord é um número com 17 a 19 dígitos. Não é o seu nome de usuário.", variant: "destructive" });
      return;
    }
    linkMutation.mutate(trimmed);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-lg space-y-4">

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <SiDiscord className="w-10 h-10 text-[#5865F2]" />
            <h1 className="text-2xl font-bold">Vincular Discord</h1>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            Vincule sua conta do Discord para entrar no mix diretamente pelo servidor, receber notificações de vagas e muito mais.
          </p>
          <div className="flex items-center gap-2">
            {status?.connected ? (
              <Badge variant="secondary" className="gap-1 text-green-500">
                <Wifi className="w-3 h-3" /> Bot online
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-muted-foreground">
                <WifiOff className="w-3 h-3" /> Bot offline
              </Badge>
            )}
          </div>
        </div>

        {alreadyLinked ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" /> Discord vinculado!
              </CardTitle>
              <CardDescription>
                ID vinculado: <span className="font-mono font-semibold">{(user as any)?.discordUserId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Quando o bot enviar a notificação de mix no Discord, clique em <strong>"Entrar no Mix"</strong> e sua vaga será reservada automaticamente.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => unlinkMutation.mutate()}
                  disabled={unlinkMutation.isPending}
                  data-testid="button-unlink-discord"
                >
                  <Unlink className="w-4 h-4" />
                  Desvincular
                </Button>
                <Button asChild size="sm">
                  <a href="/mix/disponibilidade">Ver lista do Mix</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5" /> Insira seu ID numérico do Discord
              </CardTitle>
              <CardDescription>
                O ID é um número de 17 a 19 dígitos — diferente do seu nome de usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 bg-muted/50 rounded-md p-3 mb-4">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Nome de usuário</strong> (ex: <span className="font-mono">dil2250</span>) é diferente do <strong className="text-foreground">ID numérico</strong> (ex: <span className="font-mono">123456789012345678</span>). Você precisa do ID numérico abaixo.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 123456789012345678"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value.trim())}
                  data-testid="input-discord-id"
                  className="font-mono"
                  maxLength={20}
                />
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={linkMutation.isPending || !discordId.trim()}
                  data-testid="button-link-discord"
                >
                  <SiDiscord className="w-4 h-4" />
                  {linkMutation.isPending ? "Vinculando..." : "Vincular Discord"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <HelpCircle className="w-4 h-4" /> Como encontrar meu ID numérico?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Monitor className="w-4 h-4 mt-0.5 shrink-0 text-[#5865F2]" />
                <div>
                  <p className="font-semibold mb-1">No computador:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Abra o Discord</li>
                    <li>Clique em <strong className="text-foreground">Configurações</strong> (engrenagem no canto inferior esquerdo)</li>
                    <li>Vá em <strong className="text-foreground">Avançado</strong> e ative o <strong className="text-foreground">Modo Desenvolvedor</strong></li>
                    <li>Feche as configurações e clique na <strong className="text-foreground">sua foto de perfil</strong> no canto inferior esquerdo</li>
                    <li>Clique com o botão direito no seu nome/avatar e selecione <strong className="text-foreground">"Copiar ID do Usuário"</strong></li>
                    <li>Cole o número aqui</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 mt-0.5 shrink-0 text-[#5865F2]" />
                <div>
                  <p className="font-semibold mb-1">No celular:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Abra o Discord</li>
                    <li>Toque na <strong className="text-foreground">sua foto de perfil</strong> (canto inferior direito)</li>
                    <li>Toque nos três pontinhos <strong className="text-foreground">(...)</strong> no canto superior direito</li>
                    <li>Selecione <strong className="text-foreground">"Copiar ID do usuário"</strong></li>
                    <li>Cole o número aqui</li>
                  </ol>
                </div>
              </div>
            </div>

            <a
              href="https://support.discord.com/hc/pt-br/articles/206346498"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline text-xs"
            >
              <ExternalLink className="w-3 h-3" /> Guia oficial do Discord (em inglês)
            </a>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
