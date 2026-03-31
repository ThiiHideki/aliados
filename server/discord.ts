import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Interaction, ButtonInteraction } from "discord.js";
import { storage } from "./storage";

let client: Client | null = null;
let ready = false;

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || "";

export function getDiscordClient(): Client | null {
  return client;
}

export function isDiscordReady(): boolean {
  return ready;
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
    console.log("[Discord] Token não configurado. Bot não iniciado.");
    return;
  }

  client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, (c) => {
    ready = true;
    console.log(`[Discord] Bot conectado como ${c.user.tag}`);
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
  });

  try {
    await client.login(token);
  } catch (err) {
    console.error("[Discord] Falha ao conectar:", err);
    client = null;
  }
}

export async function sendMixNotification(date: string, extraMessage?: string): Promise<boolean> {
  if (!client || !ready) return false;

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return false;

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
    return true;
  } catch (err) {
    console.error("[Discord] Erro ao enviar notificação do mix:", err);
    return false;
  }
}

export async function sendNewsNotification(title: string, description: string, mentionEveryone = false): Promise<boolean> {
  if (!client || !ready) return false;

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return false;

    const embed = new EmbedBuilder()
      .setColor(0xff6b00)
      .setTitle(`📢  ${title}`)
      .setDescription(description)
      .setFooter({ text: "Inimigos da Bala • CS2" })
      .setTimestamp();

    const content = mentionEveryone ? "@everyone" : undefined;

    await (channel as any).send({ content, embeds: [embed] });
    return true;
  } catch (err) {
    console.error("[Discord] Erro ao enviar notificação:", err);
    return false;
  }
}
