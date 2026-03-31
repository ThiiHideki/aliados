import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link2, CheckCircle2, ExternalLink, HelpCircle, Unlink,
  Wifi, WifiOff, AlertCircle, Smartphone, Monitor,
  AlertTriangle, X,
} from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Link, useLocation } from "wouter";

export default function VincularDiscord() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [discordId, setDiscordId] = useState("");

  const { data: status } = useQuery<{ connected: boolean; error?: string | null; inviteUrl?: string }>({
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
      toast({
        title: "ID inválido",
        description: "O ID do Discord é um número com 17 a 19 dígitos. Não é o seu nome de usuário.",
        variant: "destructive",
      });
      return;
    }
    linkMutation.mutate(trimmed);
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <SiDiscord className="w-8 h-8 text-[#5865F2] shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Vincular Discord</h1>
            <p className="text-muted-foreground text-sm">
              Conecte sua conta do Discord ao site.
            </p>
          </div>
        </div>
        {/* Close/skip button — only shown when not linked */}
        {!alreadyLinked && (
          <Button asChild variant="ghost" size="icon" data-testid="button-skip-discord">
            <Link href="/">
              <X className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Disclaimer — only when not linked */}
      {!alreadyLinked && (
        <Card className="border-orange-500/40 bg-orange-500/10">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-orange-300">
                  Sem vínculo, funcionalidades do Discord ficam indisponíveis
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                    Você <strong className="text-foreground">não conseguirá entrar na Lista do Mix pelo Discord</strong> — apenas pelo site
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                    O botão "Entrar no Mix" nas notificações do Discord não vai funcionar para você
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Você pode vincular a qualquer momento voltando a esta página.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bot status */}
      <div className="flex flex-col gap-2">
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

        {/* Channel access error */}
        {status?.error && (
          <div className="flex flex-col gap-2 p-3 rounded-md border border-orange-500/30 bg-orange-500/10 text-sm">
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              Bot sem acesso ao canal
            </div>
            <p className="text-muted-foreground text-xs">{status.error}</p>
            {status.inviteUrl ? (
              <Button asChild size="sm" variant="outline" className="gap-2 self-start">
                <a href={status.inviteUrl} target="_blank" rel="noreferrer">
                  <SiDiscord className="w-4 h-4 text-[#5865F2]" />
                  Adicionar bot ao servidor
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">Peça ao admin para adicionar o bot ao servidor Discord.</p>
            )}
          </div>
        )}
      </div>

      {/* Linked / Link form */}
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
            <div className="flex flex-wrap gap-2">
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
                <strong className="text-foreground">Nome de usuário</strong> (ex: <span className="font-mono">dil2250</span>) é diferente do{" "}
                <strong className="text-foreground">ID numérico</strong> (ex: <span className="font-mono">123456789012345678</span>). Você precisa do ID numérico.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
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

      {/* How to find your ID */}
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
                  <li>Clique com o botão direito no seu nome/avatar → <strong className="text-foreground">"Copiar ID do Usuário"</strong></li>
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
  );
}
