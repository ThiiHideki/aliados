import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, UserX, Ban, CreditCard, Clock, Trophy, DollarSign, AlertTriangle, CheckCircle2, Swords, Scale
} from "lucide-react";
import copaImg from "@assets/Gemini_Generated_Image_cwonr5cwonr5cwon_1774910925811.png";

interface Rule {
  id: number;
  title: string;
  body: string[];
  icon: React.ReactNode;
  severity?: "critical" | "warning" | "info";
}

const rules: Rule[] = [
  {
    id: 1,
    title: "W.O. por Falta de Jogadores",
    icon: <UserX className="h-5 w-5" />,
    severity: "warning",
    body: [
      "Cada time deve apresentar no mínimo 5 jogadores no horário marcado para a partida.",
      "Será concedida uma tolerância de 15 minutos após o horário oficial para que o time complete o elenco.",
      "Esgotado o prazo sem a presença dos 5 jogadores, a partida será declarada W.O. (walkover) e a vitória concedida ao time adversário por 2 rounds a 0 (ou 2 mapas a 0 em fase de grupos/playoffs).",
      "Em caso de W.O. duplo (ambos os times ausentes), ambos são eliminados da rodada sem direito a reclassificação.",
    ],
  },
  {
    id: 2,
    title: "Desqualificação por Ofensas e Injúrias",
    icon: <Ban className="h-5 w-5" />,
    severity: "critical",
    body: [
      "Qualquer jogador que proferir ofensas graves, discurso de ódio, injúrias de natureza racial, étnica, religiosa ou de gênero — seja por chat de voz, chat de texto ou qualquer canal da comunidade — estará sujeito à desqualificação imediata.",
      "A desqualificação pode ser individual (o jogador é banido das próximas edições) ou coletiva (o time é eliminado do torneio), a critério da organização.",
      "A organização se reserva o direito de analisar provas (prints, gravações, logs) antes de aplicar a punição.",
      "Comportamento tóxico reiterado, mesmo sem palavrões graves, também pode resultar em advertência e, na reincidência, em desqualificação.",
    ],
  },
  {
    id: 3,
    title: "Desqualificação por Trapaça (Cheating)",
    icon: <Shield className="h-5 w-5" />,
    severity: "critical",
    body: [
      "O uso de qualquer software de trapaça (aimbot, wallhack, ESP, scripts, macros que concedam vantagem indevida etc.) é estritamente proibido.",
      "Jogadores identificados com ban ativo no VAC, FACEIT AC, ou qualquer outro sistema anti-cheat reconhecido não poderão participar do torneio.",
      "Suspeitas de trapaça devem ser reportadas à organização com evidências (POV, demo, timestamps). Denúncias sem fundamento serão ignoradas.",
      "Confirmada a trapaça, o jogador é banido permanentemente de todas as edições da Copa Aliados, e o time poderá ser desclassificado conforme avaliação da organização.",
    ],
  },
  {
    id: 4,
    title: "Não Inscrição por Falta de Pagamento",
    icon: <CreditCard className="h-5 w-5" />,
    severity: "warning",
    body: [
      "A inscrição no torneio só será confirmada após o pagamento integral da taxa de inscrição (R$ 50,00 por time) e o envio do comprovante aprovado pela organização.",
      "Times com pagamento pendente não terão seu nome publicado no chaveamento nem poderão disputar partidas.",
      "Em caso de pagamento recusado ou comprovante inválido, o time terá 48 horas para regularizar a situação ou perderá a vaga.",
      "Times que não regularizarem o pagamento dentro do prazo poderão ser substituídos por times da lista de espera.",
    ],
  },
  {
    id: 5,
    title: "Encerramento das Inscrições",
    icon: <Clock className="h-5 w-5" />,
    severity: "info",
    body: [
      "As inscrições encerram na data e horário divulgados oficialmente pela organização no Discord e no Mural do site.",
      "Após o encerramento, nenhuma nova inscrição será aceita, independentemente de motivo.",
      "Times que enviarem o comprovante de pagamento após o prazo não terão a inscrição processada e deverão aguardar a próxima edição.",
      "A organização pode encerrar as inscrições antecipadamente caso o número máximo de vagas seja atingido.",
    ],
  },
  {
    id: 6,
    title: "Regras da Premiação",
    icon: <Trophy className="h-5 w-5" />,
    severity: "info",
    body: [
      "O prêmio total é composto por 80% do valor arrecadado com as inscrições. Os outros 20% cobrem custos operacionais do torneio.",
      "A distribuição do prêmio é: 1º lugar recebe 60% do prêmio total, 2º lugar recebe 20% do prêmio total.",
      "O valor final do prêmio será divulgado após o encerramento das inscrições, com base no número de times confirmados.",
      "Caso o torneio seja cancelado antes do início das partidas por motivo de força maior, os valores serão devolvidos integralmente. Cancelamentos após o início não garantem reembolso.",
    ],
  },
  {
    id: 7,
    title: "Pagamento da Premiação",
    icon: <DollarSign className="h-5 w-5" />,
    severity: "info",
    body: [
      "O pagamento da premiação será realizado via PIX em até 7 dias corridos após a final do torneio.",
      "O responsável pelo time deve informar à organização a chave PIX ou conta bancária para recebimento antes do início das partidas finais.",
      "O prêmio será pago ao representante (capitão) do time. A distribuição interna entre os membros é de responsabilidade do próprio time.",
      "Em caso de discrepância nos dados bancários ou atraso na entrega das informações, o prazo de pagamento poderá ser estendido sem penalidade à organização.",
    ],
  },
  {
    id: 8,
    title: "Desqualificação sem Reembolso",
    icon: <AlertTriangle className="h-5 w-5" />,
    severity: "critical",
    body: [
      "Times desclassificados por infração às regras (trapaça, ofensas, W.O. por ausência injustificada etc.) não terão direito a reembolso da taxa de inscrição.",
      "O valor pago é destinado ao prêmio e aos custos do torneio; por isso, a desclassificação não desfaz a contribuição realizada.",
      "Esta regra vale inclusive para desclassificações ocorridas antes do início das partidas do time, desde que a infração seja comprovada.",
      "Casos excepcionais (ex.: emergência médica grave devidamente documentada) poderão ser avaliados individualmente pela organização, sem garantia de reembolso.",
    ],
  },
];

const severityStyles: Record<string, string> = {
  critical: "border-red-500/40 bg-red-500/5",
  warning:  "border-orange-500/40 bg-orange-500/5",
  info:     "border-border",
};

const severityBadge: Record<string, { label: string; className: string }> = {
  critical: { label: "Eliminatório",   className: "bg-red-500/20 text-red-400 border-red-500/30" },
  warning:  { label: "Importante",     className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  info:     { label: "Informativo",    className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

const iconStyles: Record<string, string> = {
  critical: "text-red-400",
  warning:  "text-orange-400",
  info:     "text-primary",
};

export default function CopaRegras() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header image */}
      <div className="relative h-44 overflow-hidden">
        <img src={copaImg} alt="Copa Aliados" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
          <div className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-black text-white tracking-tight">Regras do Campeonato</h1>
          </div>
          <p className="text-white/80 text-sm max-w-md">
            Copa Aliados — Leia com atenção antes de se inscrever.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Intro card */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">Ao se inscrever, você concorda com todas as regras abaixo.</p>
                <p className="text-xs text-muted-foreground">
                  A organização se reserva o direito de alterar ou complementar estas regras a qualquer momento, comunicando as mudanças no Discord oficial.
                  Dúvidas podem ser tiradas com os administradores antes do início do torneio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        {rules.map((rule) => {
          const sev = rule.severity || "info";
          const badge = severityBadge[sev];
          return (
            <Card key={rule.id} className={`border ${severityStyles[sev]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                  <span className={iconStyles[sev]}>{rule.icon}</span>
                  <span className="flex-1">{`${rule.id}. ${rule.title}`}</span>
                  <Badge variant="outline" className={`text-xs ${badge.className}`}>
                    {badge.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rule.body.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {/* Footer note */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex gap-3 items-start">
              <Swords className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">Decisões da Organização são finais</p>
                <p className="text-xs text-muted-foreground">
                  Em situações não previstas nestas regras, a organização da Copa Aliados tomará a decisão que julgar mais justa para o torneio,
                  comunicando as partes envolvidas. Não cabe recurso após decisão definitiva.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
