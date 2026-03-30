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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ClipboardList, CheckCircle, Clock, Gamepad2, Star, TrendingUp, Users, MessageSquare, Send, AlertCircle } from "lucide-react";
import type { Survey } from "@shared/schema";

const HOURS = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00",
  "19:00","20:00","21:00","22:00","23:00","00:00",
];

function RequiredMark() {
  return <span className="text-destructive ml-0.5">*</span>;
}

function FieldError({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
      <p className="text-xs text-destructive">{message}</p>
    </div>
  );
}

export default function Pesquisa() {
  const { toast } = useToast();
  const [attempted, setAttempted] = useState(false);

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

  const errors = {
    bestPlayTimes: bestPlayTimes.length === 0,
    faceitLevel: !faceitLevel,
    gcLevel: !gcLevel,
    valveLevel: !valveLevel.trim(),
    improvementSuggestions: !improvementSuggestions.trim(),
    reasonNotPlaying: !reasonNotPlaying.trim(),
    attractMorePlayers: !attractMorePlayers.trim(),
    playMoreWays: !playMoreWays.trim(),
    generalOpinions: !generalOpinions.trim(),
    levelUpInfluenced: !levelUpInfluenced,
    levelUpInfluencedComment: levelUpInfluenced === "yes" && !levelUpInfluencedComment.trim(),
  };

  const hasErrors = Object.values(errors).some(Boolean);

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

  const handleSubmit = () => {
    setAttempted(true);
    if (hasErrors) {
      toast({
        title: "Preencha todos os campos",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate();
  };

  const toggleHour = (hour: string) => {
    setBestPlayTimes(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

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
                Respondido em: {existingSurvey
                  ? new Date(existingSurvey.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                  : "agora"}
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
            Todos os campos são <span className="font-bold text-primary">obrigatórios</span>. Seja honesto, suas respostas são confidenciais!
          </p>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {/* Melhor horário para jogar */}
        <Card data-testid="survey-card-horario" className={attempted && errors.bestPlayTimes ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" />
              Melhor horário para jogar
              <RequiredMark />
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
            <FieldError show={attempted && errors.bestPlayTimes} message="Selecione pelo menos um horário" />
          </CardContent>
        </Card>

        {/* Níveis */}
        <Card data-testid="survey-card-niveis" className={attempted && (errors.faceitLevel || errors.gcLevel || errors.valveLevel) ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-5 w-5 text-primary" />
              Seus Níveis
              <RequiredMark />
            </CardTitle>
            <CardDescription>Informe seu nível atual nas plataformas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label data-testid="label-faceit-level">
                  Nível FACEIT (1 a 10) <RequiredMark />
                </Label>
                <Select value={faceitLevel} onValueChange={setFaceitLevel}>
                  <SelectTrigger data-testid="select-faceit-level" className={attempted && errors.faceitLevel ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não tenho conta FACEIT</SelectItem>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError show={attempted && errors.faceitLevel} message="Selecione seu nível FACEIT" />
              </div>

              <div className="space-y-1.5">
                <Label data-testid="label-gc-level">
                  Nível Gamers Club (1 a 21) <RequiredMark />
                </Label>
                <Select value={gcLevel} onValueChange={setGcLevel}>
                  <SelectTrigger data-testid="select-gc-level" className={attempted && errors.gcLevel ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não tenho conta GC</SelectItem>
                    {Array.from({ length: 21 }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError show={attempted && errors.gcLevel} message="Selecione seu nível GC" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label data-testid="label-valve-level">
                Nível Valve (Matchmaking) <RequiredMark />
              </Label>
              <Input
                placeholder="Ex: Ouro Nova 3, Master Guardian, Supremo, etc."
                value={valveLevel}
                onChange={e => setValveLevel(e.target.value)}
                data-testid="input-valve-level"
                className={attempted && errors.valveLevel ? "border-destructive" : ""}
              />
              <FieldError show={attempted && errors.valveLevel} message="Informe seu nível Valve" />
            </div>
          </CardContent>
        </Card>

        {/* Melhorias no servidor */}
        <Card data-testid="survey-card-melhorias" className={attempted && errors.improvementSuggestions ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Melhorias no Servidor
              <RequiredMark />
            </CardTitle>
            <CardDescription>O que você gostaria de ver melhorado no servidor?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Textarea
              placeholder="Ex: mais mapas, melhor ping, novos plugins, eventos especiais..."
              value={improvementSuggestions}
              onChange={e => setImprovementSuggestions(e.target.value)}
              rows={3}
              data-testid="textarea-improvement-suggestions"
              className={attempted && errors.improvementSuggestions ? "border-destructive" : ""}
            />
            <FieldError show={attempted && errors.improvementSuggestions} message="Responda esta pergunta" />
          </CardContent>
        </Card>

        {/* Por que não está jogando tanto */}
        <Card data-testid="survey-card-motivos" className={attempted && errors.reasonNotPlaying ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-primary" />
              Motivos para jogar menos
              <RequiredMark />
            </CardTitle>
            <CardDescription>Por que você não está jogando tanto ultimamente?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Textarea
              placeholder="Ex: trabalho, horário incompatível, motivação, outros jogos..."
              value={reasonNotPlaying}
              onChange={e => setReasonNotPlaying(e.target.value)}
              rows={3}
              data-testid="textarea-reason-not-playing"
              className={attempted && errors.reasonNotPlaying ? "border-destructive" : ""}
            />
            <FieldError show={attempted && errors.reasonNotPlaying} message="Responda esta pergunta" />
          </CardContent>
        </Card>

        {/* O que pode atrair mais pessoas */}
        <Card data-testid="survey-card-atrair" className={attempted && errors.attractMorePlayers ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Atrair mais jogadores
              <RequiredMark />
            </CardTitle>
            <CardDescription>O que podemos fazer para atrair mais pessoas para a comunidade?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Textarea
              placeholder="Ex: divulgação, eventos, torneios, premiações..."
              value={attractMorePlayers}
              onChange={e => setAttractMorePlayers(e.target.value)}
              rows={3}
              data-testid="textarea-attract-more-players"
              className={attempted && errors.attractMorePlayers ? "border-destructive" : ""}
            />
            <FieldError show={attempted && errors.attractMorePlayers} message="Responda esta pergunta" />
          </CardContent>
        </Card>

        {/* O que pode fazer jogar mais */}
        <Card data-testid="survey-card-jogar-mais" className={attempted && errors.playMoreWays ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Para você jogar mais
              <RequiredMark />
            </CardTitle>
            <CardDescription>O que podemos fazer especificamente para que você jogue mais?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Textarea
              placeholder="Ex: mix em horário fixo, mais amigos, missões/desafios, sistema de ranking..."
              value={playMoreWays}
              onChange={e => setPlayMoreWays(e.target.value)}
              rows={3}
              data-testid="textarea-play-more-ways"
              className={attempted && errors.playMoreWays ? "border-destructive" : ""}
            />
            <FieldError show={attempted && errors.playMoreWays} message="Responda esta pergunta" />
          </CardContent>
        </Card>

        {/* Opiniões gerais */}
        <Card data-testid="survey-card-opiniao" className={attempted && errors.generalOpinions ? "border-destructive/50" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-primary" />
              Opiniões gerais
              <RequiredMark />
            </CardTitle>
            <CardDescription>Compartilhe qualquer outra opinião sobre o servidor e a comunidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Textarea
              placeholder="Fique à vontade para escrever o que quiser..."
              value={generalOpinions}
              onChange={e => setGeneralOpinions(e.target.value)}
              rows={4}
              data-testid="textarea-general-opinions"
              className={attempted && errors.generalOpinions ? "border-destructive" : ""}
            />
            <FieldError show={attempted && errors.generalOpinions} message="Responda esta pergunta" />
          </CardContent>
        </Card>

        {/* Nível dos jogadores do servidor influenciou */}
        <Card
          className={`border-2 ${attempted && errors.levelUpInfluenced ? "border-destructive" : "border-primary/30"}`}
          data-testid="survey-card-nivel-influencia"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Pergunta importante</CardTitle>
              <Badge variant="destructive" className="text-xs">Obrigatória</Badge>
            </div>
            <CardDescription className="mt-1.5">
              A subida de nível dos jogadores do servidor influenciou a galera a parar de jogar? Por exemplo, quando os jogadores sobem de nível (FACEIT, GC, Valve) e deixam de jogar no servidor por sentir que ele ficou "fraco" para o nível deles.
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
            <FieldError show={attempted && errors.levelUpInfluenced} message="Selecione Sim ou Não" />

            {levelUpInfluenced === "yes" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Como isso aconteceu? <RequiredMark />
                </Label>
                <Textarea
                  placeholder="Ex: jogadores subiram de nível e acharam o servidor fraco demais, preferiram jogar em plataformas mais competitivas..."
                  value={levelUpInfluencedComment}
                  onChange={e => setLevelUpInfluencedComment(e.target.value)}
                  rows={3}
                  data-testid="textarea-level-up-comment"
                  className={attempted && errors.levelUpInfluencedComment ? "border-destructive" : ""}
                />
                <FieldError show={attempted && errors.levelUpInfluencedComment} message="Explique como isso aconteceu" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enviar */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
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
