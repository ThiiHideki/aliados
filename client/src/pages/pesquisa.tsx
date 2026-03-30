import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ClipboardList, CheckCircle, Clock, Gamepad2, Star, TrendingUp, Users, MessageSquare, Send } from "lucide-react";
import type { Survey } from "@shared/schema";

const HOURS = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00",
  "19:00","20:00","21:00","22:00","23:00","00:00",
];

export default function Pesquisa() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: existingSurvey, isLoading } = useQuery<Survey | null>({
    queryKey: ["/api/survey"],
  });

  const [bestPlayTimes, setBestPlayTimes] = useState<string[]>([]);
  const [faceitLevel, setFaceitLevel] = useState<string>("");
  const [gcLevel, setGcLevel] = useState<string>("");
  const [valveLevel, setValveLevel] = useState("");
  const [improvementSuggestions, setImprovementSuggestions] = useState("");
  const [reasonNotPlaying, setReasonNotPlaying] = useState("");
  const [attractMorePlayers, setAttractMorePlayers] = useState("");
  const [playMoreWays, setPlayMoreWays] = useState("");
  const [generalOpinions, setGeneralOpinions] = useState("");
  const [levelUpInfluenced, setLevelUpInfluenced] = useState<string>("");
  const [levelUpInfluencedComment, setLevelUpInfluencedComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/survey", {
        bestPlayTimes,
        faceitLevel: faceitLevel ? parseInt(faceitLevel) : null,
        gcLevel: gcLevel ? parseInt(gcLevel) : null,
        valveLevel: valveLevel || null,
        improvementSuggestions: improvementSuggestions || null,
        reasonNotPlaying: reasonNotPlaying || null,
        attractMorePlayers: attractMorePlayers || null,
        playMoreWays: playMoreWays || null,
        generalOpinions: generalOpinions || null,
        levelUpInfluenced,
        levelUpInfluencedComment: levelUpInfluencedComment || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/survey"] });
      setSubmitted(true);
      toast({ title: "Pesquisa enviada!", description: "Obrigado por participar!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Erro ao enviar pesquisa", variant: "destructive" });
    },
  });

  const toggleHour = (hour: string) => {
    setBestPlayTimes(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

  const canSubmit = levelUpInfluenced && (levelUpInfluenced !== "yes" || levelUpInfluencedComment.trim());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if ((existingSurvey && !submitted) || submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Pesquisa da Comunidade</h1>
            <p className="text-muted-foreground">Suas respostas ajudam a melhorar o servidor</p>
          </div>
        </div>

        <Card className="border-2 border-green-500/40 bg-green-500/5">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Pesquisa Respondida!</h2>
              <p className="text-muted-foreground max-w-md">
                Você já respondeu a pesquisa da comunidade. Suas respostas foram registradas e serão analisadas para melhorar a experiência de todos.
              </p>
              <p className="text-sm text-muted-foreground">
                Respondido em: {existingSurvey ? new Date(existingSurvey.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "agora"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Pesquisa da Comunidade</h1>
          <p className="text-muted-foreground">Suas respostas ajudam a melhorar o servidor para todos</p>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-center">
            Esta pesquisa é <span className="font-bold text-primary">obrigatória</span> e ajuda a equipe a entender a comunidade e planejar melhorias. Seja honesto!
          </p>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {/* Melhor horário para jogar */}
        <Card data-testid="survey-card-horario">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" />
              Melhor horário para jogar
            </CardTitle>
            <CardDescription>Selecione todos os horários em que você costuma estar disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-md border cursor-pointer transition-colors
                    ${bestPlayTimes.includes(hour)
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-muted/30 border-border hover:border-primary/40"
                    }`}
                  onClick={() => toggleHour(hour)}
                  data-testid={`survey-hour-${hour}`}
                >
                  <Checkbox
                    checked={bestPlayTimes.includes(hour)}
                    className="pointer-events-none"
                    aria-hidden
                  />
                  <span className="text-xs font-mono font-medium">{hour}</span>
                </div>
              ))}
            </div>
            {bestPlayTimes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Selecionados: {bestPlayTimes.sort().join(", ")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Níveis */}
        <Card data-testid="survey-card-niveis">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-5 w-5 text-primary" />
              Seus Níveis
            </CardTitle>
            <CardDescription>Informe seu nível atual nas plataformas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label data-testid="label-faceit-level">Nível FACEIT (1 a 10)</Label>
                <Select value={faceitLevel} onValueChange={setFaceitLevel}>
                  <SelectTrigger data-testid="select-faceit-level">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não tenho conta FACEIT</SelectItem>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label data-testid="label-gc-level">Nível Gamers Club (1 a 21)</Label>
                <Select value={gcLevel} onValueChange={setGcLevel}>
                  <SelectTrigger data-testid="select-gc-level">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não tenho conta GC</SelectItem>
                    {Array.from({ length: 21 }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label data-testid="label-valve-level">Nível Valve (Matchmaking)</Label>
              <Input
                placeholder="Ex: Ouro Nova 3, Master Guardian, etc."
                value={valveLevel}
                onChange={e => setValveLevel(e.target.value)}
                data-testid="input-valve-level"
              />
            </div>
          </CardContent>
        </Card>

        {/* Melhorias no servidor */}
        <Card data-testid="survey-card-melhorias">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Melhorias no Servidor
            </CardTitle>
            <CardDescription>O que você gostaria de ver melhorado no servidor?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: mais mapas, melhor ping, novos plugins, eventos especiais..."
              value={improvementSuggestions}
              onChange={e => setImprovementSuggestions(e.target.value)}
              rows={3}
              data-testid="textarea-improvement-suggestions"
            />
          </CardContent>
        </Card>

        {/* Por que não está jogando tanto */}
        <Card data-testid="survey-card-motivos">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-primary" />
              Motivos para jogar menos
            </CardTitle>
            <CardDescription>Por que você não está jogando tanto ultimamente?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: trabalho, horário incompatível, motivação, outros jogos..."
              value={reasonNotPlaying}
              onChange={e => setReasonNotPlaying(e.target.value)}
              rows={3}
              data-testid="textarea-reason-not-playing"
            />
          </CardContent>
        </Card>

        {/* O que pode atrair mais pessoas */}
        <Card data-testid="survey-card-atrair">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Atrair mais jogadores
            </CardTitle>
            <CardDescription>O que podemos fazer para atrair mais pessoas para a comunidade?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: divulgação, eventos, torneios, premiações..."
              value={attractMorePlayers}
              onChange={e => setAttractMorePlayers(e.target.value)}
              rows={3}
              data-testid="textarea-attract-more-players"
            />
          </CardContent>
        </Card>

        {/* O que pode fazer jogar mais */}
        <Card data-testid="survey-card-jogar-mais">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Para você jogar mais
            </CardTitle>
            <CardDescription>O que podemos fazer especificamente para que você jogue mais?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: mix em horário fixo, mais amigos, missões/desafios, sistema de ranking..."
              value={playMoreWays}
              onChange={e => setPlayMoreWays(e.target.value)}
              rows={3}
              data-testid="textarea-play-more-ways"
            />
          </CardContent>
        </Card>

        {/* Opiniões gerais */}
        <Card data-testid="survey-card-opiniao">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-primary" />
              Opiniões gerais
            </CardTitle>
            <CardDescription>Compartilhe qualquer outra opinião sobre o servidor e a comunidade</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Fique à vontade para escrever o que quiser..."
              value={generalOpinions}
              onChange={e => setGeneralOpinions(e.target.value)}
              rows={4}
              data-testid="textarea-general-opinions"
            />
          </CardContent>
        </Card>

        {/* Nível influenciou */}
        <Card className="border-2 border-primary/30" data-testid="survey-card-nivel-influencia">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pergunta importante
              <Badge variant="destructive" className="text-xs">Obrigatória</Badge>
            </CardTitle>
            <CardDescription>
              Subir de nível nas plataformas (FACEIT, GC, Valve) influenciou você a parar de jogar no servidor?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant={levelUpInfluenced === "yes" ? "default" : "outline"}
                onClick={() => setLevelUpInfluenced("yes")}
                className="flex-1"
                data-testid="button-level-up-yes"
              >
                Sim
              </Button>
              <Button
                variant={levelUpInfluenced === "no" ? "default" : "outline"}
                onClick={() => { setLevelUpInfluenced("no"); setLevelUpInfluencedComment(""); }}
                className="flex-1"
                data-testid="button-level-up-no"
              >
                Não
              </Button>
            </div>

            {levelUpInfluenced === "yes" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Como isso influenciou? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="Explique como subir de nível te afastou do servidor..."
                  value={levelUpInfluencedComment}
                  onChange={e => setLevelUpInfluencedComment(e.target.value)}
                  rows={3}
                  data-testid="textarea-level-up-comment"
                />
                {levelUpInfluenced === "yes" && !levelUpInfluencedComment.trim() && (
                  <p className="text-xs text-destructive">Este campo é obrigatório quando a resposta é Sim</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enviar */}
        <Button
          className="w-full"
          size="lg"
          onClick={() => submitMutation.mutate()}
          disabled={!canSubmit || submitMutation.isPending}
          data-testid="button-submit-survey"
        >
          {submitMutation.isPending ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Enviar Pesquisa
        </Button>
      </div>
    </div>
  );
}
