import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ClipboardList, Users, Clock, Star, Search, ChevronDown, ChevronRight } from "lucide-react";
import type { Survey, User } from "@shared/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type SurveyWithUser = Survey & { user: User | undefined };

const HOURS_LABEL: Record<string, string> = {};

function PlayerName(u: User | undefined) {
  return u?.nickname || u?.firstName || "Jogador";
}

function HourBadge({ hour }: { hour: string }) {
  return <Badge variant="outline" className="text-xs font-mono">{hour}</Badge>;
}

function LevelBadge({ value, max }: { value: number | null; max: number }) {
  if (!value) return <span className="text-muted-foreground text-sm">—</span>;
  const pct = (value / max) * 100;
  const color = pct >= 75 ? "text-green-500" : pct >= 40 ? "text-yellow-500" : "text-red-400";
  return <span className={`font-mono font-bold ${color}`}>{value}</span>;
}

function SurveyCard({ survey }: { survey: SurveyWithUser }) {
  const [open, setOpen] = useState(false);
  const u = survey.user;
  const name = PlayerName(u);

  const hasYes = survey.levelUpInfluenced === "yes";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="hover-elevate" data-testid={`survey-card-${survey.userId}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={u?.profileImageUrl || undefined} />
                  <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold leading-none">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(survey.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {survey.faceitLevel ? <Badge variant="secondary" className="text-xs">FACEIT {survey.faceitLevel}</Badge> : null}
                {survey.gcLevel ? <Badge variant="secondary" className="text-xs">GC {survey.gcLevel}</Badge> : null}
                {hasYes && (
                  <Badge variant="destructive" className="text-xs">Nível influenciou</Badge>
                )}
                {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="border-t pt-4 space-y-4">
              {/* Horários */}
              {(survey.bestPlayTimes?.length ?? 0) > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Melhores horários</p>
                  <div className="flex flex-wrap gap-1">
                    {(survey.bestPlayTimes || []).sort().map(h => <HourBadge key={h} hour={h} />)}
                  </div>
                </div>
              )}

              {/* Níveis */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-muted/40 space-y-1">
                  <p className="text-xs text-muted-foreground">FACEIT</p>
                  <LevelBadge value={survey.faceitLevel} max={10} />
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/40 space-y-1">
                  <p className="text-xs text-muted-foreground">GC</p>
                  <LevelBadge value={survey.gcLevel} max={21} />
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/40 space-y-1">
                  <p className="text-xs text-muted-foreground">Valve</p>
                  <p className="text-xs font-medium">{survey.valveLevel || "—"}</p>
                </div>
              </div>

              {/* Text fields */}
              {[
                { label: "Melhorias no servidor", value: survey.improvementSuggestions },
                { label: "Motivos para jogar menos", value: survey.reasonNotPlaying },
                { label: "Para atrair mais jogadores", value: survey.attractMorePlayers },
                { label: "Para você jogar mais", value: survey.playMoreWays },
                { label: "Opiniões gerais", value: survey.generalOpinions },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label} className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-sm leading-relaxed bg-muted/30 rounded-lg p-3">{value}</p>
                  </div>
                ) : null
              )}

              {/* Nível influenciou */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Nível influenciou a parar de jogar?
                </p>
                <div className="flex items-start gap-2">
                  <Badge variant={hasYes ? "destructive" : "secondary"}>
                    {hasYes ? "Sim" : "Não"}
                  </Badge>
                  {hasYes && survey.levelUpInfluencedComment && (
                    <p className="text-sm leading-relaxed bg-muted/30 rounded-lg p-3 flex-1">
                      {survey.levelUpInfluencedComment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function AdminPesquisa() {
  const [search, setSearch] = useState("");

  const { data: surveys = [], isLoading } = useQuery<SurveyWithUser[]>({
    queryKey: ["/api/admin/surveys"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/admin/surveys");
      if (!res.ok) throw new Error("Erro ao buscar pesquisas");
      return res.json();
    },
  });

  const filtered = surveys.filter(s => {
    const name = PlayerName(s.user).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const totalYes = surveys.filter(s => s.levelUpInfluenced === "yes").length;
  const totalNo = surveys.filter(s => s.levelUpInfluenced === "no").length;

  const avgFaceit = surveys.filter(s => s.faceitLevel).length > 0
    ? (surveys.reduce((a, s) => a + (s.faceitLevel || 0), 0) / surveys.filter(s => s.faceitLevel).length).toFixed(1)
    : "—";
  const avgGc = surveys.filter(s => s.gcLevel).length > 0
    ? (surveys.reduce((a, s) => a + (s.gcLevel || 0), 0) / surveys.filter(s => s.gcLevel).length).toFixed(1)
    : "—";

  const hourCounts: Record<string, number> = {};
  surveys.forEach(s => {
    (s.bestPlayTimes || []).forEach(h => {
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
  });
  const topHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Pesquisas da Comunidade</h1>
          <p className="text-muted-foreground">Respostas dos jogadores</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card data-testid="stat-total-surveys">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold font-mono">{surveys.length}</p>
                <p className="text-xs text-muted-foreground">Respostas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-level-yes">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Star className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-destructive">{totalYes}</p>
                <p className="text-xs text-muted-foreground">Nível influenciou</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-avg-faceit">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{avgFaceit}</p>
                <p className="text-xs text-muted-foreground">Média FACEIT</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-avg-gc">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Star className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{avgGc}</p>
                <p className="text-xs text-muted-foreground">Média GC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {topHours.length > 0 && (
        <Card data-testid="card-top-hours">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" />
              Horários mais populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topHours.map(([hour, count]) => (
                <div key={hour} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="font-mono font-bold text-sm text-primary">{hour}</span>
                  <Badge variant="secondary" className="text-xs">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-surveys"
        />
        {search && (
          <span className="text-sm text-muted-foreground">{filtered.length} resultado(s)</span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{search ? "Nenhum resultado encontrado." : "Nenhuma pesquisa respondida ainda."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
            <SurveyCard key={s.id} survey={s} />
          ))}
        </div>
      )}
    </div>
  );
}
