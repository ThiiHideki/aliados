import { writeFileSync, existsSync } from "fs";
import { sendNewsNotification, isDiscordReady } from "./discord";

const FLAG_FILE = "/home/runner/workspace/.initial_notifications_sent";
const NEWS_CHANNEL = process.env.DISCORD_NEWS_CHANNEL_ID || "";

const notifications = [
  {
    title: "Pesquisa da Comunidade — Precisamos da sua opinião!",
    body: [
      "Estamos fazendo uma **pesquisa rápida** para entender melhor os nossos jogadores e melhorar a comunidade!",
      "",
      "🕐 **Melhores horários para jogar**",
      "🎮 **Nível no FACEIT, GC e matchmaking da Valve**",
      "💬 **Sugestões de melhoria e o que te faria jogar mais com a gente**",
      "",
      "A pesquisa leva menos de 2 minutos e é **obrigatória** para acessar o site. As respostas ajudam muito a organização!",
      "",
      "👉 Acesse o site e responda antes de continuar.",
    ].join("\n"),
  },
  {
    title: "Copa Aliados — Inscrições Abertas!",
    body: [
      "A primeira edição da **Copa Aliados** está chegando! Forme seu time e venha competir!",
      "",
      "**💰 Taxa de inscrição:** R$ 50,00 por time (via PIX)",
      "**🏅 Premiação:** 80% do valor arrecadado",
      "   • 🥇 1º lugar — 60% do prêmio total",
      "   • 🥈 2º lugar — 20% do prêmio total",
      "",
      "**📋 Como se inscrever:**",
      "1. Site → Copa Aliados → Inscrição",
      "2. Preencha os dados do time",
      "3. Pague via PIX e envie o comprovante",
      "4. Aguarde a aprovação da organização",
      "",
      "Confira o chaveamento, estatísticas, premiações e as **regras completas** no menu da Copa!",
    ].join("\n"),
  },
  {
    title: "Discord + Site — Tudo Conectado!",
    body: [
      "O nosso site agora está **integrado com o Discord**! Veja como funciona:",
      "",
      "**📋 Lista do Mix — Como entrar pelo Discord:**",
      "1. O admin abre a lista para o dia no site",
      "2. Uma notificação aparece no canal **#🔫-lista-mix🔫** com um botão",
      "3. Você clica em **\"Entrar no Mix\"** direto pelo Discord",
      "4. Sua vaga é reservada automaticamente — sem abrir o site!",
      "",
      "**⚠️ Pré-requisito:** Vincule seu ID do Discord no site:",
      "   Site → **Vincular Discord** → cole seu ID numérico (17 dígitos)",
      "",
      "**📣 Este canal** receberá novidades do site, recursos, Copa e eventos da comunidade.",
      "",
      "**❓ Como pegar seu ID do Discord:**",
      "• Configurações → Avançado → ative **Modo Desenvolvedor**",
      "• Clique com o botão direito no seu perfil → **Copiar ID do usuário**",
    ].join("\n"),
  },
];

async function waitForBot(maxWaitMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (isDiscordReady()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

export async function sendInitialNotificationsIfNeeded(): Promise<void> {
  if (!NEWS_CHANNEL) {
    console.log("[InitNotif] DISCORD_NEWS_CHANNEL_ID não configurado. Pulando.");
    return;
  }

  if (existsSync(FLAG_FILE)) {
    console.log("[InitNotif] Notificações iniciais já foram enviadas. Pulando.");
    return;
  }

  console.log("[InitNotif] Aguardando bot Discord ficar pronto...");
  const botReady = await waitForBot(30000);

  if (!botReady) {
    console.warn("[InitNotif] Bot não ficou pronto a tempo. Notificações iniciais não enviadas.");
    return;
  }

  console.log("[InitNotif] Enviando 3 notificações iniciais para o canal de novidades...");

  let allOk = true;
  for (const notif of notifications) {
    const result = await sendNewsNotification(notif.title, notif.body, false, NEWS_CHANNEL);
    if (result.ok) {
      console.log(`[InitNotif] Enviado: "${notif.title}"`);
    } else {
      console.error(`[InitNotif] Falha ao enviar "${notif.title}":`, result.error);
      allOk = false;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (allOk) {
    try {
      writeFileSync(FLAG_FILE, new Date().toISOString());
      console.log("[InitNotif] Flag gravada. Não vai reenviar nas próximas inicializações.");
    } catch (e) {
      console.warn("[InitNotif] Não foi possível gravar flag file:", e);
    }
  }
}
