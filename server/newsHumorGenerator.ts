import { db } from "./db";
import { matches, matchStats, users } from "../shared/schema";
import { desc, eq } from "drizzle-orm";

interface GeneratedNews {
  title: string;
  content: string;
}

export async function generateHumorousNews(): Promise<GeneratedNews> {
  try {
    // Fetch latest matches
    const latestMatches = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.date))
      .limit(5);

    if (latestMatches.length === 0) {
      return {
        title: "📰 Jornal Aliados: Servidor em Calmaria!",
        content: "Nenhuma partida recente encontrada! Os jogadores estão descansando os dedos ou com preguiça de entrar no server. Bora pro jogo rapaziada!",
      };
    }

    // Pick a random recent match
    const randomMatch = latestMatches[Math.floor(Math.random() * latestMatches.length)];
    const stats = await db
      .select()
      .from(matchStats)
      .where(eq(matchStats.matchId, randomMatch.id));

    if (stats.length === 0) {
      return {
        title: `📰 Resumo da Partida em ${randomMatch.map}`,
        content: `Rolou um embate insano no mapa ${randomMatch.map} com placar de ${randomMatch.team1Score} x ${randomMatch.team2Score}! O clima esquentou no servidor!`,
      };
    }

    // Join stats with users
    const allUsers = await db.select().from(users);
    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    const enrichedStats = stats.map((s) => {
      const u = userMap.get(s.userId) || (s.steamId64 ? allUsers.find((x) => x.steamId64 === s.steamId64) : undefined);
      const name = u?.nickname || u?.firstName || s.name || "Jogador Misterioso";
      const kills = s.kills || 0;
      const deaths = s.deaths || 1;
      const kd = Number((kills / Math.max(1, deaths)).toFixed(2));
      return { ...s, name, kills, deaths, kd };
    });

    // Sort by Kills & KD
    enrichedStats.sort((a, b) => b.kills - a.kills);
    const topFragger = enrichedStats[0];
    const bottomFragger = enrichedStats[enrichedStats.length - 1];
    const aces = enrichedStats.filter((s) => (s.enemy5ks || 0) > 0);

    // Template Selector
    const templates: (() => GeneratedNews)[] = [];

    // Template 1: Top Fragger Carry
    if (topFragger && topFragger.kills >= 15) {
      templates.push(() => ({
        title: `🔥 URGENTE: ${topFragger.name} Coloca a Mochila e Carrega o Time em ${randomMatch.map}!`,
        content: `Na última partida no mapa ${randomMatch.map} (${randomMatch.team1Score} x ${randomMatch.team2Score}), ${topFragger.name} doutrinou geral com ${topFragger.kills} kills e K/D de ${topFragger.kd}! Testemunhas afirmam que a coluna do jogador quase travou de tanto carregar os sacos de batata do time. Parabéns pelo carimbo de MVP!`,
      }));
    }

    // Template 2: Bottom Fragger Zoeira
    if (bottomFragger && bottomFragger.deaths >= 10) {
      templates.push(() => ({
        title: `🚨 PLANTÃO MÉDICO: ${bottomFragger.name} Virou Ímã de Bala em ${randomMatch.map}!`,
        content: `Situação delicada no servidor! Durante o confronto em ${randomMatch.map}, ${bottomFragger.name} conseguiu a proeza de acumular ${bottomFragger.deaths} mortes e apenas ${bottomFragger.kills} kills (K/D brutal de ${bottomFragger.kd}). A comissão técnica recomendou reforço no colete e capacete de titânio para as próximas rodadas!`,
      }));
    }

    // Template 3: ACE / 5K Highlight
    if (aces.length > 0) {
      const acePlayer = aces[0];
      templates.push(() => ({
        title: `⚡ MASSACRE EM ${randomMatch.map.toUpperCase()}: ${acePlayer.name} Passa o Trator com ACE!`,
        content: `Sem piedade! ${acePlayer.name} mandou todo o time adversário de volta pro saguão com um ACE memorável no mapa ${randomMatch.map}! Os adversários ficaram procurando o rumo de casa depois de tomar essa coça épica.`,
      }));
    }

    // Template 4: Match Summary Comedy
    templates.push(() => {
      const winnerTeam = randomMatch.team1Score > randomMatch.team2Score ? "Time 1" : "Time 2";
      return {
        title: `🎮 RESENHA CS2: ${winnerTeam} Leva a Melhor em ${randomMatch.map} (${randomMatch.team1Score} x ${randomMatch.team2Score})!`,
        content: `Foi bala pra todo lado no mapa ${randomMatch.map}! O ${winnerTeam} garantiu a vitória por ${randomMatch.team1Score} a ${randomMatch.team2Score}. Destaque para ${topFragger?.name || "os mitos"} que entregaram tudo e para ${bottomFragger?.name || "os pino de golfe"} que pelo menos ajudaram com utilitárias!`,
      };
    });

    const chosenTemplate = templates[Math.floor(Math.random() * templates.length)];
    return chosenTemplate();
  } catch (err) {
    console.error("[NewsHumorGenerator Error]:", err);
    return {
      title: "📰 Jornal Aliados: Resenha da Rodada!",
      content: "O servidor está pegando fogo com partidas cada vez mais disputadas! Fique de olho nos próximos confrontos e garanta seu lugar no topo do ranking!",
    };
  }
}
