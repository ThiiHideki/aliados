import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trophy, Users, ShieldCheck, ShieldAlert, Trash2, Edit2, Shuffle,
  Crown, Calendar, MessageSquare, Tv, Gamepad2, Award,
} from "lucide-react";
import { insertTournament2x2TeamSchema, type Tournament2x2Team, type Tournament2x2Match } from "@shared/schema";
import gloveImg from "@assets/image_1779912156911.png";
import bannerImg from "@assets/Gemini_Generated_Image_wpywlswpywlswpyw_1779912183474.png";

const formSchema = insertTournament2x2TeamSchema.extend({
  teamName: z.string().min(3, "Mínimo 3 caracteres").max(100),
  player1Name: z.string().min(2, "Obrigatório"),
  player1SteamId: z.string().min(3, "Obrigatório"),
  player2Name: z.string().min(2, "Obrigatório"),
  player2SteamId: z.string().min(3, "Obrigatório"),
  contactPhone: z.string().min(8, "Telefone/WhatsApp obrigatório"),
  paymentMethod: z.string().min(1, "Selecione um método"),
});

type FormValues = z.infer<typeof formSchema>;

type BracketMatch = Tournament2x2Match & { team1Name: string | null; team2Name: string | null };

function InfoTab() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <img
          src={bannerImg}
          alt="Copa Inimigos da Bala — Torneio 2x2"
          className="w-full h-auto object-cover"
          data-testid="img-banner"
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-primary" />
            Copa Inimigos da Bala: Torneio 2x2
          </CardTitle>
          <CardDescription className="text-base">
            Bem-vindos ao torneio oficial da comunidade Inimigos da Bala. Preparem suas miras, pois apenas uma dupla será a campeã!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Informações Gerais
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="flex gap-2"><Badge variant="secondary">Formato</Badge> 2x2 (Wingman)</li>
              <li className="flex gap-2"><Badge variant="secondary">Limite</Badge> Máximo de 32 duplas</li>
              <li className="flex gap-2"><Badge variant="secondary">Servidor</Badge> Privado</li>
              <li className="flex gap-2"><Badge variant="secondary">Transmissão</Badge> Canal oficial</li>
              <li className="flex gap-2"><Badge variant="secondary">Inscrição</Badge> R$ 20,00 por dupla</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Premiação
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <img
                src={gloveImg}
                alt="Broken Fang Gloves Jade Field-Tested"
                className="rounded-md border max-w-xs w-full"
                data-testid="img-prize"
              />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-base">★ Broken Fang Gloves | Jade</p>
                <p className="text-muted-foreground">Extraordinary Gloves · Field-Tested</p>
                <Badge variant="default" className="bg-orange-600">Trade Protected</Badge>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Canais oficiais no Discord
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Badge variant="outline">#avisos-torneio</Badge> Comunicados oficiais</li>
              <li><Badge variant="outline">#check-in</Badge> Duplas confirmam presença 1h antes do início</li>
              <li><Badge variant="outline">#tabela-jogos</Badge> Chaveamento atualizado</li>
              <li><Badge variant="outline">#suporte-admins</Badge> Dúvidas rápidas durante as partidas</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

function RegistrationTab() {
  const { toast } = useToast();
  const { data: teams } = useQuery<Tournament2x2Team[]>({ queryKey: ["/api/tournament-2x2/teams"] });
  const fullyBooked = (teams?.length ?? 0) >= 32;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      player1Name: "",
      player1SteamId: "",
      player1Discord: "",
      player2Name: "",
      player2SteamId: "",
      player2Discord: "",
      contactPhone: "",
      paymentMethod: "pix",
      paymentProof: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => apiRequest("POST", "/api/tournament-2x2/teams", values),
    onSuccess: () => {
      toast({ title: "Inscrição enviada!", description: "Aguarde a confirmação do pagamento por um admin." });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-2x2/teams"] });
    },
    onError: async (e: any) => {
      const msg = e?.message ?? "Erro ao cadastrar";
      toast({ title: "Falha na inscrição", description: msg, variant: "destructive" });
    },
  });

  if (fullyBooked) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
          <p className="font-semibold">Inscrições encerradas — limite de 32 duplas atingido.</p>
          <p className="text-sm text-muted-foreground">Acompanhe o chaveamento nas outras abas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inscrição da dupla</CardTitle>
        <CardDescription>
          Preencha as informações da dupla. Após o envio, um admin confirmará sua inscrição assim que validar o pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
            <FormField name="teamName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da dupla *</FormLabel>
                <FormControl><Input data-testid="input-team-name" placeholder="Ex.: Headshot Brothers" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-md border">
                <h4 className="font-semibold text-sm text-muted-foreground">Jogador 1</h4>
                <FormField name="player1Name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nick *</FormLabel>
                    <FormControl><Input data-testid="input-p1-name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="player1SteamId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steam ID / URL *</FormLabel>
                    <FormControl><Input data-testid="input-p1-steam" placeholder="https://steamcommunity.com/id/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="player1Discord" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord</FormLabel>
                    <FormControl><Input data-testid="input-p1-discord" placeholder="usuario#0000" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-3 p-4 rounded-md border">
                <h4 className="font-semibold text-sm text-muted-foreground">Jogador 2</h4>
                <FormField name="player2Name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nick *</FormLabel>
                    <FormControl><Input data-testid="input-p2-name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="player2SteamId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steam ID / URL *</FormLabel>
                    <FormControl><Input data-testid="input-p2-steam" placeholder="https://steamcommunity.com/id/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="player2Discord" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord</FormLabel>
                    <FormControl><Input data-testid="input-p2-discord" placeholder="usuario#0000" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <FormField name="contactPhone" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone / WhatsApp do responsável *</FormLabel>
                <FormControl><Input data-testid="input-contact-phone" placeholder="(11) 99999-9999" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="paymentMethod" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pagamento *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger data-testid="select-payment-method"><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pix">Pix</SelectItem>
                    <SelectItem value="transferencia">Transferência bancária</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro (presencial)</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="paymentProof" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Comprovante de pagamento (link ou descrição)</FormLabel>
                <FormControl>
                  <Textarea
                    data-testid="input-payment-proof"
                    placeholder="Cole o link do comprovante ou descreva (ex.: Pix enviado em 27/05 às 19h)"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="notes" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea data-testid="input-notes" placeholder="Algo que o admin precise saber?" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button
              type="submit"
              size="lg"
              disabled={mutation.isPending}
              data-testid="button-submit-registration"
              className="w-full"
            >
              {mutation.isPending ? "Enviando..." : "Enviar inscrição"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function TeamRow({ team, isAdmin }: { team: Tournament2x2Team; isAdmin: boolean }) {
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState<Partial<Tournament2x2Team>>(team);

  const confirmMut = useMutation({
    mutationFn: async (confirmed: boolean) =>
      apiRequest("POST", `/api/tournament-2x2/teams/${team.id}/confirm`, { confirmed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-2x2/teams"] });
      toast({ title: "Atualizado" });
    },
  });
  const deleteMut = useMutation({
    mutationFn: async () => apiRequest("DELETE", `/api/tournament-2x2/teams/${team.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-2x2/teams"] });
      toast({ title: "Time excluído" });
    },
  });
  const updateMut = useMutation({
    mutationFn: async (data: any) => apiRequest("PATCH", `/api/tournament-2x2/teams/${team.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-2x2/teams"] });
      setEditOpen(false);
      toast({ title: "Salvo" });
    },
  });

  return (
    <Card data-testid={`card-team-${team.id}`} className="hover-elevate">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-base" data-testid={`text-team-name-${team.id}`}>{team.teamName}</span>
              {team.isConfirmed ? (
                <Badge variant="default" className="bg-green-600"><ShieldCheck className="h-3 w-3 mr-1" />Confirmado</Badge>
              ) : (
                <Badge variant="secondary"><ShieldAlert className="h-3 w-3 mr-1" />Pendente</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {team.player1Name} & {team.player2Name}
            </div>
            {isAdmin && (
              <div className="text-xs text-muted-foreground space-y-0.5 mt-2">
                <div>P1: {team.player1SteamId}{team.player1Discord ? ` · ${team.player1Discord}` : ""}</div>
                <div>P2: {team.player2SteamId}{team.player2Discord ? ` · ${team.player2Discord}` : ""}</div>
                <div>Contato: {team.contactPhone} · Pagamento: {team.paymentMethod}</div>
                {team.paymentProof && <div>Comprovante: {team.paymentProof}</div>}
                {team.notes && <div>Obs: {team.notes}</div>}
              </div>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={team.isConfirmed ? "outline" : "default"}
                onClick={() => confirmMut.mutate(!team.isConfirmed)}
                disabled={confirmMut.isPending}
                data-testid={`button-confirm-${team.id}`}
              >
                <ShieldCheck className="h-4 w-4 mr-1" />
                {team.isConfirmed ? "Desconfirmar" : "Confirmar"}
              </Button>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <Button size="sm" variant="outline" onClick={() => { setEdit(team); setEditOpen(true); }} data-testid={`button-edit-${team.id}`}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar dupla</DialogTitle>
                    <DialogDescription>Ajuste os dados informados pela dupla.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Nome da dupla" value={edit.teamName ?? ""} onChange={(e) => setEdit({ ...edit, teamName: e.target.value })} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Nick P1" value={edit.player1Name ?? ""} onChange={(e) => setEdit({ ...edit, player1Name: e.target.value })} />
                      <Input placeholder="Nick P2" value={edit.player2Name ?? ""} onChange={(e) => setEdit({ ...edit, player2Name: e.target.value })} />
                      <Input placeholder="Steam P1" value={edit.player1SteamId ?? ""} onChange={(e) => setEdit({ ...edit, player1SteamId: e.target.value })} />
                      <Input placeholder="Steam P2" value={edit.player2SteamId ?? ""} onChange={(e) => setEdit({ ...edit, player2SteamId: e.target.value })} />
                      <Input placeholder="Discord P1" value={edit.player1Discord ?? ""} onChange={(e) => setEdit({ ...edit, player1Discord: e.target.value })} />
                      <Input placeholder="Discord P2" value={edit.player2Discord ?? ""} onChange={(e) => setEdit({ ...edit, player2Discord: e.target.value })} />
                    </div>
                    <Input placeholder="Contato" value={edit.contactPhone ?? ""} onChange={(e) => setEdit({ ...edit, contactPhone: e.target.value })} />
                    <Input placeholder="Método pagamento" value={edit.paymentMethod ?? ""} onChange={(e) => setEdit({ ...edit, paymentMethod: e.target.value })} />
                    <Textarea placeholder="Comprovante" value={edit.paymentProof ?? ""} onChange={(e) => setEdit({ ...edit, paymentProof: e.target.value })} />
                    <Textarea placeholder="Observações" value={edit.notes ?? ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
                    <Button onClick={() => updateMut.mutate(edit)} disabled={updateMut.isPending} data-testid={`button-save-${team.id}`}>
                      {updateMut.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" data-testid={`button-delete-${team.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir time?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação remove a dupla {team.teamName} e qualquer partida relacionada no chaveamento.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMut.mutate()} data-testid={`button-confirm-delete-${team.id}`}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamsTab() {
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;
  const { data: teams = [], isLoading } = useQuery<Tournament2x2Team[]>({ queryKey: ["/api/tournament-2x2/teams"] });

  const confirmed = teams.filter((t) => t.isConfirmed).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold" data-testid="text-team-count">{teams.length} / 32 duplas</span>
              </div>
              <Badge variant="default" className="bg-green-600">
                <ShieldCheck className="h-3 w-3 mr-1" /> {confirmed} confirmadas
              </Badge>
              <Badge variant="secondary">
                <ShieldAlert className="h-3 w-3 mr-1" /> {teams.length - confirmed} pendentes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma dupla cadastrada ainda. Seja a primeira!
          </CardContent>
        </Card>
      ) : (
        teams.map((t) => <TeamRow key={t.id} team={t} isAdmin={isAdmin} />)
      )}
    </div>
  );
}

function MatchCard({ m, isAdmin }: { m: BracketMatch; isAdmin: boolean }) {
  const { toast } = useToast();
  const [s1, setS1] = useState<string>(m.score1?.toString() ?? "");
  const [s2, setS2] = useState<string>(m.score2?.toString() ?? "");

  const updateMut = useMutation({
    mutationFn: async (winnerId: number | null) =>
      apiRequest("PATCH", `/api/tournament-2x2/matches/${m.id}`, {
        score1: s1 === "" ? null : Number(s1),
        score2: s2 === "" ? null : Number(s2),
        winnerId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-2x2/bracket"] });
      toast({ title: "Partida atualizada" });
    },
  });

  const t1Won = m.winnerId != null && m.winnerId === m.team1Id;
  const t2Won = m.winnerId != null && m.winnerId === m.team2Id;

  return (
    <Card className="min-w-[220px]" data-testid={`card-match-${m.id}`}>
      <CardContent className="py-3 space-y-2">
        <div className={`flex items-center justify-between gap-2 ${t1Won ? "font-semibold text-green-500" : ""}`}>
          <span className="truncate text-sm">{m.team1Name ?? "—"}</span>
          {isAdmin ? (
            <Input value={s1} onChange={(e) => setS1(e.target.value)} className="w-14 h-7" placeholder="0" data-testid={`input-score1-${m.id}`} />
          ) : (
            <span className="text-sm tabular-nums">{m.score1 ?? "-"}</span>
          )}
        </div>
        <div className={`flex items-center justify-between gap-2 ${t2Won ? "font-semibold text-green-500" : ""}`}>
          <span className="truncate text-sm">{m.team2Name ?? "—"}</span>
          {isAdmin ? (
            <Input value={s2} onChange={(e) => setS2(e.target.value)} className="w-14 h-7" placeholder="0" data-testid={`input-score2-${m.id}`} />
          ) : (
            <span className="text-sm tabular-nums">{m.score2 ?? "-"}</span>
          )}
        </div>
        {isAdmin && m.team1Id != null && m.team2Id != null && (
          <div className="flex gap-1 pt-1">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => updateMut.mutate(m.team1Id!)} data-testid={`button-win-t1-${m.id}`}>
              Vence 1
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => updateMut.mutate(m.team2Id!)} data-testid={`button-win-t2-${m.id}`}>
              Vence 2
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BracketTab() {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;
  const { data: matches = [], isLoading } = useQuery<BracketMatch[]>({ queryKey: ["/api/tournament-2x2/bracket"] });

  const drawMut = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/tournament-2x2/bracket/draw"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournament-2x2/bracket"] });
      toast({ title: "Chaveamento sorteado" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e?.message, variant: "destructive" }),
  });

  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  const roundLabel = (r: number, total: number) => {
    const fromEnd = total - r;
    if (fromEnd === 0) return "Final";
    if (fromEnd === 1) return "Semifinal";
    if (fromEnd === 2) return "Quartas";
    if (fromEnd === 3) return "Oitavas";
    if (fromEnd === 4) return "16-avos";
    return `Rodada ${r}`;
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Card>
          <CardContent className="py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-muted-foreground">
              Apenas duplas confirmadas entram no sorteio. Sortear novamente substitui o chaveamento atual.
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button data-testid="button-draw-bracket"><Shuffle className="h-4 w-4 mr-1" /> Sortear chaveamento</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sortear chaveamento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso substitui o chaveamento atual e zera todos os resultados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => drawMut.mutate()} data-testid="button-confirm-draw">Sortear</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <Crown className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Chaveamento ainda não foi sorteado.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {rounds.map((r) => (
              <div key={r} className="flex flex-col gap-3 min-w-[240px]">
                <h4 className="font-semibold text-sm text-center text-muted-foreground">
                  {roundLabel(r, rounds.length)}
                </h4>
                {matches.filter((m) => m.round === r).map((m) => (
                  <MatchCard key={m.id} m={m} isAdmin={isAdmin} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Torneio2x2() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-page-title">
            Copa Inimigos da Bala: Torneio 2x2
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de duplas, lista de inscritos e chaveamento do torneio.
          </p>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="info" data-testid="tab-info"><Tv className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Informações</span></TabsTrigger>
          <TabsTrigger value="inscricao" data-testid="tab-inscricao"><Calendar className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Inscrição</span></TabsTrigger>
          <TabsTrigger value="times" data-testid="tab-times"><Users className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Times</span></TabsTrigger>
          <TabsTrigger value="bracket" data-testid="tab-bracket"><Crown className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Chaveamento</span></TabsTrigger>
        </TabsList>
        <TabsContent value="info"><InfoTab /></TabsContent>
        <TabsContent value="inscricao"><RegistrationTab /></TabsContent>
        <TabsContent value="times"><TeamsTab /></TabsContent>
        <TabsContent value="bracket"><BracketTab /></TabsContent>
      </Tabs>
    </div>
  );
}
