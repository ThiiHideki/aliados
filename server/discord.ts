import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Interaction, ButtonInteraction } from "discord.js";
import { storage } from "./storage";

let client: Client | null = null;
let ready = false;
let lastError: string | null = null;
let botApplicationId: string | null = null;

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || "";

export function getDiscordClient(): Client | null {
  return client;
}

export function isDiscordReady(): boolean {
  return ready;
}

export function getLastError(): string | null {
  return lastError;
}

async function handleMixJoin(interaction: ButtonInteraction, date: string) {
  await interaction.deferReply({ ephemeral: true });

  const discordUserId = interaction.user.id;

  try {
    const user = await storage.getUserByDiscordId(discordUserId);

    if (!user) {
      await interaction.editReply({
        content: "❌ Seu Discord ainda não está vinculado ao site. Acesse o site e vá em **Vincular Discord** para conectar sua conta.",
      });
      return;
    }

    const existingList = await storage.getMixList(date);
    const alreadyIn = existingList.some((entry: any) => entry.userId === user.id);

    if (alreadyIn) {
      await interaction.editReply({
        content: `✅ Você já está na lista do mix de **${formatDate(date)}**!`,
      });
      return;
    }

    await storage.joinMixList(user.id, date, false);

    const displayName = user.nickname || user.firstName || "Jogador";
    await interaction.editReply({
      content: `✅ **${displayName}**, você entrou na lista do mix de **${formatDate(date)}**! Boa sorte!`,
    });
  } catch (err: any) {
    console.error("Discord mix join error:", err);
    await interaction.editReply({
      content: "❌ Erro ao entrar na lista. Tente pelo site.",
    });
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export async function initDiscordBot(): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    lastError = "Token não configurado";
    console.log("[Discord] Token não configurado. Bot não iniciado.");
    return;
  }

  client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, (c) => {
    ready = true;
    lastError = null;
    botApplicationId = c.application?.id || c.user.id;
    console.log(`[Discord] Bot conectado como ${c.user.tag} (ID: ${botApplicationId})`);
    console.log(`[Discord] Canal ID configurado: ${CHANNEL_ID}`);

    // Test channel access on startup
    if (CHANNEL_ID) {
      c.channels.fetch(CHANNEL_ID)
        .then((ch) => {
          if (ch) {
            console.log(`[Discord] Canal encontrado: #${(ch as any).name || CHANNEL_ID}`);
          } else {
            console.warn(`[Discord] Canal ${CHANNEL_ID} não encontrado.`);
            lastError = `Canal ${CHANNEL_ID} não encontrado. Verifique se o bot está no servidor.`;
          }
        })
        .catch((err) => {
          console.error(`[Discord] Erro ao acessar canal ${CHANNEL_ID}:`, err.message);
          lastError = `Sem acesso ao canal: ${err.message}`;
        });
    }
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const btnInteraction = interaction as ButtonInteraction;
    const { customId } = btnInteraction;

    if (customId.startsWith("mix_join_")) {
      const date = customId.replace("mix_join_", "");
      await handleMixJoin(btnInteraction, date);
    }
  });

  client.on(Events.Error, (err) => {
    console.error("[Discord] Erro do cliente:", err);
    lastError = err.message;
  });

  try {
    await client.login(token);
  } catch (err: any) {
    console.error("[Discord] Falha ao conectar:", err.message);
    lastError = err.message;
    client = null;
  }
}

export async function sendMixNotification(date: string, extraMessage?: string): Promise<{ ok: boolean; error?: string }> {
  if (!client || !ready) {
    return { ok: false, error: lastError || "Bot não conectado" };
  }

  if (!CHANNEL_ID) {
    return { ok: false, error: "ID do canal não configurado (DISCORD_CHANNEL_ID)" };
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      return { ok: false, error: `Canal ${CHANNEL_ID} não encontrado. Adicione o bot ao servidor Discord.` };
    }
    if (!channel.isTextBased()) {
      return { ok: false, error: `Canal ${CHANNEL_ID} não é um canal de texto.` };
    }

    const displayDate = formatDate(date);

    const embed = new EmbedBuilder()
      .setColor(0xff6b00)
      .setTitle("🎮  Lista do Mix Aberta!")
      .setDescription(
        extraMessage
          ? extraMessage
          : `A lista do Mix de **${displayDate}** está aberta!\nClique no botão abaixo para reservar sua vaga direto pelo Discord.`
      )
      .setFooter({ text: "Inimigos da Bala • CS2" })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId(`mix_join_${date}`)
      .setLabel("Entrar no Mix")
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await (channel as any).send({ embeds: [embed], components: [row] });
    return { ok: true };
  } catch (err: any) {
    const msg = err.message || "Erro desconhecido";
    console.error("[Discord] Erro ao enviar notificação do mix:", msg);
    return { ok: false, error: msg };
  }
}

export async function sendNewsNotification(title: string, description: string, mentionEveryone = false): Promise<{ ok: boolean; error?: string }> {
  if (!client || !ready) {
    return { ok: false, error: lastError || "Bot não conectado" };
  }

  if (!CHANNEL_ID) {
    return { ok: false, error: "ID do canal não configurado (DISCORD_CHANNEL_ID)" };
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      return { ok: false, error: `Canal ${CHANNEL_ID} não encontrado. Adicione o bot ao servidor Discord.` };
    }
    if (!channel.isTextBased()) {
      return { ok: false, error: `Canal ${CHANNEL_ID} não é um canal de texto.` };
    }

    const embed = new EmbedBuilder()
      .setColor(0xff6b00)
      .setTitle(`📢  ${title}`)
      .setDescription(description)
      .setFooter({ text: "Inimigos da Bala • CS2" })
      .setTimestamp();

    const content = mentionEveryone ? "@everyone" : undefined;

    await (channel as any).send({ content, embeds: [embed] });
    return { ok: true };
  } catch (err: any) {
    const msg = err.message || "Erro desconhecido";
    console.error("[Discord] Erro ao enviar notificação:", msg);
    return { ok: false, error: msg };
  }
}

export function getBotInviteUrl(): string {
  const appId = botApplicationId || client?.application?.id || client?.user?.id;
  if (!appId) return "";
  // 277025392640 = Read Messages + Send Messages + Embed Links + Read Message History + Use Slash Commands
  const perms = "277025392640";
  return `https://discord.com/api/oauth2/authorize?client_id=${appId}&permissions=${perms}&scope=bot+applications.commands`;
}
