import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Trophy, Users, Plus, Trash2, Copy, CheckCircle, Upload,
  UserPlus, Shield, Star, Swords, AlertCircle, ExternalLink, Calendar
} from "lucide-react";
import type { CopaTeam, CopaPlayer } from "@shared/schema";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

const PIX_PHONE = "12982690148";
const PIX_OWNER = "Adilson";
const REGISTRATION_FEE = 50;
const TOURNAMENT_DATE = "18 de Abril de 2026";
const TOURNAMENT_START_TIME = "14:00";
const REGISTRATION_DEADLINE = "18/04/2026 às 12:00";
const POSITIONS = ["IGL","AWPer","Rifler","Entry Fragger","Lurker","Support"];

type PlayerForm = {
  playerName: string; steamProfile: string; age: string;
  position: string; gcLevel: string; faceitLevel: string; isLeader: boolean;
};

const emptyPlayer = (): PlayerForm => ({
  playerName: "", steamProfile: "", age: "", position: "",
  gcLevel: "", faceitLevel: "", isLeader: false,
});

function PlayerCard({
  player, index, total,
  onChange, onRemove,
}: {
  player: PlayerForm; index: number; total: number;
  onChange: (idx: number, field: keyof PlayerForm, val: string | boolean) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <Card className="border-border/60 bg-muted/20" data-testid={`player-card-${index}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{index + 1}</span>
            </div>
            <div>
              <p className="font-semibold text-sm">{player.playerName || `Jogador ${index + 1}`}</p>
              {index === 0 && <p className="text-xs text-muted-foreground">Líder do time</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {index === 0 && <Badge variant="secondary" className="text-xs"><Shield className="h-3 w-3 mr-1" />Líder</Badge>}
            {total > 1 && index > 0 && (
              <Button size="icon" variant="ghost" onClick={() => onRemove(index)} data-testid={`remove-player-${index}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Nome / Nickname *</Label>
            <Input
              placeholder="Seu nickname no CS2"
              value={player.playerName}
              onChange={e => onChange(index, "playerName", e.target.value)}
              data-testid={`input-player-name-${index}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Perfil Steam *</Label>
            <Input
              placeholder="https://steamcommunity.com/id/..."
              value={player.steamProfile}
              onChange={e => onChange(index, "steamProfile", e.target.value)}
              data-testid={`input-steam-profile-${index}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Idade *</Label>
            <Input
              type="number" min="12" max="60" placeholder="Idade"
              value={player.age}
              onChange={e => onChange(index, "age", e.target.value)}
              data-testid={`input-player-age-${index}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Posição *</Label>
            <Select value={player.position} onValueChange={v => onChange(index, "position", v)}>
              <SelectTrigger data-testid={`select-position-${index}`}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nível GC (0 = sem conta)</Label>
            <Select value={player.gcLevel} onValueChange={v => onChange(index, "gcLevel", v)}>
              <SelectTrigger data-testid={`select-gc-${index}`}>
                <SelectValue placeholder="GC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sem conta GC</SelectItem>
                {Array.from({length:21},(_,i)=>i+1).map(n => (
                  <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nível FACEIT (0 = sem conta)</Label>
            <Select value={player.faceitLevel} onValueChange={v => onChange(index, "faceitLevel", v)}>
              <SelectTrigger data-testid={`select-faceit-${index}`}>
                <SelectValue placeholder="FACEIT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sem conta FACEIT</SelectItem>
                {Array.from({length:10},(_,i)=>i+1).map(n => (
                  <SelectItem key={n} value={String(n)}>Nível {n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CopaInscricao() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderContact, setLeaderContact] = useState("");
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [paymentProofName, setPaymentProofName] = useState("");
  const [players, setPlayers] = useState<PlayerForm[]>([emptyPlayer()]);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const playerData = players.map((p, i) => ({
        playerName: p.playerName,
        steamProfile: p.steamProfile,
        age: parseInt(p.age) || 0,
        position: p.position,
        gcLevel: p.gcLevel ? parseInt(p.gcLevel) : null,
        faceitLevel: p.faceitLevel ? parseInt(p.faceitLevel) : null,
        isLeader: i === 0,
        playerOrder: i,
      }));
      return apiRequest("POST", "/api/copa/teams", {
        teamName, leaderName, leaderContact, paymentProof, players: playerData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copa/teams"] });
      setSubmitted(true);
      toast({ title: "Inscrição enviada!", description: "Aguarde a confirmação do pagamento pelos admins." });
    },
    onError: (e: any) => {
      toast({ title: "Erro", description: e.message || "Erro ao enviar inscrição", variant: "destructive" });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProof(reader.result as string);
      setPaymentProofName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_PHONE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addPlayer = () => {
    if (players.length >= 6) return;
    setPlayers(prev => [...prev, emptyPlayer()]);
  };

  const removePlayer = (idx: number) => {
    setPlayers(prev => prev.filter((_, i) => i !== idx));
  };

  const updatePlayer = (idx: number, field: keyof PlayerForm, val: string | boolean) => {
    setPlayers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const canSubmit = teamName.trim() && leaderName.trim() && leaderContact.trim() &&
    players.every(p => p.playerName.trim() && p.steamProfile.trim() && p.age && p.position);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 border-green-500/40 bg-green-500/5">
          <CardContent className="pt-10 pb-10 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Inscrição Enviada!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Sua inscrição foi recebida. Após verificação do comprovante de pagamento, um admin confirmará sua participação.
            </p>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
              <strong>Próximos passos:</strong> Aguarde o contato dos organizadores via {leaderContact}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-40">
        <img src={copaImg} alt="Copa Inimigos da Bala" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-black text-white">Copa Inimigos da Bala</h1>
          <p className="text-blue-300 text-sm font-medium">Inscrição de Times</p>
        </div>
      </div>

      {/* Deadline warning */}
      <Card className="border-red-500/40 bg-red-500/5">
        <CardContent className="pt-3 pb-3 flex items-center gap-3 flex-wrap">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-bold text-red-400">Prazo de inscrição:</span>{" "}
            <span>{REGISTRATION_DEADLINE}</span>
            <span className="text-muted-foreground"> · Jogos iniciam às {TOURNAMENT_START_TIME} do mesmo dia</span>
          </div>
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Calendar, label: "Data dos Jogos", value: "18/04 às 14:00" },
          { icon: Trophy, label: "Taxa", value: "R$ 50,00" },
          { icon: Swords, label: "Formato", value: "Mata-Mata" },
          { icon: Users, label: "Time", value: "Até 6 jogadores" },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="bg-muted/30">
            <CardContent className="pt-3 pb-3 text-center">
              <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prizes preview */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-bold text-yellow-500">Premiação:</span>{" "}
              <span>60% do arrecadado para o 1° e 20% para o 2°.</span>{" "}
              <span className="text-muted-foreground">Valor final depende da quantidade de times inscritos.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment section */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Pagamento da Inscrição — R$ {REGISTRATION_FEE},00
          </CardTitle>
          <CardDescription>Faça o PIX e anexe o comprovante abaixo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">PIX · Celular</p>
              <p className="font-mono font-bold text-sm">{PIX_PHONE}</p>
              <p className="text-xs text-muted-foreground">Titular: {PIX_OWNER}</p>
            </div>
            <Button size="icon" variant="outline" onClick={copyPix} data-testid="button-copy-pix">
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
              ${paymentProof ? "border-green-500/60 bg-green-500/5" : "border-border hover:border-primary/50"}`}
            onClick={() => fileRef.current?.click()}
            data-testid="upload-proof-area"
          >
            {paymentProof ? (
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{paymentProofName}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Clique para anexar o comprovante (JPG/PNG, máx 5MB)</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} data-testid="input-payment-proof" />
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>A inscrição só é confirmada após verificação do pagamento pelos administradores.</span>
          </div>
        </CardContent>
      </Card>

      {/* Team info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Dados do Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome do Time *</Label>
            <Input
              placeholder="Ex: Team Fúria, Los Inimigos..."
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              data-testid="input-team-name"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nome do Líder/Capitão *</Label>
              <Input
                placeholder="Nome ou nickname"
                value={leaderName}
                onChange={e => setLeaderName(e.target.value)}
                data-testid="input-leader-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contato (WhatsApp / Email) *</Label>
              <Input
                placeholder="(11) 99999-9999 ou email"
                value={leaderContact}
                onChange={e => setLeaderContact(e.target.value)}
                data-testid="input-leader-contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-bold">Jogadores do Time</h2>
            <p className="text-sm text-muted-foreground">Mínimo 1, máximo 6 jogadores. O primeiro é o líder.</p>
          </div>
          <Badge variant="secondary">{players.length}/6</Badge>
        </div>

        {players.map((player, idx) => (
          <PlayerCard
            key={idx} player={player} index={idx} total={players.length}
            onChange={updatePlayer} onRemove={removePlayer}
          />
        ))}

        {players.length < 6 && (
          <Button variant="outline" className="w-full" onClick={addPlayer} data-testid="button-add-player">
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Jogador ({players.length}/6)
          </Button>
        )}
      </div>

      {/* Info before submit */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-4 pb-4 space-y-2">
          {[
            "Servidor com Anti-Cheat ativo",
            "Admins presentes em todas as partidas",
            "Formato Mata-Mata com sorteio dos adversários",
            "Transmissão ao vivo das partidas",
          ].map(info => (
            <div key={info} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <span>{info}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        className="w-full" size="lg"
        onClick={() => submitMutation.mutate()}
        disabled={!canSubmit || submitMutation.isPending}
        data-testid="button-submit-registration"
      >
        {submitMutation.isPending
          ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          : <Trophy className="h-4 w-4 mr-2" />}
        Enviar Inscrição
      </Button>
    </div>
  );
}
