import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupNativeSteamAuth, isAuthenticated } from "./steamAuthNative";
import { updateUserStatsSchema, mixPenalties, users, FANTASY_BUDGET, raffles, type RaffleEligibleEntry, insertTournament2x2TeamSchema, updateTournament2x2TeamSchema, matches, matchStats } from "../shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, sql, desc, and, gte, lt } from "drizzle-orm";
import { sendMixNotification, sendNewsNotification, isDiscordReady, getLastError, getBotInviteUrl, getNewsChannelId } from "./discord";
import { getPublicKey as getVapidPublicKey, sendPushToAll, sendPushToUser, initPush } from "./push";
import { pushSubscriptions } from "../shared/schema";
import { randomBytes, createHash } from "crypto";

// CSV row schema for validation
const csvRowSchema = z.object({
  matchid: z.coerce.number(),
  mapnumber: z.coerce.number(),
  steamid64: z.string(),
  team: z.string(),
  name: z.string(),
  kills: z.coerce.number(),
  deaths: z.coerce.number(),
  damage: z.coerce.number(),
  assists: z.coerce.number(),
  enemy5ks: z.coerce.number(),
  enemy4ks: z.coerce.number(),
  enemy3ks: z.coerce.number(),
  enemy2ks: z.coerce.number(),
  utility_count: z.coerce.number(),
  utility_damage: z.coerce.number(),
  utility_successes: z.coerce.number(),
  utility_enemies: z.coerce.number(),
  flash_count: z.coerce.number(),
  flash_successes: z.coerce.number(),
  health_points_removed_total: z.coerce.number(),
  health_points_dealt_total: z.coerce.number(),
  shots_fired_total: z.coerce.number(),
  shots_on_target_total: z.coerce.number(),
  v1_count: z.coerce.number(),
  v1_wins: z.coerce.number(),
  v2_count: z.coerce.number(),
  v2_wins: z.coerce.number(),
  entry_count: z.coerce.number(),
  entry_wins: z.coerce.number(),
  equipment_value: z.coerce.number(),
  money_saved: z.coerce.number(),
  kill_reward: z.coerce.number(),
  live_time: z.coerce.number(),
  head_shot_kills: z.coerce.number(),
  cash_earned: z.coerce.number(),
  enemies_flashed: z.coerce.number(),
});

type CsvRow = z.infer<typeof csvRowSchema>;

function parseCSV(csvContent: string): CsvRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows: CsvRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    // Skip spectators
    if (obj.team?.toLowerCase() === 'spectator' || obj.team?.toLowerCase() === 'spectators') {
      console.log(`Skipping spectator: ${obj.name}`);
      continue;
    }
    
    try {
      const parsed = csvRowSchema.parse(obj);
      rows.push(parsed);
    } catch (e) {
      console.error(`Error parsing row ${i}:`, e);
    }
  }
  
  return rows;
}

export function registerRoutes(
  httpServer: Server,
  app: Express
): Server {
  // Auth middleware (Native Steam OpenID + JWT Cookie)
  setupNativeSteamAuth(app);

  const handleLogout = (_req: any, res: any) => {
    res.setHeader("Set-Cookie", "aliados_session=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure");
    if (typeof res.redirect === "function") {
      return res.redirect("/");
    }
    return res.status(200).json({ message: "Logged out" });
  };
  app.all("/api/logout", handleLogout);
  app.all("/api/auth/logout", handleLogout);


  // Get active users only (rankings, mix, mural, etc) - never includes banned
  app.get('/api/users', isAuthenticated, async (_req, res) => {
    try {
      const users = await storage.getAllUsers(false);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin-only: get ALL users including banned (for user management panel)
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) return res.status(403).json({ message: "Admin access required" });
      const users = await storage.getAllUsers(true);
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get all cheater-banned users (public list for mural)
  app.get('/api/users/cheater-banned', async (_req, res) => {
    try {
      const allUsers = await db.select().from(users)
        .where(eq(users.isCheaterBanned, true))
        .orderBy(desc(users.createdAt));
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching cheater-banned users:", error);
      res.status(500).json({ message: "Failed to fetch cheater-banned users" });
    }
  });

  // Get a single user by ID
  app.get('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Recalculate all user stats (admin only)
  app.post('/api/admin/recalculate-all-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const users = await storage.getAllUsers();
      const results: { userId: string; success: boolean; error?: string }[] = [];
      
      for (const user of users) {
        try {
          await storage.recalculateUserStats(user.id);
          results.push({ userId: user.id, success: true });
        } catch (err) {
          results.push({ userId: user.id, success: false, error: String(err) });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      res.json({ 
        message: `Recalculated stats for ${successCount}/${users.length} users`,
        results 
      });
    } catch (error) {
      console.error("Error recalculating stats:", error);
      res.status(500).json({ message: "Failed to recalculate stats" });
    }
  });

  // Recalculate MVPs for all existing matches (admin only)
  app.post('/api/admin/recalculate-mvps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      // MVP calculation function
      const calculateMVPScore = (stat: any): number => {
        const kd = stat.deaths > 0 ? stat.kills / stat.deaths : stat.kills;
        const hsPercent = stat.kills > 0 ? (stat.headshots / stat.kills) : 0;
        
        let score = 0;
        score += stat.kills * 2;
        score += stat.assists * 0.5;
        score += kd * 5;
        score += hsPercent * 10;
        score += stat.damage * 0.01;
        score += (stat.enemy5ks || 0) * 15;
        score += (stat.enemy4ks || 0) * 10;
        score += (stat.enemy3ks || 0) * 5;
        score += (stat.enemy2ks || 0) * 2;
        score += (stat.v1Wins || 0) * 8;
        score += (stat.v2Wins || 0) * 12;
        score += (stat.entryWins || 0) * 3;
        score += (stat.utilityDamage || 0) * 0.02;
        score += (stat.enemiesFlashed || 0) * 0.5;
        
        return score;
      };

      const allMatches = await storage.getAllMatches();
      let matchesProcessed = 0;
      let mvpsAssigned = 0;
      const usersToRecalculate = new Set<string>();

      for (const match of allMatches) {
        const stats = await storage.getMatchStats(match.id);
        
        if (stats.length === 0) continue;

        // Find the MVP
        let mvpStatId: string | null = null;
        let highestScore = -1;
        
        for (const stat of stats) {
          const score = calculateMVPScore(stat);
          if (score > highestScore) {
            highestScore = score;
            mvpStatId = stat.id;
          }
        }

        // Update MVP for each player in this match
        for (const stat of stats) {
          const isMVP = stat.id === mvpStatId ? 1 : 0;
          await storage.updateMatchStatsMvp(stat.id, isMVP);
          usersToRecalculate.add(stat.userId);
          if (isMVP === 1) mvpsAssigned++;
        }
        
        matchesProcessed++;
      }

      // Recalculate user stats to update MVP totals
      for (const id of Array.from(usersToRecalculate)) {
        await storage.recalculateUserStats(id);
      }

      res.json({ 
        message: `Recalculated MVPs for ${matchesProcessed} matches. ${mvpsAssigned} MVPs assigned. ${usersToRecalculate.size} user stats updated.`,
        matchesProcessed,
        mvpsAssigned,
        usersUpdated: usersToRecalculate.size
      });
    } catch (error) {
      console.error("Error recalculating MVPs:", error);
      res.status(500).json({ message: "Failed to recalculate MVPs" });
    }
  });

  // Grant +1 Desafio LP item to all active (non-banned) players
  app.post('/api/admin/grant-desafio-all', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });

      const result = await db.update(users)
        .set({ desafioRpCount: sql`${users.desafioRpCount} + 1` })
        .where(and(eq(users.isBanned, false), eq(users.isCheaterBanned, false)))
        .returning({ id: users.id });

      res.json({ message: `+1 Desafio LP concedido para ${result.length} jogador(es).`, count: result.length });
    } catch (error) {
      console.error("Error granting desafio to all:", error);
      res.status(500).json({ message: "Erro ao conceder Desafio LP" });
    }
  });

  // Update current user profile (name, photo, steamId) - MUST be before /api/users/:id
  app.patch('/api/users/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { firstName, lastName, nickname, profileImageUrl, steamId64 } = req.body;
      
      // If linking/changing steamId64, check if it already belongs to another user
      if (steamId64 && steamId64.trim() !== '') {
        const existingUser = await storage.getUserBySteamId(steamId64);
        
        if (existingUser && existingUser.id !== userId) {
          // Try to merge the existing steam user into current user
          const mergedUser = await storage.mergeUsers(existingUser.id, userId);
          if (mergedUser) {
            // Also update other profile fields if provided
            const additionalUpdates: any = { updatedAt: new Date() };
            if (firstName !== undefined) additionalUpdates.firstName = firstName;
            if (lastName !== undefined) additionalUpdates.lastName = lastName;
            if (nickname !== undefined) additionalUpdates.nickname = nickname;
            if (profileImageUrl !== undefined) additionalUpdates.profileImageUrl = profileImageUrl;
            
            if (Object.keys(additionalUpdates).length > 1) {
              const finalUser = await storage.updateUserStats(userId, additionalUpdates);
              return res.json(finalUser);
            }
            return res.json(mergedUser);
          } else {
            // Merge failed - user not found or other issue
            return res.status(400).json({ 
              message: "Não foi possível vincular este SteamID64. O usuário associado não foi encontrado." 
            });
          }
        }
      }
      
      // Regular update (steamId64 is new/empty or belongs to current user)
      const updates: any = { updatedAt: new Date() };
      if (firstName !== undefined) updates.firstName = firstName;
      if (lastName !== undefined) updates.lastName = lastName;
      if (nickname !== undefined) updates.nickname = nickname;
      if (profileImageUrl !== undefined) updates.profileImageUrl = profileImageUrl;
      if (steamId64 !== undefined) updates.steamId64 = steamId64;
      
      const user = await storage.updateUserStats(userId, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Update user stats (admin only)
  app.patch('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const targetId = req.params.id;
      const validatedData = updateUserStatsSchema.parse(req.body);
      
      const updatedUser = await storage.updateUserStats(targetId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Link SteamID64 to user account (with automatic merge if already exists)
  app.post('/api/users/link-steam', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { steamId64 } = req.body;

      if (!steamId64 || typeof steamId64 !== 'string') {
        return res.status(400).json({ message: "SteamID64 is required" });
      }

      // Check if this steamId64 is already linked to another account
      const existingUser = await storage.getUserBySteamId(steamId64);
      if (existingUser && existingUser.id !== userId) {
        // Automatically merge the existing steam user's data into current user
        console.log(`Merging user ${existingUser.id} into ${userId} (SteamID: ${steamId64})`);
        
        const mergedUser = await storage.mergeUsers(existingUser.id, userId);
        if (mergedUser) {
          // Recalculate stats after merge
          await storage.recalculateUserStats(userId);
          return res.json({
            ...mergedUser,
            merged: true,
            message: `Dados mesclados com sucesso! ${existingUser.totalMatches || 0} partidas foram transferidas.`
          });
        } else {
          return res.status(400).json({ 
            message: "Não foi possível mesclar os dados. Tente novamente." 
          });
        }
      }

      // SteamID64 is new or already belongs to current user
      const updatedUser = await storage.updateUserStats(userId, { steamId64 });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Recalculate stats from any existing match data
      await storage.recalculateUserStats(userId);

      res.json(updatedUser);
    } catch (error) {
      console.error("Error linking steam:", error);
      res.status(500).json({ message: "Failed to link Steam account" });
    }
  });

  // ── Modifier endpoints ─────────────────────────────────────────────────────
  // GET /api/me/items — return current user's item counts + active modifier
  app.get('/api/me/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({
        desafioRpCount: user.desafioRpCount ?? 0,
        freezeRpCount:  user.freezeRpCount  ?? 0,
        activeModifier: user.activeModifier  ?? null,
        itemsUsedToday: user.itemsUsedToday  ?? 0,
        winStreak:      user.winStreak       ?? 0,
      });
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar itens" });
    }
  });

  // POST /api/me/modifier — activate a modifier item
  app.post('/api/me/modifier', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { type } = req.body;
      if (type !== 'desafio_rp' && type !== 'freeze_rp') {
        return res.status(400).json({ message: "Tipo inválido. Use 'desafio_rp' ou 'freeze_rp'" });
      }

      // Check time restriction: blocked after 19:00 BRT (22:00 UTC), reset at 07:00 BRT (10:00 UTC)
      const nowUtc = new Date();
      const nowBrt = new Date(nowUtc.getTime() - 3 * 60 * 60 * 1000); // BRT = UTC-3
      const hourBrt = nowBrt.getUTCHours();
      const isBlocked = hourBrt >= 19 || hourBrt < 7;
      if (isBlocked) {
        return res.status(403).json({ message: "Itens só podem ser ativados entre 07:00 e 19:00 (BRT)" });
      }

      // Reset daily counter if needed
      const todayStr = nowBrt.toISOString().slice(0, 10);
      let usedToday = user.itemsUsedToday ?? 0;
      if ((user.itemsLastUsedDate ?? '') !== todayStr) {
        usedToday = 0;
      }

      if (usedToday >= 2) {
        return res.status(403).json({ message: "Limite de 2 itens por dia atingido" });
      }

      // Check stock
      const count = type === 'desafio_rp' ? (user.desafioRpCount ?? 0) : (user.freezeRpCount ?? 0);
      if (count <= 0) {
        return res.status(400).json({ message: "Você não tem esse item disponível" });
      }

      const updates: Record<string, any> = {
        activeModifier:     type,
        itemsUsedToday:     usedToday + 1,
        itemsLastUsedDate:  todayStr,
        updatedAt:          new Date(),
      };
      if (type === 'desafio_rp') updates.desafioRpCount = (user.desafioRpCount ?? 0) - 1;
      else                        updates.freezeRpCount  = (user.freezeRpCount  ?? 0) - 1;

      await db.update(users).set(updates).where(eq(users.id, userId));
      res.json({ message: "Modificador ativado com sucesso!", activeModifier: type });
    } catch (e) {
      console.error("Error activating modifier:", e);
      res.status(500).json({ message: "Erro ao ativar modificador" });
    }
  });

  // DELETE /api/me/modifier — cancel active modifier (refunds item)
  app.delete('/api/me/modifier', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.activeModifier) return res.status(400).json({ message: "Nenhum modificador ativo" });

      const refundField = user.activeModifier === 'desafio_rp' ? 'desafioRpCount' : 'freezeRpCount';
      const refundCount = user.activeModifier === 'desafio_rp' ? (user.desafioRpCount ?? 0) : (user.freezeRpCount ?? 0);
      await db.update(users).set({
        activeModifier: null,
        [refundField]: refundCount + 1,
        updatedAt: new Date(),
      }).where(eq(users.id, userId));
      res.json({ message: "Modificador cancelado. Item devolvido." });
    } catch (e) {
      res.status(500).json({ message: "Erro ao cancelar modificador" });
    }
  });

  // Delete user (admin only)
  app.delete('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const targetId = req.params.id;
      
      // Prevent admin from deleting themselves
      if (targetId === userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const deleted = await storage.deleteUser(targetId);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Import match data from CSV (admin only)
  app.post('/api/matches/import', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const { csvContent, map, winnerTeam, team1Score, team2Score, matchDate } = req.body;

      if (!csvContent || typeof csvContent !== 'string') {
        return res.status(400).json({ message: "CSV content is required" });
      }

      if (!map || typeof map !== 'string') {
        return res.status(400).json({ message: "Map name is required" });
      }

      const rows = parseCSV(csvContent);

      if (rows.length === 0) {
        return res.status(400).json({ message: "No valid data found in CSV" });
      }

      // Group by matchid and mapnumber
      const matchId = rows[0].matchid;
      const mapNumber = rows[0].mapnumber;

      // Check if this match already exists
      const existingMatch = await storage.getMatchByExternalId(matchId, mapNumber);
      
      if (existingMatch) {
        return res.status(409).json({ 
          message: "Esta partida já foi importada anteriormente.",
          matchId: existingMatch.id,
          map: existingMatch.map,
          date: existingMatch.date
        });
      }

      // Extract team names from player data
      const teams = Array.from(new Set(rows.map(r => r.team)));
      const team1Name = teams[0] || 'Time 1';
      const team2Name = teams[1] || 'Time 2';

      // Use provided scores if available, otherwise calculate from kills
      let finalTeam1Score = team1Score;
      let finalTeam2Score = team2Score;
      
      if (finalTeam1Score === undefined || finalTeam2Score === undefined) {
        const team1Players = rows.filter(r => r.team === team1Name);
        const team2Players = rows.filter(r => r.team === team2Name);
        const t1Kills = team1Players.reduce((sum, p) => sum + p.kills, 0);
        const t2Kills = team2Players.reduce((sum, p) => sum + p.kills, 0);
        finalTeam1Score = Math.round(t1Kills / 5);
        finalTeam2Score = Math.round(t2Kills / 5);
      }

      // Always derive winner team from scores to ensure correctness
      let finalWinnerTeam: string | null = null;
      if (finalTeam1Score !== undefined && finalTeam2Score !== undefined) {
        if (finalTeam1Score > finalTeam2Score) {
          finalWinnerTeam = team1Name;
        } else if (finalTeam2Score > finalTeam1Score) {
          finalWinnerTeam = team2Name;
        }
      }

      // Create match with winner info
      const resolvedDate = matchDate ? new Date(matchDate + "T12:00:00") : new Date();
      const match = await storage.createMatch({
        externalMatchId: matchId,
        mapNumber,
        map,
        team1Name,
        team2Name,
        team1Score: finalTeam1Score,
        team2Score: finalTeam2Score,
        winnerTeam: finalWinnerTeam,
        date: resolvedDate,
      });

      // Calculate MVP - find the best performing player based on statistics
      // MVP score formula considers: kills, K/D, headshots, damage, multi-kills, clutches, entry frags
      const calculateMVPScore = (row: any): number => {
        const kd = row.deaths > 0 ? row.kills / row.deaths : row.kills;
        const hsPercent = row.kills > 0 ? (row.head_shot_kills / row.kills) : 0;
        
        let score = 0;
        score += row.kills * 2;                    // 2 points per kill
        score += row.assists * 0.5;                // 0.5 points per assist
        score += kd * 5;                           // 5 points per K/D ratio
        score += hsPercent * 10;                   // Up to 10 points for HS%
        score += row.damage * 0.01;                // 0.01 points per damage
        score += row.enemy5ks * 15;                // 15 points per ACE
        score += row.enemy4ks * 10;                // 10 points per 4K
        score += row.enemy3ks * 5;                 // 5 points per 3K
        score += row.enemy2ks * 2;                 // 2 points per 2K
        score += row.v1_wins * 8;                  // 8 points per 1v1 clutch win
        score += row.v2_wins * 12;                 // 12 points per 1v2 clutch win
        score += row.entry_wins * 3;               // 3 points per entry frag win
        score += row.utility_damage * 0.02;        // 0.02 points per utility damage
        score += row.enemies_flashed * 0.5;        // 0.5 points per enemy flashed
        
        return score;
      };

      // Find the MVP (player with highest score)
      let mvpSteamId: string | null = null;
      let highestScore = -1;
      
      for (const row of rows) {
        const score = calculateMVPScore(row);
        if (score > highestScore) {
          highestScore = score;
          mvpSteamId = row.steamid64;
        }
      }

      // Process each player
      const usersToRecalculate: string[] = [];
      // Capture pre-import modifier/streak state for each player (by steamid64)
      type PlayerPreState = {
        userId: string;
        activeModifier: string | null;
        winStreak: number;
        desafioRpCount: number;
        freezeRpCount: number;
      };
      const preStateMap: Record<string, PlayerPreState> = {};

      for (const row of rows) {
        // Find or create user by steamId64.
        // createPlayerFromSteam also syncs the nickname with the latest name
        // from the match file, keeping it up-to-date with what's used in-game.
        const user = await storage.createPlayerFromSteam(row.steamid64, row.name);

        usersToRecalculate.push(user.id);
        preStateMap[row.steamid64] = {
          userId: user.id,
          activeModifier: user.activeModifier ?? null,
          winStreak: user.winStreak ?? 0,
          desafioRpCount: user.desafioRpCount ?? 0,
          freezeRpCount: user.freezeRpCount ?? 0,
        };

        // Assign MVP = 1 to the best player, 0 to others
        const isMVP = row.steamid64 === mvpSteamId ? 1 : 0;

        // Create match stats
        await storage.createMatchStats({
          matchId: match.id,
          userId: user.id,
          steamId64: row.steamid64,
          team: row.team,
          playerName: row.name,
          kills: row.kills,
          deaths: row.deaths,
          assists: row.assists,
          damage: row.damage,
          headshots: row.head_shot_kills,
          enemy5ks: row.enemy5ks,
          enemy4ks: row.enemy4ks,
          enemy3ks: row.enemy3ks,
          enemy2ks: row.enemy2ks,
          utilityCount: row.utility_count,
          utilityDamage: row.utility_damage,
          utilitySuccesses: row.utility_successes,
          utilityEnemies: row.utility_enemies,
          flashCount: row.flash_count,
          flashSuccesses: row.flash_successes,
          enemiesFlashed: row.enemies_flashed,
          healthPointsRemovedTotal: row.health_points_removed_total,
          healthPointsDealtTotal: row.health_points_dealt_total,
          shotsFiredTotal: row.shots_fired_total,
          shotsOnTargetTotal: row.shots_on_target_total,
          v1Count: row.v1_count,
          v1Wins: row.v1_wins,
          v2Count: row.v2_count,
          v2Wins: row.v2_wins,
          entryCount: row.entry_count,
          entryWins: row.entry_wins,
          equipmentValue: row.equipment_value,
          moneySaved: row.money_saved,
          killReward: row.kill_reward,
          cashEarned: row.cash_earned,
          liveTime: row.live_time,
          mvps: isMVP,
          score: row.damage,
        });
      }

      // Recalculate stats for all users in this match (base LP)
      const uniqueUserIds = Array.from(new Set(usersToRecalculate));
      for (const id of uniqueUserIds) {
        await storage.recalculateUserStats(id);
      }

      // ── Post-recalc: apply streaks, modifiers, and grant items ────────────────
      const matchRoundsTotal = (finalTeam1Score || 0) + (finalTeam2Score || 0) || 24;
      for (const row of rows) {
        const pre = preStateMap[row.steamid64];
        if (!pre) continue;

        // Reload user (levelPoints just updated by recalculateUserStats)
        const freshUser = await storage.getUser(pre.userId);
        if (!freshUser) continue;

        const wonMatch = !!finalWinnerTeam && finalWinnerTeam === row.team;
        const isMvpInt = row.steamid64 === mvpSteamId ? 1 : 0;

        // Base LP for this specific match
        const baseLp = calcMatchLP(
          wonMatch,
          Number(row.kills), Number(row.damage), matchRoundsTotal,
          Number(row.entry_wins), Number(row.entry_count),
          Number(row.utility_damage), Number(row.enemies_flashed),
          Number(row.v1_wins), Number(row.v2_wins),
          isMvpInt, Number(row.enemy5ks), Number(row.enemy4ks),
        );

        // Streak: increment on win, reset on loss
        const newStreak = wonMatch ? pre.winStreak + 1 : 0;

        // Streak bonus (added from 3rd consecutive win onwards)
        let streakBonus = 0;
        if (wonMatch && newStreak >= 3) {
          if      (newStreak >= 10) streakBonus = 12;
          else if (newStreak >= 7)  streakBonus = 8;
          else if (newStreak >= 5)  streakBonus = 5;
          else                      streakBonus = 3;
        }

        // Modifier correction (applied on top of recalculated base LP)
        let modifierCorrection = 0;
        let modifierConsumed = false;
        if (pre.activeModifier === 'desafio_rp') {
          modifierCorrection = baseLp; // doubles this match's LP
          modifierConsumed = true;
        } else if (pre.activeModifier === 'freeze_rp') {
          modifierCorrection = -baseLp; // zeroes this match's LP
          modifierConsumed = true;
        }

        const totalCorrection = modifierCorrection + streakBonus;
        const newLP = Math.max(0, Math.min(2100, (freshUser.levelPoints ?? 0) + totalCorrection));

        // Item grants for objectives achieved in this match
        let desafioGrant = 0;
        let freezeGrant = 0;
        if (row.enemy5ks > 0)  { desafioGrant++; freezeGrant++; } // ACE
        if (isMvpInt > 0)       { desafioGrant++; freezeGrant++; } // MVP

        // 5 distinct play days milestone (check if they just crossed it)
        const daysRes = await db.execute(
          sql`SELECT COUNT(DISTINCT DATE(m.date)) AS cnt
              FROM match_stats ms
              JOIN matches m ON ms.match_id = m.id
              WHERE ms.user_id = ${pre.userId}`
        );
        const distinctDays = Number((daysRes.rows[0] as any)?.cnt ?? 0);
        if (distinctDays === 5) { desafioGrant++; freezeGrant++; }

        // Trophy from previous month
        const now = new Date();
        const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
        const prevYear  = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const trophyRes = await db.execute(
          sql`SELECT id FROM trophies
              WHERE user_id = ${pre.userId}
                AND month = ${prevMonth} AND year = ${prevYear}
              LIMIT 1`
        );
        if ((trophyRes.rows as any[]).length > 0) { desafioGrant++; freezeGrant++; }

        // Persist updates
        const updates: Record<string, any> = {
          winStreak:      newStreak,
          levelPoints:    newLP,
          desafioRpCount: (freshUser.desafioRpCount ?? 0) + desafioGrant,
          freezeRpCount:  (freshUser.freezeRpCount  ?? 0) + freezeGrant,
          updatedAt:      new Date(),
        };
        if (modifierConsumed) updates.activeModifier = null;

        await db.update(users).set(updates).where(eq(users.id, pre.userId));
      }

      // Resolve pending bets for all players in this match
      let betsResolved = 0;
      const matchStats = await storage.getMatchStats(match.id);
      
      for (const stat of matchStats) {
        // Find pending bets for this player
        const pendingBets = await storage.getPendingBetsForPlayer(stat.userId);
        
        for (const bet of pendingBets) {
          // Pass the match winner team for "win" bet type resolution
          await storage.resolveBet(bet.id, stat, finalWinnerTeam);
          betsResolved++;
        }
      }

      // Auto-calculate fantasy points for any open/active round covering this match's date
      try {
        const matchDateStr = match.date instanceof Date ? match.date.toISOString() : String(match.date);
        const activeRounds = await db.execute(
          sql`SELECT * FROM fantasy_rounds
              WHERE status IN ('open', 'active')
                AND start_date <= ${matchDateStr}::timestamptz
                AND end_date   >= ${matchDateStr}::timestamptz`
        );
        for (const round of activeRounds.rows as any[]) {
          const roundStats = await db.execute(
            sql`SELECT ms.*, m.winner_team, (ms.team_name = m.winner_team) AS won_match
                FROM match_stats ms
                JOIN matches m ON ms.match_id = m.id
                WHERE m.date >= ${round.start_date} AND m.date <= ${round.end_date}`
          );
          const ptMap: Record<string, number> = {};
          for (const st of roundStats.rows as any[]) {
            if (!st.user_id) continue;
            const fp = calcFantasyPoints({
              kills: st.kills, deaths: st.deaths, assists: st.assists,
              headshots: st.headshots, fiveK: st.enemy_5ks, fourK: st.enemy_4ks,
              threeK: st.enemy_3ks, twoK: st.enemy_2ks, damage: st.damage,
              clutch1v1: st.v1_wins, clutch1v2: st.v2_wins, firstKills: st.entry_wins,
              isMvp: st.mvps > 0,
              wonMatch: st.won_match === true || st.won_match === "true",
            });
            ptMap[st.user_id] = (ptMap[st.user_id] || 0) + fp;
          }
          const roundTeams = await db.execute(sql`SELECT id FROM fantasy_teams WHERE round_id = ${round.id}`);
          for (const ft of roundTeams.rows as any[]) {
            const picks = await db.execute(sql`SELECT * FROM fantasy_picks WHERE team_id = ${ft.id}`);
            let total = 0;
            for (const pick of picks.rows as any[]) {
              const pts = ptMap[pick.picked_user_id] || 0;
              await db.execute(sql`UPDATE fantasy_picks SET points = ${pts} WHERE id = ${pick.id}`);
              total += pts;
            }
            await db.execute(sql`UPDATE fantasy_teams SET total_points = ${Math.round(total * 100) / 100} WHERE id = ${ft.id}`);
          }
        }
      } catch (fantasyErr) {
        console.error("Fantasy auto-calc error (non-fatal):", fantasyErr);
      }

      res.json({ 
        message: "Match imported successfully",
        matchId: match.id,
        playersProcessed: rows.length,
        betsResolved
      });
    } catch (error) {
      console.error("Error importing match:", error);
      res.status(500).json({ message: "Failed to import match" });
    }
  });

  // Get all matches
  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const matches = await storage.getAllMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Get all matches with aggregated stats
  app.get('/api/matches/with-stats', isAuthenticated, async (req: any, res) => {
    try {
      const matches = await storage.getAllMatches();
      const matchesWithStats = await Promise.all(
        matches.map(async (match) => {
          const stats = await storage.getMatchStats(match.id);
          const aggregated = {
            totalKills: stats.reduce((sum, s) => sum + s.kills, 0),
            totalDeaths: stats.reduce((sum, s) => sum + s.deaths, 0),
            totalDamage: stats.reduce((sum, s) => sum + s.damage, 0),
            totalHeadshots: stats.reduce((sum, s) => sum + s.headshots, 0),
            playerCount: stats.length,
            topKiller: stats.length > 0 
              ? stats.reduce((top, s) => s.kills > top.kills ? s : top) 
              : null,
            mvpPlayer: stats.find(s => s.mvps > 0) || null,
          };
          return { match, stats, aggregated };
        })
      );
      res.json(matchesWithStats);
    } catch (error) {
      console.error("Error fetching matches with stats:", error);
      res.status(500).json({ message: "Failed to fetch matches with stats" });
    }
  });

  app.get('/api/matches/latest-mvp', isAuthenticated, async (req: any, res) => {
    try {
      const result = await storage.getLatestMatchWithMvp();
      if (!result) {
        return res.json(null);
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching latest MVP:", error);
      res.status(500).json({ message: "Erro ao buscar MVP" });
    }
  });

  app.get('/api/matches/latest-ace', isAuthenticated, async (req: any, res) => {
    try {
      const result = await storage.getLatestAce();
      if (!result) {
        return res.json(null);
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching latest ACE:", error);
      res.status(500).json({ message: "Erro ao buscar ACE" });
    }
  });

  // Get match details with player stats
  app.get('/api/matches/:id', isAuthenticated, async (req: any, res) => {
    try {
      const matchId = req.params.id;
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      const stats = await storage.getMatchStats(matchId);
      
      res.json({ match, stats });
    } catch (error) {
      console.error("Error fetching match:", error);
      res.status(500).json({ message: "Failed to fetch match" });
    }
  });

  // Get user's match stats
  app.get('/api/users/:id/matches', isAuthenticated, async (req: any, res) => {
    try {
      const targetId = req.params.id;
      const matchStatsWithMatches = await storage.getUserMatchStatsWithMatches(targetId);
      res.json(matchStatsWithMatches);
    } catch (error) {
      console.error("Error fetching user match stats:", error);
      res.status(500).json({ message: "Failed to fetch user match stats" });
    }
  });

  // Get monthly stats for all players
  app.get('/api/stats/monthly', isAuthenticated, async (req: any, res) => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      // Get all matches from current month
      const allMatches = await storage.getAllMatches();
      const monthlyMatches = allMatches.filter(m => {
        const matchDate = new Date(m.date);
        return matchDate >= firstDayOfMonth && matchDate <= lastDayOfMonth;
      });
      
      // Get all users
      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map(u => [u.id, u]));
      
      // Calculate stats per player for the month
      const playerStats: Record<string, {
        userId: string;
        kills: number;
        deaths: number;
        assists: number;
        headshots: number;
        damage: number;
        mvps: number;
        matchesPlayed: number;
        matchesWon: number;
        total5ks: number;
        total4ks: number;
        total3ks: number;
        seenMatches: Set<string>;
      }> = {};
      
      for (const match of monthlyMatches) {
        const stats = await storage.getMatchStats(match.id);
        
        for (const stat of stats) {
          if (!playerStats[stat.userId]) {
            playerStats[stat.userId] = {
              userId: stat.userId,
              kills: 0,
              deaths: 0,
              assists: 0,
              headshots: 0,
              damage: 0,
              mvps: 0,
              matchesPlayed: 0,
              matchesWon: 0,
              total5ks: 0,
              total4ks: 0,
              total3ks: 0,
              seenMatches: new Set(),
            };
          }
          
          const ps = playerStats[stat.userId];
          ps.kills += stat.kills;
          ps.deaths += stat.deaths;
          ps.assists += stat.assists;
          ps.headshots += stat.headshots;
          ps.damage += stat.damage;
          ps.mvps += stat.mvps;
          ps.total5ks += stat.enemy5ks;
          ps.total4ks += stat.enemy4ks;
          ps.total3ks += stat.enemy3ks;
          
          // Count match only once per player (deduplicate by matchId)
          if (!ps.seenMatches.has(match.id)) {
            ps.seenMatches.add(match.id);
            ps.matchesPlayed += 1;
            
            // Check if player won this match by comparing their team with winnerTeam
            if (match.winnerTeam && stat.team === match.winnerTeam) {
              ps.matchesWon += 1;
            }
          }
        }
      }
      
      // Combine with user data (remove seenMatches Set before sending)
      const result = Object.values(playerStats).map(ps => {
        const user = userMap.get(ps.userId);
        const { seenMatches, ...statsWithoutSet } = ps;
        return {
          ...statsWithoutSet,
          user: user ? {
            id: user.id,
            nickname: user.nickname,
            firstName: user.firstName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            steamId64: user.steamId64,
            levelPoints: user.levelPoints,
          } : null,
        };
      }).filter(p => p.user !== null);
      
      res.json({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        monthName: now.toLocaleString('pt-BR', { month: 'long' }),
        players: result,
      });
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });

  // Merge two users (admin only)
  app.post('/api/users/merge', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { sourceUserId, targetUserId } = req.body;

      if (!sourceUserId || !targetUserId) {
        return res.status(400).json({ message: "sourceUserId e targetUserId são obrigatórios" });
      }

      if (sourceUserId === targetUserId) {
        return res.status(400).json({ message: "Não é possível mesclar um usuário consigo mesmo" });
      }

      const mergedUser = await storage.mergeUsers(sourceUserId, targetUserId);

      if (!mergedUser) {
        return res.status(404).json({ message: "Um ou ambos os usuários não foram encontrados" });
      }

      res.json({ 
        message: "Usuários mesclados com sucesso!", 
        user: mergedUser 
      });
    } catch (error) {
      console.error("Error merging users:", error);
      res.status(500).json({ message: "Erro ao mesclar usuários" });
    }
  });

  // Ban user (admin only, reversible)
  app.post('/api/users/:id/ban', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });

      const target = await storage.getUser(req.params.id);
      if (!target) return res.status(404).json({ message: "Usuário não encontrado" });
      if (target.isCheaterBanned) return res.status(400).json({ message: "Usuário com ban permanente (cheater) não pode ser banido novamente" });
      if (adminId === req.params.id) return res.status(400).json({ message: "Você não pode banir a si mesmo" });

      const banned = await storage.banUser(req.params.id);
      res.json({ message: "Usuário banido com sucesso", user: banned });
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ message: "Erro ao banir usuário" });
    }
  });

  // Unban user (admin only, only works for regular bans)
  app.post('/api/users/:id/unban', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });

      const target = await storage.getUser(req.params.id);
      if (!target) return res.status(404).json({ message: "Usuário não encontrado" });
      if (target.isCheaterBanned) return res.status(400).json({ message: "Ban de cheater é permanente e não pode ser revertido" });

      const unbanned = await storage.unbanUser(req.params.id);
      res.json({ message: "Usuário desbanido com sucesso", user: unbanned });
    } catch (error) {
      console.error("Error unbanning user:", error);
      res.status(500).json({ message: "Erro ao desbanir usuário" });
    }
  });

  // Cheater ban user (admin only, permanent - cannot be undone)
  app.post('/api/users/:id/cheater-ban', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });

      const target = await storage.getUser(req.params.id);
      if (!target) return res.status(404).json({ message: "Usuário não encontrado" });
      if (adminId === req.params.id) return res.status(400).json({ message: "Você não pode banir a si mesmo" });

      const banned = await storage.cheaterBanUser(req.params.id);

      res.json({ message: "Ban permanente aplicado com sucesso", user: banned });
    } catch (error) {
      console.error("Error cheater-banning user:", error);
      res.status(500).json({ message: "Erro ao aplicar ban de cheater" });
    }
  });

  // Payment routes
  app.get('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get('/api/users/:id/payments', isAuthenticated, async (req: any, res) => {
    try {
      const payments = await storage.getPaymentsByUser(req.params.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ message: "Failed to fetch user payments" });
    }
  });

  app.post('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const { userId: paymentUserId, amount, description, paymentDate } = req.body;

      if (!paymentUserId || typeof amount !== 'number') {
        return res.status(400).json({ message: "User ID and amount are required" });
      }

      const payment = await storage.createPayment({
        userId: paymentUserId,
        amount,
        description: description || '',
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        createdBy: userId,
      });

      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.delete('/api/payments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const deleted = await storage.deletePayment(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  // Report routes
  app.get('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { description, attachmentUrl, attachmentType, isAnonymous } = req.body;

      if (!description || typeof description !== 'string' || description.length < 10) {
        return res.status(400).json({ message: "A descrição deve ter pelo menos 10 caracteres" });
      }

      if (description.length > 2000) {
        return res.status(400).json({ message: "A descrição não pode exceder 2000 caracteres" });
      }

      let validatedAttachmentUrl: string | null = null;
      let validatedAttachmentType: string | null = null;

      if (attachmentUrl && typeof attachmentUrl === 'string') {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!attachmentType || !allowedTypes.includes(attachmentType)) {
          return res.status(400).json({ message: "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP." });
        }

        if (!attachmentUrl.startsWith('data:image/')) {
          return res.status(400).json({ message: "Formato de anexo inválido." });
        }

        const maxSizeBytes = 2 * 1024 * 1024;
        const base64Data = attachmentUrl.split(',')[1];
        if (base64Data) {
          const sizeBytes = (base64Data.length * 3) / 4;
          if (sizeBytes > maxSizeBytes) {
            return res.status(400).json({ message: "O anexo deve ter no máximo 2MB." });
          }
        }

        validatedAttachmentUrl = attachmentUrl;
        validatedAttachmentType = attachmentType;
      }

      const report = await storage.createReport({
        userId: isAnonymous ? null : userId,
        description,
        attachmentUrl: validatedAttachmentUrl,
        attachmentType: validatedAttachmentType,
        isAnonymous: isAnonymous || false,
        status: "pending",
      });

      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.patch('/api/reports/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const reportId = req.params.id;
      const { status, adminNotes } = req.body;

      const updatedReport = await storage.updateReport(reportId, {
        status,
        adminNotes,
        reviewedBy: userId,
      });

      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  app.delete('/api/reports/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const deleted = await storage.deleteReport(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ message: "Failed to delete report" });
    }
  });

  // Championship registration routes
  app.get('/api/championship-registrations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const registrations = await storage.getAllChampionshipRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching championship registrations:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.get('/api/championship-registrations/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const registration = await storage.getChampionshipRegistrationByUser(userId);
      res.json({ registered: !!registration, registration });
    } catch (error) {
      console.error("Error checking registration:", error);
      res.status(500).json({ message: "Failed to check registration" });
    }
  });

  app.post('/api/championship-registrations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      
      // Check if already registered
      const existing = await storage.getChampionshipRegistrationByUser(userId);
      if (existing) {
        return res.status(400).json({ message: "Already registered" });
      }

      const registration = await storage.createChampionshipRegistration({
        userId,
        status: "interested",
      });
      res.json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      res.status(500).json({ message: "Failed to create registration" });
    }
  });

  app.delete('/api/championship-registrations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const deleted = await storage.deleteChampionshipRegistration(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }

      res.json({ message: "Registration deleted successfully" });
    } catch (error) {
      console.error("Error deleting registration:", error);
      res.status(500).json({ message: "Failed to delete registration" });
    }
  });

  // Monthly Rankings endpoints (Admin only)
  app.get('/api/monthly-rankings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const rankings = await storage.getAllMonthlyRankings();
      res.json(rankings);
    } catch (error) {
      console.error("Error fetching monthly rankings:", error);
      res.status(500).json({ message: "Failed to fetch monthly rankings" });
    }
  });

  app.post('/api/monthly-rankings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const { month, year, rankings } = req.body;

      if (!month || !year || !rankings) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if ranking for this month/year already exists
      const existing = await storage.getMonthlyRankingByMonthYear(month, year);
      if (existing) {
        return res.status(400).json({ message: "Ranking para este mês já existe" });
      }

      const newRanking = await storage.createMonthlyRanking({
        month,
        year,
        rankings,
      });

      try {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0, 23, 59, 59);
        const allMatches = await storage.getAllMatches();
        const monthlyMatches = allMatches.filter(m => {
          const matchDate = new Date(m.date);
          return matchDate >= firstDay && matchDate <= lastDay;
        });

        if (monthlyMatches.length > 0) {
          const allUsers = await storage.getAllUsers();
          const userMap = new Map(allUsers.map(u => [u.id, u]));
          const playerStatsForTrophies: Record<string, any> = {};
          
          for (const match of monthlyMatches) {
            const stats = await storage.getMatchStats(match.id);
            for (const stat of stats) {
              if (!playerStatsForTrophies[stat.userId]) {
                playerStatsForTrophies[stat.userId] = {
                  userId: stat.userId, kills: 0, deaths: 0, assists: 0, headshots: 0,
                  damage: 0, mvps: 0, matchesPlayed: 0, matchesWon: 0,
                  total5ks: 0, total4ks: 0, total3ks: 0, seenMatches: new Set(),
                };
              }
              const ps = playerStatsForTrophies[stat.userId];
              ps.kills += stat.kills; ps.deaths += stat.deaths;
              ps.assists += stat.assists; ps.headshots += stat.headshots;
              ps.damage += stat.damage; ps.mvps += stat.mvps;
              ps.total5ks += stat.enemy5ks; ps.total4ks += stat.enemy4ks;
              ps.total3ks += stat.enemy3ks;
              if (!ps.seenMatches.has(match.id)) {
                ps.seenMatches.add(match.id);
                ps.matchesPlayed += 1;
                if (match.winnerTeam && stat.team === match.winnerTeam) ps.matchesWon += 1;
              }
            }
          }

          const qualified = Object.values(playerStatsForTrophies).filter((s: any) => {
            if (s.matchesPlayed < 3) return false;
            const u = userMap.get(s.userId);
            return !!u && !u.isBanned && !u.isCheaterBanned;
          });
          if (qualified.length > 0) {
            await storage.deleteTrophiesByMonthYear(month, year);
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            for (const def of TROPHY_DEFINITIONS) {
              try {
                const winner = def.getWinner(qualified);
                if (winner) {
                  const userExists = await storage.getUser(winner.userId);
                  if (!userExists) {
                    console.warn(`[Trophy] Skipping ${def.type}: userId ${winner.userId} not found in users table`);
                    continue;
                  }
                  await storage.createTrophy({
                    userId: winner.userId, type: def.type, month, year,
                    title: `${def.title} - ${monthNames[month - 1]}/${year}`,
                    description: def.description, value: winner.value,
                  });
                }
              } catch (trophyDefError) {
                console.error(`[Trophy] Error creating ${def.type} trophy:`, trophyDefError);
              }
            }
          }
        }
      } catch (trophyError) {
        console.error("Error auto-generating trophies:", trophyError);
      }

      res.json(newRanking);
    } catch (error) {
      console.error("Error creating monthly ranking:", error);
      res.status(500).json({ message: "Failed to create monthly ranking" });
    }
  });

  app.delete('/api/monthly-rankings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const deleted = await storage.deleteMonthlyRanking(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Ranking not found" });
      }

      res.json({ message: "Ranking deleted successfully" });
    } catch (error) {
      console.error("Error deleting monthly ranking:", error);
      res.status(500).json({ message: "Failed to delete monthly ranking" });
    }
  });

  // ============ TROPHY ROUTES ============

  app.get('/api/trophies/user/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const userTrophies = await storage.getUserTrophies(req.params.userId);
      res.json(userTrophies);
    } catch (error) {
      console.error("Error fetching user trophies:", error);
      res.status(500).json({ message: "Failed to fetch trophies" });
    }
  });

  app.get('/api/trophies', isAuthenticated, async (req: any, res) => {
    try {
      const allTrophies = await storage.getAllTrophies();
      res.json(allTrophies);
    } catch (error) {
      console.error("Error fetching trophies:", error);
      res.status(500).json({ message: "Failed to fetch trophies" });
    }
  });

  const TROPHY_DEFINITIONS = [
    {
      type: "best_player",
      title: "Craque do Mês",
      description: "O cara é brabo demais! Melhor jogador do mês, carregou o time nas costas.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => calculateSkillRating(b) - calculateSkillRating(a));
        return { ...sorted[0], value: `SR: ${calculateSkillRating(sorted[0])}` };
      }
    },
    {
      type: "best_kd",
      title: "Matador Nato",
      description: "Esse aí não morre de graça! Maior K/D do mês, os inimigos que se escondam.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const kdA = a.deaths > 0 ? a.kills / a.deaths : a.kills;
          const kdB = b.deaths > 0 ? b.kills / b.deaths : b.kills;
          return kdB - kdA;
        });
        const kd = sorted[0].deaths > 0 ? (sorted[0].kills / sorted[0].deaths).toFixed(2) : sorted[0].kills.toFixed(2);
        return { ...sorted[0], value: `K/D: ${kd}` };
      }
    },
    {
      type: "best_assists",
      title: "Amigão do Server",
      description: "Não mata, mas ajuda! Maior média de assistências do mês. O verdadeiro team player.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const avgA = a.matchesPlayed > 0 ? a.assists / a.matchesPlayed : 0;
          const avgB = b.matchesPlayed > 0 ? b.assists / b.matchesPlayed : 0;
          return avgB - avgA;
        });
        const avg = sorted[0].matchesPlayed > 0 ? (sorted[0].assists / sorted[0].matchesPlayed).toFixed(1) : "0";
        return { ...sorted[0], value: `Média: ${avg} assists/partida` };
      }
    },
    {
      type: "best_hs",
      title: "Mira de Aimbot",
      description: "Só na cabeça! Melhor percentual de headshot. Se não fosse amigo, já tinha sido reportado.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const hsA = a.kills > 0 ? (a.headshots / a.kills) * 100 : 0;
          const hsB = b.kills > 0 ? (b.headshots / b.kills) * 100 : 0;
          return hsB - hsA;
        });
        const hs = sorted[0].kills > 0 ? ((sorted[0].headshots / sorted[0].kills) * 100).toFixed(1) : "0";
        return { ...sorted[0], value: `HS: ${hs}%` };
      }
    },
    {
      type: "most_matches",
      title: "Viciado Oficial",
      description: "Esse aí não larga o PC! Jogou mais partidas que todo mundo. Precisa de uma intervenção.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => b.matchesPlayed - a.matchesPlayed);
        return { ...sorted[0], value: `${sorted[0].matchesPlayed} partidas` };
      }
    },
    {
      type: "worst_player",
      title: "Troféu Abacaxi",
      description: "Alguém tem que ser o último... Pior skill rating do mês. Mas pelo menos jogou, né?",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => calculateSkillRating(a) - calculateSkillRating(b));
        return { ...sorted[0], value: `SR: ${calculateSkillRating(sorted[0])}` };
      }
    },
    {
      type: "worst_kd",
      title: "Ímã de Bala",
      description: "Esse aí morre mais que personagem de novela! Menor K/D do mês. Os inimigos agradecem.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const kdA = a.deaths > 0 ? a.kills / a.deaths : a.kills;
          const kdB = b.deaths > 0 ? b.kills / b.deaths : b.kills;
          return kdA - kdB;
        });
        const kd = sorted[0].deaths > 0 ? (sorted[0].kills / sorted[0].deaths).toFixed(2) : "0";
        return { ...sorted[0], value: `K/D: ${kd}` };
      }
    },
    {
      type: "best_kills_avg",
      title: "Ceifador",
      description: "Esse aí não veio pra brincar! Maior média de kills por partida. Linha de frente sempre.",
      getWinner: (stats: any[]) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const avgA = a.matchesPlayed > 0 ? a.kills / a.matchesPlayed : 0;
          const avgB = b.matchesPlayed > 0 ? b.kills / b.matchesPlayed : 0;
          return avgB - avgA;
        });
        const avg = sorted[0].matchesPlayed > 0 ? (sorted[0].kills / sorted[0].matchesPlayed).toFixed(1) : "0";
        return { ...sorted[0], value: `Média: ${avg} kills/partida` };
      }
    },
  ];

  function calculateSkillRating(stats: any): number {
    const kd = stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills;
    const hsPercent = stats.kills > 0 ? (stats.headshots / stats.kills) * 100 : 0;
    const winRate = stats.matchesPlayed > 0 ? (stats.matchesWon / stats.matchesPlayed) * 100 : 0;
    const estimatedRounds = stats.matchesPlayed * 24;
    const adr = estimatedRounds > 0 ? stats.damage / estimatedRounds : 0;
    
    let sr = 1000;
    sr += (kd - 1) * 150;
    sr += (hsPercent - 30) * 2;
    sr += (adr - 70) * 1.5;
    sr += (winRate - 50) * 3;
    sr += (stats.mvps || 0) * 2;
    sr += (stats.total5ks || 0) * 30;
    sr += (stats.total4ks || 0) * 15;
    sr += (stats.total3ks || 0) * 5;
    
    return Math.max(100, Math.min(3000, Math.round(sr)));
  }

  app.post('/api/trophies/generate/:year/:month', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      const month = parseInt(req.params.month);
      const year = parseInt(req.params.year);

      if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
        return res.status(400).json({ message: "Invalid month or year" });
      }

      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0, 23, 59, 59);
      
      const allMatches = await storage.getAllMatches();
      const monthlyMatches = allMatches.filter(m => {
        const matchDate = new Date(m.date);
        return matchDate >= firstDay && matchDate <= lastDay;
      });

      if (monthlyMatches.length === 0) {
        return res.status(400).json({ message: "Nenhuma partida encontrada neste mês" });
      }

      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map(u => [u.id, u]));

      const playerStats: Record<string, any> = {};
      
      for (const match of monthlyMatches) {
        const stats = await storage.getMatchStats(match.id);
        
        for (const stat of stats) {
          if (!playerStats[stat.userId]) {
            playerStats[stat.userId] = {
              userId: stat.userId,
              kills: 0, deaths: 0, assists: 0, headshots: 0,
              damage: 0, mvps: 0, matchesPlayed: 0, matchesWon: 0,
              total5ks: 0, total4ks: 0, total3ks: 0,
              seenMatches: new Set(),
            };
          }
          
          const ps = playerStats[stat.userId];
          ps.kills += stat.kills;
          ps.deaths += stat.deaths;
          ps.assists += stat.assists;
          ps.headshots += stat.headshots;
          ps.damage += stat.damage;
          ps.mvps += stat.mvps;
          ps.total5ks += stat.enemy5ks;
          ps.total4ks += stat.enemy4ks;
          ps.total3ks += stat.enemy3ks;
          
          if (!ps.seenMatches.has(match.id)) {
            ps.seenMatches.add(match.id);
            ps.matchesPlayed += 1;
            if (match.winnerTeam && stat.team === match.winnerTeam) {
              ps.matchesWon += 1;
            }
          }
        }
      }

      const qualifiedStats = Object.values(playerStats).filter((s: any) => {
        if (s.matchesPlayed < 3) return false;
        const u = userMap.get(s.userId);
        return !!u && !u.isBanned && !u.isCheaterBanned;
      });

      if (qualifiedStats.length === 0) {
        return res.status(400).json({ message: "Nenhum jogador com 3+ partidas neste mês" });
      }

      await storage.deleteTrophiesByMonthYear(month, year);

      const createdTrophies = [];
      const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const monthName = monthNames[month - 1];

      for (const def of TROPHY_DEFINITIONS) {
        try {
          const winner = def.getWinner(qualifiedStats);
          if (winner) {
            const userExists = await storage.getUser(winner.userId);
            if (!userExists) {
              console.warn(`[Trophy Manual] Skipping ${def.type}: userId ${winner.userId} not found`);
              continue;
            }
            const trophy = await storage.createTrophy({
              userId: winner.userId,
              type: def.type,
              month,
              year,
              title: `${def.title} - ${monthName}/${year}`,
              description: def.description,
              value: winner.value,
            });
            createdTrophies.push(trophy);
          }
        } catch (defError) {
          console.error(`[Trophy Manual] Error creating ${def.type}:`, defError);
        }
      }

      res.json({ 
        message: `${createdTrophies.length} troféus gerados para ${monthName}/${year}`,
        trophies: createdTrophies 
      });
    } catch (error) {
      console.error("Error generating trophies:", error);
      res.status(500).json({ message: "Failed to generate trophies" });
    }
  });

  // ============ AUTO TROPHY GENERATION ============

  async function generateTrophiesForMonth(month: number, year: number): Promise<any[]> {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);
    
    const allMatches = await storage.getAllMatches();
    const monthlyMatches = allMatches.filter(m => {
      const matchDate = new Date(m.date);
      return matchDate >= firstDay && matchDate <= lastDay;
    });

    if (monthlyMatches.length === 0) return [];

    const allUsers = await storage.getAllUsers();
    const userMap = new Map(allUsers.map(u => [u.id, u]));

    const playerStats: Record<string, any> = {};
    
    for (const match of monthlyMatches) {
      const stats = await storage.getMatchStats(match.id);
      
      for (const stat of stats) {
        if (!playerStats[stat.userId]) {
          playerStats[stat.userId] = {
            userId: stat.userId,
            kills: 0, deaths: 0, assists: 0, headshots: 0,
            damage: 0, mvps: 0, matchesPlayed: 0, matchesWon: 0,
            total5ks: 0, total4ks: 0, total3ks: 0,
            seenMatches: new Set(),
          };
        }
        
        const ps = playerStats[stat.userId];
        ps.kills += stat.kills;
        ps.deaths += stat.deaths;
        ps.assists += stat.assists;
        ps.headshots += stat.headshots;
        ps.damage += stat.damage;
        ps.mvps += stat.mvps;
        ps.total5ks += stat.enemy5ks;
        ps.total4ks += stat.enemy4ks;
        ps.total3ks += stat.enemy3ks;
        
        if (!ps.seenMatches.has(match.id)) {
          ps.seenMatches.add(match.id);
          ps.matchesPlayed += 1;
          if (match.winnerTeam && stat.team === match.winnerTeam) {
            ps.matchesWon += 1;
          }
        }
      }
    }

    const qualifiedStats = Object.values(playerStats).filter((s: any) => {
      if (s.matchesPlayed < 3) return false;
      const u = userMap.get(s.userId);
      return !!u && !u.isBanned && !u.isCheaterBanned;
    });
    if (qualifiedStats.length === 0) return [];

    await storage.deleteTrophiesByMonthYear(month, year);

    const createdTrophies = [];
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthName = monthNames[month - 1];

    for (const def of TROPHY_DEFINITIONS) {
      try {
        const winner = def.getWinner(qualifiedStats);
        if (winner) {
          const userExists = await storage.getUser(winner.userId);
          if (!userExists) {
            console.warn(`[Auto Trophy] Skipping ${def.type}: userId ${winner.userId} not found in users table, picking next qualified player...`);
            // Try the next best player
            const remaining = qualifiedStats.filter((s: any) => s.userId !== winner.userId);
            const nextWinner = remaining.length > 0 ? def.getWinner(remaining) : null;
            if (nextWinner) {
              const nextUserExists = await storage.getUser(nextWinner.userId);
              if (nextUserExists) {
                const trophy = await storage.createTrophy({
                  userId: nextWinner.userId, type: def.type, month, year,
                  title: `${def.title} - ${monthName}/${year}`,
                  description: def.description,
                  value: nextWinner.value,
                });
                createdTrophies.push(trophy);
                console.log(`[Auto Trophy] Created ${def.type} trophy for backup winner ${nextWinner.userId}`);
              }
            }
            continue;
          }
          const trophy = await storage.createTrophy({
            userId: winner.userId,
            type: def.type,
            month,
            year,
            title: `${def.title} - ${monthName}/${year}`,
            description: def.description,
            value: winner.value,
          });
          createdTrophies.push(trophy);
          console.log(`[Auto Trophy] Created ${def.type} trophy for ${winner.userId}`);
        }
      } catch (defError) {
        console.error(`[Auto Trophy] Error creating ${def.type} trophy:`, defError);
      }
    }

    return createdTrophies;
  }

  async function checkAndGenerateMonthlyTrophies() {
    try {
      const now = new Date();
      const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const existingTrophies = await storage.getAllTrophies();
      const hasPrevMonthTrophies = existingTrophies.some(
        (t: any) => t.month === prevMonth && t.year === prevYear
      );

      if (!hasPrevMonthTrophies) {
        console.log(`[Auto Trophy] No trophies found for ${prevMonth}/${prevYear}, generating...`);
        const trophies = await generateTrophiesForMonth(prevMonth, prevYear);
        if (trophies.length > 0) {
          console.log(`[Auto Trophy] Generated ${trophies.length} trophies for ${prevMonth}/${prevYear}`);
        } else {
          console.log(`[Auto Trophy] No qualified players for ${prevMonth}/${prevYear} (need 3+ matches)`);
        }
      } else {
        console.log(`[Auto Trophy] Trophies already exist for ${prevMonth}/${prevYear}`);
      }
    } catch (error) {
      console.error("[Auto Trophy] Error checking/generating trophies:", error);
    }
  }

  if (!process.env.VERCEL) {
    setTimeout(() => checkAndGenerateMonthlyTrophies(), 5000);
    setInterval(() => checkAndGenerateMonthlyTrophies(), 24 * 60 * 60 * 1000);
  }

  // ============ CASINO ROUTES ============

  // Get user's casino balance
  app.get('/api/casino/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const balance = await storage.getOrCreateCasinoBalance(userId);
      res.json(balance);
    } catch (error) {
      console.error("Error getting casino balance:", error);
      res.status(500).json({ message: "Failed to get balance" });
    }
  });

  // Get user's casino transactions
  app.get('/api/casino/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const transactions = await storage.getCasinoTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error getting transactions:", error);
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Get user's bets
  app.get('/api/casino/bets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const userBets = await storage.getUserBets(userId);
      res.json(userBets);
    } catch (error) {
      console.error("Error getting bets:", error);
      res.status(500).json({ message: "Failed to get bets" });
    }
  });

  // Calculate odds for a player bet
  app.post('/api/casino/calculate-odds', isAuthenticated, async (req: any, res) => {
    try {
      const { targetPlayerId, items } = req.body;
      
      const targetPlayer = await storage.getUser(targetPlayerId);
      if (!targetPlayer) {
        return res.status(404).json({ message: "Jogador não encontrado" });
      }

      // Calculate odds based on player's historical stats
      const totalMatches = targetPlayer.totalMatches || 1;
      const avgKills = (targetPlayer.totalKills || 0) / totalMatches;
      const avgDeaths = (targetPlayer.totalDeaths || 0) / totalMatches;
      const avgKD = avgDeaths > 0 ? avgKills / avgDeaths : avgKills;
      const avgHeadshots = (targetPlayer.totalHeadshots || 0) / totalMatches;
      const avgMvps = (targetPlayer.totalMvps || 0) / totalMatches;
      const avgDamage = (targetPlayer.totalDamage || 0) / totalMatches;
      const winRate = totalMatches > 0 ? ((targetPlayer.matchesWon || 0) / totalMatches) * 100 : 50;

      const calculatedItems = items.map((item: { betType: string; targetValue: number }) => {
        let odds = 1.5; // Base odds
        
        switch (item.betType) {
          case 'kills_over':
            // Higher target = higher odds, based on how far from average
            const killsDiff = item.targetValue - avgKills;
            odds = Math.max(1.1, 1.5 + (killsDiff * 0.15));
            break;
          case 'kills_under':
            const killsUnderDiff = avgKills - item.targetValue;
            odds = Math.max(1.1, 1.5 + (killsUnderDiff * 0.15));
            break;
          case 'deaths_under':
            const deathsDiff = avgDeaths - item.targetValue;
            odds = Math.max(1.1, 1.5 + (deathsDiff * 0.2));
            break;
          case 'kd_over':
            const kdDiff = item.targetValue - avgKD;
            odds = Math.max(1.1, 1.5 + (kdDiff * 0.5));
            break;
          case 'headshots_over':
            const hsDiff = item.targetValue - avgHeadshots;
            odds = Math.max(1.1, 1.5 + (hsDiff * 0.1));
            break;
          case 'mvps_over':
            const mvpDiff = item.targetValue - avgMvps;
            odds = Math.max(1.1, 2.0 + (mvpDiff * 0.8));
            break;
          case 'damage_over':
            const dmgDiff = (item.targetValue - avgDamage) / 100;
            odds = Math.max(1.1, 1.5 + (dmgDiff * 0.3));
            break;
          case 'win':
            // Based on win rate
            odds = winRate > 50 ? Math.max(1.1, 1.5 + ((100 - winRate) / 50)) : Math.max(1.1, 1.5 + (winRate / 50));
            break;
        }

        return {
          ...item,
          odds: Math.round(odds * 100) / 100, // Round to 2 decimal places
        };
      });

      res.json({
        player: {
          id: targetPlayer.id,
          nickname: targetPlayer.nickname || targetPlayer.firstName,
          avgKills: Math.round(avgKills * 10) / 10,
          avgKD: Math.round(avgKD * 100) / 100,
          avgHeadshots: Math.round(avgHeadshots * 10) / 10,
          winRate: Math.round(winRate),
        },
        items: calculatedItems,
        totalOdds: Math.round(calculatedItems.reduce((acc: number, item: any) => acc * item.odds, 1) * 100) / 100,
      });
    } catch (error) {
      console.error("Error calculating odds:", error);
      res.status(500).json({ message: "Failed to calculate odds" });
    }
  });

  // Place a bet
  app.post('/api/casino/bets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { targetPlayerId, amount, items } = req.body;

      // Validate minimum bet
      if (amount < 10) {
        return res.status(400).json({ message: "Aposta mínima é R$10" });
      }

      // Can't bet on yourself
      if (targetPlayerId === userId) {
        return res.status(400).json({ message: "Você não pode apostar em você mesmo!" });
      }

      // Check if player exists
      const targetPlayer = await storage.getUser(targetPlayerId);
      if (!targetPlayer) {
        return res.status(404).json({ message: "Jogador não encontrado" });
      }

      // Calculate odds for each item
      const totalMatches = targetPlayer.totalMatches || 1;
      const avgKills = (targetPlayer.totalKills || 0) / totalMatches;
      const avgDeaths = (targetPlayer.totalDeaths || 0) / totalMatches;
      const avgKD = avgDeaths > 0 ? avgKills / avgDeaths : avgKills;
      const avgHeadshots = (targetPlayer.totalHeadshots || 0) / totalMatches;
      const avgMvps = (targetPlayer.totalMvps || 0) / totalMatches;
      const avgDamage = (targetPlayer.totalDamage || 0) / totalMatches;
      const winRate = totalMatches > 0 ? ((targetPlayer.matchesWon || 0) / totalMatches) * 100 : 50;

      const itemsWithOdds = items.map((item: { betType: string; targetValue: number }) => {
        let odds = 1.5;
        
        switch (item.betType) {
          case 'kills_over':
            odds = Math.max(1.1, 1.5 + ((item.targetValue - avgKills) * 0.15));
            break;
          case 'kills_under':
            odds = Math.max(1.1, 1.5 + ((avgKills - item.targetValue) * 0.15));
            break;
          case 'deaths_under':
            odds = Math.max(1.1, 1.5 + ((avgDeaths - item.targetValue) * 0.2));
            break;
          case 'kd_over':
            odds = Math.max(1.1, 1.5 + ((item.targetValue - avgKD) * 0.5));
            break;
          case 'headshots_over':
            odds = Math.max(1.1, 1.5 + ((item.targetValue - avgHeadshots) * 0.1));
            break;
          case 'mvps_over':
            odds = Math.max(1.1, 2.0 + ((item.targetValue - avgMvps) * 0.8));
            break;
          case 'damage_over':
            odds = Math.max(1.1, 1.5 + (((item.targetValue - avgDamage) / 100) * 0.3));
            break;
          case 'win':
            odds = winRate > 50 ? Math.max(1.1, 1.5 + ((100 - winRate) / 50)) : Math.max(1.1, 1.5 + (winRate / 50));
            break;
        }

        return {
          ...item,
          odds: Math.round(odds * 100) / 100,
        };
      });

      const bet = await storage.createBet(userId, targetPlayerId, amount, itemsWithOdds);
      
      if (!bet) {
        return res.status(400).json({ message: "Saldo insuficiente para essa aposta" });
      }

      res.json(bet);
    } catch (error) {
      console.error("Error placing bet:", error);
      res.status(500).json({ message: "Erro ao registrar aposta" });
    }
  });

  // Delete a pending bet
  app.delete('/api/casino/bets/:betId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { betId } = req.params;

      const result = await storage.deleteBet(betId, userId);
      
      if (!result.success) {
        return res.status(400).json({ message: "Não foi possível cancelar a aposta. Apenas apostas pendentes podem ser canceladas." });
      }

      res.json({ 
        success: true, 
        message: "Aposta cancelada com sucesso!", 
        refundAmount: result.refundAmount 
      });
    } catch (error) {
      console.error("Error deleting bet:", error);
      res.status(500).json({ message: "Erro ao cancelar aposta" });
    }
  });

  // Play slot machine (Tigrinho)
  app.post('/api/casino/slot', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { amount } = req.body;

      if (amount < 10) {
        return res.status(400).json({ message: "Aposta mínima é R$10" });
      }

      // Check balance and deduct bet
      const balance = await storage.getOrCreateCasinoBalance(userId);
      if (balance.balance < amount) {
        return res.status(400).json({ message: "Saldo insuficiente" });
      }

      // 10% chance to win
      const won = Math.random() < 0.10;
      
      let multiplier = 0;
      let result = 'lost';
      
      if (won) {
        // Random multiplier between 2x and 50x
        multiplier = Math.random() < 0.8 
          ? 2 + Math.random() * 8  // 80% chance: 2x-10x
          : 10 + Math.random() * 40; // 20% chance: 10x-50x
        multiplier = Math.round(multiplier * 10) / 10;
        result = 'won';
      }

      const winnings = won ? amount * multiplier : 0;
      const netResult = winnings - amount;

      // Update balance
      await storage.updateCasinoBalance(
        userId, 
        netResult, 
        won ? 'slot_win' : 'slot_loss',
        won ? `Tigrinho: Ganhou ${multiplier}x! (R$${winnings.toLocaleString('pt-BR')})` : `Tigrinho: Perdeu R$${amount.toLocaleString('pt-BR')}`
      );

      // Get updated balance
      const newBalance = await storage.getCasinoBalance(userId);

      res.json({
        won,
        multiplier,
        betAmount: amount,
        winnings,
        newBalance: newBalance?.balance || 0,
        symbols: generateSlotSymbols(won), // Visual symbols for frontend
      });
    } catch (error) {
      console.error("Error playing slot:", error);
      res.status(500).json({ message: "Erro no jogo" });
    }
  });

  // Open case (CS:GO case simulation)
  app.post('/api/casino/case', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const { caseType } = req.body;

      // Case prices
      const casePrices: Record<string, number> = {
        'basic': 5000,
        'premium': 25000,
        'elite': 100000,
        'legendary': 500000,
      };

      const price = casePrices[caseType] || casePrices.basic;

      // Check balance
      const balance = await storage.getOrCreateCasinoBalance(userId);
      if (balance.balance < price) {
        return res.status(400).json({ message: "Saldo insuficiente para abrir essa caixa" });
      }

      // Generate random item with weighted rarity - 30% total win chance with 2x-50x
      const roll = Math.random() * 100;
      let rarity: string;
      let multiplier: number;
      
      if (roll < 40) {
        rarity = 'Consumidor'; // 40% - always loss (0.1x - 0.9x)
        multiplier = 0.1 + Math.random() * 0.8;
      } else if (roll < 70) {
        rarity = 'Industrial'; // 30% - wins start here (2x - 5x)
        multiplier = 2.0 + Math.random() * 3.0;
      } else if (roll < 88) {
        rarity = 'Militar'; // 18% - medium win (5x - 15x)
        multiplier = 5.0 + Math.random() * 10.0;
      } else if (roll < 96) {
        rarity = 'Restrito'; // 8% - good win (15x - 30x)
        multiplier = 15.0 + Math.random() * 15.0;
      } else if (roll < 99.5) {
        rarity = 'Secreto'; // 3.5% - great win (30x - 50x)
        multiplier = 30.0 + Math.random() * 20.0;
      } else {
        rarity = 'Faca/Luva'; // 0.5% - jackpot (50x)
        multiplier = 50.0;
      }

      multiplier = Math.round(multiplier * 100) / 100;
      const value = Math.round(price * multiplier);
      const netResult = value - price;

      // Generate random skin name
      const skins = generateRandomSkin(rarity);

      // Update balance
      await storage.updateCasinoBalance(
        userId,
        netResult,
        'case_opening',
        `Caixa ${caseType}: ${skins.name} (${rarity}) - R$${value.toLocaleString('pt-BR')}`
      );

      const newBalance = await storage.getCasinoBalance(userId);

      res.json({
        item: {
          name: skins.name,
          rarity,
          value,
          multiplier,
          weapon: skins.weapon,
          skin: skins.skin,
        },
        casePrice: price,
        profit: netResult,
        newBalance: newBalance?.balance || 0,
      });
    } catch (error) {
      console.error("Error opening case:", error);
      res.status(500).json({ message: "Erro ao abrir caixa" });
    }
  });

  // Mix availability routes
  app.get('/api/mix/availability/:date', isAuthenticated, async (req: any, res) => {
    try {
      const { date } = req.params;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Data inválida. Use o formato YYYY-MM-DD" });
      }
      const list = await storage.getMixList(date);
      res.json(list);
    } catch (error) {
      console.error("Error fetching mix list:", error);
      res.status(500).json({ message: "Erro ao buscar lista do mix" });
    }
  });

  app.post('/api/mix/availability/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const joinSchema = z.object({
        listDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        isSub: z.boolean().optional().default(false),
      });
      
      const parsed = joinSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }
      
      let { listDate, isSub } = parsed.data;

      const penaltyCount = await storage.getActivePenaltyCount(userId);

      if (penaltyCount >= 3) {
        return res.status(403).json({
          message: "Você está suspenso por 1 lista devido a faltas repetidas. Aguarde a próxima lista.",
          penaltyCount,
          suspended: true,
        });
      }

      if (penaltyCount >= 1 && !isSub) {
        isSub = true;
      }

      const entry = await storage.joinMixList(userId, listDate, isSub);
      if (!entry) {
        return res.status(400).json({ message: "Você já está na lista deste dia" });
      }
      res.json({ ...entry, forcedSub: penaltyCount >= 1 && !parsed.data.isSub });
    } catch (error) {
      console.error("Error joining mix list:", error);
      res.status(500).json({ message: "Erro ao entrar na lista" });
    }
  });

  app.post('/api/mix/availability/leave', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const leaveSchema = z.object({
        listDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
      });
      
      const parsed = leaveSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }
      
      const { listDate } = parsed.data;

      const success = await storage.leaveMixList(userId, listDate);
      if (!success) {
        return res.status(400).json({ message: "Você não está na lista deste dia" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error leaving mix list:", error);
      res.status(500).json({ message: "Erro ao sair da lista" });
    }
  });

  // Admin: add a player to the mix list
  app.post('/api/mix/availability/admin-add', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem adicionar jogadores na lista" });
      }

      const addSchema = z.object({
        listDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        userId: z.string().min(1),
        isSub: z.boolean().optional().default(false),
      });

      const parsed = addSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }

      const { listDate, userId, isSub } = parsed.data;

      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const entry = await storage.joinMixList(userId, listDate, isSub);
      if (!entry) {
        return res.status(400).json({ message: "Jogador já está na lista deste dia" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error admin adding to mix list:", error);
      res.status(500).json({ message: "Erro ao adicionar jogador na lista" });
    }
  });

  // Admin: remove a player from the mix list without penalty
  app.post('/api/mix/availability/admin-remove', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem remover jogadores da lista" });
      }

      const removeSchema = z.object({
        listDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        userId: z.string().min(1),
      });

      const parsed = removeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }

      const success = await storage.leaveMixList(parsed.data.userId, parsed.data.listDate);
      if (!success) {
        return res.status(400).json({ message: "Jogador não está na lista deste dia" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error admin removing from mix list:", error);
      res.status(500).json({ message: "Erro ao remover jogador da lista" });
    }
  });

  app.get('/api/mix/penalties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem ver todas as penalidades" });
      }
      const penalties = await storage.getAllPenalties();
      res.json(penalties);
    } catch (error) {
      console.error("Error fetching all penalties:", error);
      res.status(500).json({ message: "Erro ao buscar penalidades" });
    }
  });

  app.post('/api/mix/penalties', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem aplicar penalidades" });
      }

      const penaltySchema = z.object({
        userId: z.string(),
        listDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
      });

      const parsed = penaltySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }

      const penalty = await storage.addPenalty(parsed.data.userId, parsed.data.listDate);
      res.json(penalty);
    } catch (error) {
      console.error("Error adding penalty:", error);
      res.status(500).json({ message: "Erro ao aplicar penalidade" });
    }
  });

  // Get user's penalty status
  app.get('/api/mix/penalties/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const penalties = await storage.getUserPenalties(userId);
      const count = penalties.length;
      res.json({
        penalties,
        count,
        forcedSub: count >= 1 && count < 3,
        suspended: count >= 3,
      });
    } catch (error) {
      console.error("Error fetching penalties:", error);
      res.status(500).json({ message: "Erro ao buscar penalidades" });
    }
  });

  // Admin: confirm who played from the mix list
  app.post('/api/mix/confirm-played', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem confirmar a lista" });
      }

      const confirmSchema = z.object({
        listDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        playedUserIds: z.array(z.string()),
      });

      const parsed = confirmSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }

      const { listDate, playedUserIds } = parsed.data;
      const listUserIds = await storage.getMixListUserIds(listDate);
      const playedSet = new Set(playedUserIds);

      const noShowUsers: string[] = [];
      for (const uid of listUserIds) {
        if (!playedSet.has(uid)) {
          await storage.addPenalty(uid, listDate);
          noShowUsers.push(uid);
        }
      }

      res.json({
        confirmed: true,
        listDate,
        totalInList: listUserIds.length,
        totalPlayed: playedUserIds.length,
        noShowCount: noShowUsers.length,
        noShowUserIds: noShowUsers,
      });
    } catch (error) {
      console.error("Error confirming mix list:", error);
      res.status(500).json({ message: "Erro ao confirmar lista" });
    }
  });

  // Admin: clear penalties for a user
  app.delete('/api/mix/penalties/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const adminId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem limpar penalidades" });
      }

      const { userId } = req.params;
      await db.delete(mixPenalties).where(eq(mixPenalties.userId, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing penalties:", error);
      res.status(500).json({ message: "Erro ao limpar penalidades" });
    }
  });

  // Monthly stats with month/year parameter for history
  app.get('/api/stats/monthly/:year/:month', isAuthenticated, async (req: any, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Mês ou ano inválido" });
      }

      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59);

      const allMatches = await storage.getAllMatches();
      const monthlyMatches = allMatches.filter(m => {
        const matchDate = new Date(m.date);
        return matchDate >= firstDayOfMonth && matchDate <= lastDayOfMonth;
      });

      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map(u => [u.id, u]));

      const playerStats: Record<string, {
        userId: string;
        kills: number; deaths: number; assists: number;
        headshots: number; damage: number; mvps: number;
        matchesPlayed: number; matchesWon: number;
        total5ks: number; total4ks: number; total3ks: number;
        seenMatches: Set<string>;
      }> = {};

      for (const match of monthlyMatches) {
        const stats = await storage.getMatchStats(match.id);
        for (const stat of stats) {
          if (!playerStats[stat.userId]) {
            playerStats[stat.userId] = {
              userId: stat.userId,
              kills: 0, deaths: 0, assists: 0,
              headshots: 0, damage: 0, mvps: 0,
              matchesPlayed: 0, matchesWon: 0,
              total5ks: 0, total4ks: 0, total3ks: 0,
              seenMatches: new Set(),
            };
          }
          const ps = playerStats[stat.userId];
          ps.kills += stat.kills;
          ps.deaths += stat.deaths;
          ps.assists += stat.assists;
          ps.headshots += stat.headshots;
          ps.damage += stat.damage;
          ps.mvps += stat.mvps;
          ps.total5ks += stat.enemy5ks;
          ps.total4ks += stat.enemy4ks;
          ps.total3ks += stat.enemy3ks;

          if (!ps.seenMatches.has(match.id)) {
            ps.seenMatches.add(match.id);
            ps.matchesPlayed += 1;
            // Check if player won this match by comparing their team with winnerTeam
            if (match.winnerTeam && stat.team === match.winnerTeam) {
              ps.matchesWon += 1;
            }
          }
        }
      }

      // Calculate monthly LP per player based on match performance
      const playerMonthlyLP: Record<string, number> = {};
      for (const match of monthlyMatches) {
        const stats = await storage.getMatchStats(match.id);
        for (const stat of stats) {
          const matchRounds = (match.team1Score || 0) + (match.team2Score || 0);
          let wonMatch = false;
          if (match.winnerTeam) {
            wonMatch = match.winnerTeam === stat.team;
          } else {
            const isTeam1 = stat.team === match.team1Name;
            const t1 = match.team1Score || 0;
            const t2 = match.team2Score || 0;
            wonMatch = isTeam1 ? t1 > t2 : t2 > t1;
          }
          const kills          = Number(stat.kills)          || 0;
          const damage         = Number(stat.damage)         || 0;
          const rounds         = matchRounds || 24;
          const entryWins      = Number(stat.entryWins)      || 0;
          const entryCount     = Number(stat.entryCount)     || 0;
          const utilityDamage  = Number(stat.utilityDamage)  || 0;
          const enemiesFlashed = Number(stat.enemiesFlashed) || 0;
          const v1Wins         = Number(stat.v1Wins)         || 0;
          const v2Wins         = Number(stat.v2Wins)         || 0;
          const lp = calcMatchLP(wonMatch, kills, damage, rounds, entryWins, entryCount, utilityDamage, enemiesFlashed, v1Wins, v2Wins);
          playerMonthlyLP[stat.userId] = (playerMonthlyLP[stat.userId] ?? 0) + lp;
        }
      }

      const result = Object.values(playerStats).map(ps => {
        const user = userMap.get(ps.userId);
        const { seenMatches, ...statsWithoutSet } = ps;
        return {
          ...statsWithoutSet,
          monthlyLevelPoints: playerMonthlyLP[ps.userId] ?? 0,
          user: user ? {
            id: user.id, nickname: user.nickname, firstName: user.firstName,
            email: user.email, profileImageUrl: user.profileImageUrl, steamId64: user.steamId64,
            levelPoints: user.levelPoints,
          } : null,
        };
      }).filter(p => p.user !== null);

      const monthDate = new Date(year, month - 1, 1);
      res.json({
        month,
        year,
        monthName: monthDate.toLocaleString('pt-BR', { month: 'long' }),
        players: result,
      });
    } catch (error) {
      console.error("Error fetching monthly stats by date:", error);
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });

  // News endpoints
  app.get('/api/news', isAuthenticated, async (req: any, res) => {
    try {
      const allNews = await storage.getAllNews();
      res.json(allNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Erro ao buscar notícias" });
    }
  });

  app.post('/api/news/generate-humor', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.user?.claims?.sub;
      const currentUser = await storage.getUser(String(userId));
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem gerar notícias" });
      }

      const { generateHumorousNews } = await import("./newsHumorGenerator");
      const generated = await generateHumorousNews();

      const item = await storage.createNews(String(userId), generated.title, generated.content);

      try {
        const newsChannelId = getNewsChannelId();
        sendNewsNotification(generated.title, generated.content, true, newsChannelId || undefined)
          .then((r) => { if (!r.ok) console.warn("[Discord] Notificação de humor falhou:", r.error); })
          .catch(() => {});
      } catch (dErr) {
        console.error("Discord news notify warning:", dErr);
      }

      res.status(201).json(item);
    } catch (error: any) {
      console.error("Error generating humor news:", error);
      res.status(500).json({ message: "Falha ao gerar notícia automatizada", detail: error?.message || String(error) });
    }
  });

  app.post('/api/news', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem publicar notícias" });
      }

      const newsSchema = z.object({
        title: z.string().min(1, "Título obrigatório").max(200),
        content: z.string().min(1, "Conteúdo obrigatório").max(2000),
        notifyDiscord: z.boolean().optional().default(true),
        mentionEveryone: z.boolean().optional().default(false),
      });

      const parsed = newsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inválidos" });
      }

      const item = await storage.createNews(userId, parsed.data.title, parsed.data.content);

      // Auto-notify Discord news channel (fire and forget)
      if (parsed.data.notifyDiscord) {
        const newsChannelId = getNewsChannelId();
        sendNewsNotification(parsed.data.title, parsed.data.content, parsed.data.mentionEveryone, newsChannelId || undefined)
          .then((r) => { if (!r.ok) console.warn("[Discord] Notificação automática falhou:", r.error); })
          .catch(() => {});
      }

      res.json(item);
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(500).json({ message: "Erro ao criar notícia" });
    }
  });

  app.delete('/api/news/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem deletar notícias" });
      }

      const success = await storage.deleteNews(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Erro ao deletar notícia" });
    }
  });

  // ── Copa Aliados routes ───────────────────────────────────────────────────

  let registrationClosed = false;

  app.get('/api/copa/registration-status', isAuthenticated, (_req, res) => {
    res.json({ closed: registrationClosed });
  });

  app.post('/api/copa/close-registration', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      registrationClosed = !registrationClosed;
      res.json({ closed: registrationClosed });
    } catch (e) { res.status(500).json({ message: "Erro ao atualizar status" }); }
  });

  app.post('/api/copa/draw', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });

      const teams = await storage.getAllCopaTeams();
      const confirmed = (teams as any[]).filter((t: any) => t.status === "confirmed");
      if (confirmed.length < 2) {
        return res.status(400).json({ message: "Necessário ao menos 2 times confirmados para o sorteio" });
      }

      // Determine round name based on team count
      const count = confirmed.length;
      let roundName = "Round 1";
      if (count >= 16) roundName = "Oitavas de Final";
      else if (count >= 8) roundName = "Quartas de Final";
      else if (count >= 4) roundName = "Semifinal";
      else roundName = "Final";

      // Shuffle teams (Fisher-Yates)
      const shuffled = [...confirmed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Create pairs
      const scheduledAt = req.body.scheduledAt ? new Date(req.body.scheduledAt) : new Date("2026-04-18T14:00:00-03:00");
      const created = [];
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        const match = await storage.createCopaMatch({
          round: roundName,
          roundNumber: Math.floor(i / 2) + 1,
          team1Id: shuffled[i].id,
          team2Id: shuffled[i + 1].id,
          scheduledAt,
        });
        created.push(match);
      }
      res.json({ matches: created, round: roundName });
    } catch (e) {
      console.error("Draw error:", e);
      res.status(500).json({ message: "Erro ao realizar sorteio" });
    }
  });

  // Public: get confirmed teams + matches + prizes info
  app.get('/api/copa/teams', async (req, res) => {
    try {
      const teams = await storage.getAllCopaTeams();
      res.json(teams);
    } catch (e) { res.status(500).json({ message: "Erro ao buscar times" }); }
  });

  app.get('/api/copa/matches', async (req, res) => {
    try {
      const matches = await storage.getCopaMatches();
      res.json(matches);
    } catch (e) { res.status(500).json({ message: "Erro ao buscar partidas" }); }
  });

  app.get('/api/copa/stats', async (req, res) => {
    try {
      const stats = await storage.getAllCopaStats();
      const teams = await storage.getAllCopaTeams();
      res.json({ stats, teams });
    } catch (e) { res.status(500).json({ message: "Erro ao buscar estatísticas" }); }
  });

  // Register a team (any authenticated user)
  app.post('/api/copa/teams', isAuthenticated, async (req: any, res) => {
    try {
      const { teamName, leaderName, leaderContact, paymentProof, players } = req.body;
      if (!teamName?.trim() || !leaderName?.trim() || !leaderContact?.trim()) {
        return res.status(400).json({ message: "Nome do time, líder e contato são obrigatórios" });
      }
      if (!players || players.length < 1 || players.length > 6) {
        return res.status(400).json({ message: "O time deve ter entre 1 e 6 jogadores" });
      }
      const team = await storage.createCopaTeam({ teamName, leaderName, leaderContact, paymentProof });
      await storage.addCopaPlayers(team.id, players);
      const fullTeam = await storage.getCopaTeam(team.id);
      res.json(fullTeam);
    } catch (e) {
      console.error("Error creating copa team:", e);
      res.status(500).json({ message: "Erro ao cadastrar time" });
    }
  });

  // Admin: update team status
  app.patch('/api/copa/teams/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const { status, adminNotes } = req.body;
      const team = await storage.updateCopaTeamStatus(Number(req.params.id), status, adminNotes);
      res.json(team);
    } catch (e) { res.status(500).json({ message: "Erro ao atualizar status" }); }
  });

  // Admin: edit team info + players
  app.patch('/api/copa/teams/:id/edit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub ?? req.user?.id;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const teamId = Number(req.params.id);
      const { teamName, leaderName, leaderContact, paymentProof, players } = req.body;
      const team = await storage.updateCopaTeam(teamId, {
        teamName, leaderName, leaderContact,
        ...(paymentProof !== undefined ? { paymentProof } : {}),
      });
      let updatedPlayers: any[] = [];
      if (Array.isArray(players)) {
        updatedPlayers = await storage.updateCopaPlayers(teamId, players.map((p: any, i: number) => ({
          playerName: p.playerName,
          steamProfile: p.steamProfile ?? "",
          age: Number(p.age) || 0,
          position: p.position ?? "Rifler",
          gcLevel: p.gcLevel ? Number(p.gcLevel) : null,
          faceitLevel: p.faceitLevel ? Number(p.faceitLevel) : null,
          isLeader: i === 0,
          playerOrder: i,
        })));
      }
      res.json({ ...team, players: updatedPlayers });
    } catch (e) {
      console.error("Erro ao editar time:", e);
      res.status(500).json({ message: "Erro ao editar time" });
    }
  });

  // Admin: create match
  app.post('/api/copa/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const { round, roundNumber, team1Id, team2Id, scheduledAt, streamUrl, notes } = req.body;
      const match = await storage.createCopaMatch({
        round, roundNumber,
        team1Id: team1Id || undefined,
        team2Id: team2Id || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        streamUrl, notes,
      });
      res.json(match);
    } catch (e) { res.status(500).json({ message: "Erro ao criar partida" }); }
  });

  // Admin: update match result + stats
  app.patch('/api/copa/matches/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const { team1Score, team2Score, winnerId, mapName, streamUrl, notes, isFinished, scheduledAt, stats } = req.body;
      const match = await storage.updateCopaMatch(Number(req.params.id), {
        team1Score, team2Score, winnerId, mapName, streamUrl, notes, isFinished,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      });
      if (stats && Array.isArray(stats)) {
        await storage.setCopaMatchStats(match.id, stats);
      }
      res.json(match);
    } catch (e) { res.status(500).json({ message: "Erro ao atualizar partida" }); }
  });

  // Get match stats
  app.get('/api/copa/matches/:id/stats', async (req, res) => {
    try {
      const stats = await storage.getCopaMatchStats(Number(req.params.id));
      res.json(stats);
    } catch (e) { res.status(500).json({ message: "Erro ao buscar stats" }); }
  });

  // Admin: delete team
  app.delete('/api/copa/teams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      await storage.updateCopaTeamStatus(Number(req.params.id), "rejected", "Removido pelo admin");
      res.json({ success: true });
    } catch (e) { res.status(500).json({ message: "Erro ao remover time" }); }
  });

  // ── Survey routes ───────────────────────────────────────────────────────────

  // Get current user's survey status
  app.get('/api/survey', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const survey = await storage.getSurveyByUserId(userId);
      res.json(survey || null);
    } catch (error) {
      console.error("Error fetching survey:", error);
      res.status(500).json({ message: "Erro ao buscar pesquisa" });
    }
  });

  // Submit / update survey
  app.post('/api/survey', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const {
        bestPlayTimes, faceitLevel, gcLevel, valveLevel,
        improvementSuggestions, reasonNotPlaying, attractMorePlayers,
        playMoreWays, generalOpinions, levelUpInfluenced, levelUpInfluencedComment,
      } = req.body;

      if (!bestPlayTimes || bestPlayTimes.length === 0) {
        return res.status(400).json({ message: "Selecione pelo menos um horário disponível" });
      }
      if (faceitLevel === undefined || faceitLevel === null) {
        return res.status(400).json({ message: "Informe seu nível FACEIT" });
      }
      if (gcLevel === undefined || gcLevel === null) {
        return res.status(400).json({ message: "Informe seu nível Gamers Club" });
      }
      if (!valveLevel?.trim()) {
        return res.status(400).json({ message: "Informe seu nível Valve" });
      }
      if (!improvementSuggestions?.trim()) {
        return res.status(400).json({ message: "Responda sobre melhorias no servidor" });
      }
      if (!reasonNotPlaying?.trim()) {
        return res.status(400).json({ message: "Responda sobre os motivos para jogar menos" });
      }
      if (!attractMorePlayers?.trim()) {
        return res.status(400).json({ message: "Responda sobre como atrair mais jogadores" });
      }
      if (!playMoreWays?.trim()) {
        return res.status(400).json({ message: "Responda sobre o que te faria jogar mais" });
      }
      if (!generalOpinions?.trim()) {
        return res.status(400).json({ message: "Responda sobre suas opiniões gerais" });
      }
      if (!levelUpInfluenced) {
        return res.status(400).json({ message: "Responda se a subida de nível dos jogadores influenciou a galera a parar de jogar" });
      }
      if (levelUpInfluenced === 'yes' && !levelUpInfluencedComment?.trim()) {
        return res.status(400).json({ message: "Explique como a subida de nível influenciou" });
      }

      const survey = await storage.upsertSurvey(userId, {
        bestPlayTimes: bestPlayTimes || [],
        faceitLevel: faceitLevel || null,
        gcLevel: gcLevel || null,
        valveLevel: valveLevel || null,
        improvementSuggestions: improvementSuggestions || null,
        reasonNotPlaying: reasonNotPlaying || null,
        attractMorePlayers: attractMorePlayers || null,
        playMoreWays: playMoreWays || null,
        generalOpinions: generalOpinions || null,
        levelUpInfluenced,
        levelUpInfluencedComment: levelUpInfluencedComment || null,
      });
      res.json(survey);
    } catch (error) {
      console.error("Error saving survey:", error);
      res.status(500).json({ message: "Erro ao salvar pesquisa" });
    }
  });

  // Admin: get all surveys
  app.get('/api/admin/surveys', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.id || req.user?.claims?.sub);
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins" });
      }
      const allSurveys = await storage.getAllSurveys();
      res.json(allSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      res.status(500).json({ message: "Erro ao buscar pesquisas" });
    }
  });

  // ==================== DISCORD ROUTES ====================

  // Get Discord bot status + diagnostics
  app.get('/api/discord/status', isAuthenticated, async (req: any, res) => {
    res.json({
      connected: isDiscordReady(),
      error: getLastError(),
      inviteUrl: getBotInviteUrl(),
    });
  });

  // Link Discord user ID to profile
  app.post('/api/discord/link', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Não autenticado" });

    const schema = z.object({ discordUserId: z.string().min(15).max(32) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "ID do Discord inválido" });

    const { discordUserId } = parsed.data;

    // Check if already taken
    const existing = await storage.getUserByDiscordId(discordUserId);
    if (existing && existing.id !== userId) {
      return res.status(409).json({ message: "Este ID do Discord já está vinculado a outra conta" });
    }

    await db.update(users).set({ discordUserId }).where(eq(users.id, userId));
    const updated = await storage.getUser(userId);
    res.json(updated);
  });

  // Unlink Discord
  app.delete('/api/discord/link', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Não autenticado" });
    await db.update(users).set({ discordUserId: null }).where(eq(users.id, userId));
    res.json({ success: true });
  });

  // Send mix notification to Discord (admin only)
  // ===== Web Push (VAPID) =====
  app.get('/api/push/vapid-public-key', async (_req, res) => {
    let key = getVapidPublicKey();
    if (!key) {
      await initPush();
      key = getVapidPublicKey();
    }
    res.json({ publicKey: key });
  });

  app.post('/api/push/subscribe', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: "Não autenticado" });

    const schema = z.object({
      endpoint: z.string().url(),
      p256dh: z.string().min(1),
      auth: z.string().min(1),
      userAgent: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

    const { endpoint, p256dh, auth, userAgent } = parsed.data;
    await db
      .insert(pushSubscriptions)
      .values({ userId, endpoint, p256dh, auth, userAgent: userAgent ?? null })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { userId, p256dh, auth, userAgent: userAgent ?? null },
      });
    res.json({ success: true });
  });

  app.post('/api/push/unsubscribe', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: "Não autenticado" });
    const schema = z.object({ endpoint: z.string().url() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });
    await db
      .delete(pushSubscriptions)
      .where(and(eq(pushSubscriptions.endpoint, parsed.data.endpoint), eq(pushSubscriptions.userId, userId)));
    res.json({ success: true });
  });

  // Admin: send a push notification to ALL subscribers (used for mix list announcements)
  app.post('/api/mix/push-notify', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub ?? req.user?.id;
    const currentUser = await storage.getUser(userId);
    if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });

    const schema = z.object({
      title: z.string().min(1).max(120).optional(),
      body: z.string().min(1).max(300).optional(),
      url: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

    const result = await sendPushToAll({
      title: parsed.data.title ?? "Lista do Mix aberta!",
      body: parsed.data.body ?? "A lista de hoje está aberta. Garanta sua vaga agora!",
      url: parsed.data.url ?? "/mix/disponibilidade",
      tag: "mix-list-open",
    });
    res.json({ success: true, ...result });
  });

  // Admin: aggregated activity report
  app.get('/api/admin/report', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });

      const all = await storage.getAllUsers(true);
      const subs = await db.select().from(pushSubscriptions);
      const pushUserIds = new Set(subs.map((s) => s.userId).filter(Boolean) as string[]);

      const slim = (u: typeof all[number]) => ({
        id: u.id,
        nickname: u.nickname || u.firstName || u.email || "Sem nome",
        profileImageUrl: u.profileImageUrl || null,
        steamId64: u.steamId64 || null,
        discordUserId: u.discordUserId || null,
        totalMatches: u.totalMatches || 0,
        matchesWon: u.matchesWon || 0,
        isAdmin: !!u.isAdmin,
        isBanned: !!u.isBanned,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt ?? u.updatedAt ?? null,
        hasPush: pushUserIds.has(u.id),
        hasDiscord: !!u.discordUserId,
      });

      const enriched = all.map(slim);

      const mostActive = [...enriched]
        .filter((u) => u.totalMatches > 0)
        .sort((a, b) => b.totalMatches - a.totalMatches)
        .slice(0, 50);

      const neverPlayed = enriched
        .filter((u) => u.totalMatches === 0)
        .sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));

      const discordEnabled = enriched
        .filter((u) => u.hasDiscord)
        .sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));

      const pushEnabled = enriched
        .filter((u) => u.hasPush)
        .sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));

      const inactive = [...enriched]
        .filter((u) => !u.isBanned)
        .sort((a, b) => {
          const ta = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
          const tb = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
          return ta - tb;
        })
        .slice(0, 50);

      // Dias jogados no mês anterior (dias distintos com partida registrada)
      const now = new Date();
      const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startCurr = new Date(now.getFullYear(), now.getMonth(), 1);
      const prevMonthLabel = startPrev.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

      const daysRows = await db
        .select({
          userId: matchStats.userId,
          daysPlayed: sql<number>`count(distinct date_trunc('day', ${matches.date}))`,
          matchesPlayed: sql<number>`count(distinct ${matches.id})`,
        })
        .from(matchStats)
        .innerJoin(matches, eq(matchStats.matchId, matches.id))
        .where(and(gte(matches.date, startPrev), lt(matches.date, startCurr)))
        .groupBy(matchStats.userId);

      const userById = new Map(enriched.map((u) => [u.id, u]));
      const daysPlayedPrevMonth = daysRows
        .map((r) => {
          const u = userById.get(r.userId);
          if (!u) return null;
          return { ...u, daysPlayed: Number(r.daysPlayed), matchesPlayed: Number(r.matchesPlayed) };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => b.daysPlayed - a.daysPlayed || b.matchesPlayed - a.matchesPlayed);

      res.json({
        totals: {
          totalUsers: enriched.length,
          neverPlayed: neverPlayed.length,
          discordEnabled: discordEnabled.length,
          pushEnabled: pushEnabled.length,
          pushSubscriptions: subs.length,
        },
        mostActive,
        neverPlayed,
        discordEnabled,
        pushEnabled,
        inactive,
        prevMonthLabel,
        daysPlayedPrevMonth,
      });
    } catch (err: any) {
      console.error("[admin/report] erro:", err);
      res.status(500).json({ message: err.message || "Erro ao gerar relatório" });
    }
  });

  app.post('/api/discord/mix-notify', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const currentUser = await storage.getUser(userId);
    if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });

    const schema = z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      message: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

    const result = await sendMixNotification(parsed.data.date, parsed.data.message);
    if (result.ok) {
      res.json({ success: true, message: "Notificação enviada ao Discord!" });
    } else {
      res.status(503).json({ message: result.error || "Falha ao enviar notificação" });
    }
  });

  // Send custom news notification to Discord (admin only)
  app.post('/api/discord/notify', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const currentUser = await storage.getUser(userId);
    if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });

    const schema = z.object({
      title: z.string().min(1).max(200),
      description: z.string().min(1).max(2000),
      mentionEveryone: z.boolean().optional().default(false),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

    const result = await sendNewsNotification(parsed.data.title, parsed.data.description, parsed.data.mentionEveryone);
    if (result.ok) {
      res.json({ success: true, message: "Notificação enviada ao Discord!" });
    } else {
      res.status(503).json({ message: result.error || "Falha ao enviar notificação" });
    }
  });

  // ─── Fantasy Routes ─────────────────────────────────────────────────────────

  // Point calculation per match stat for fantasy
  // Calcula o preço de um jogador baseado no Level (escala de R$5 a R$40)
  // Level = floor(levelPoints / 100) + 1, capped at 21
  // Com budget de R$100, é impossível escalar os 5 melhores
  function calcPlayerPrice(levelPoints: number): number {
    const level = Math.max(1, Math.min(21, Math.floor(Math.max(0, levelPoints) / 100) + 1));
    return Math.max(5, Math.min(40, Math.round(5 + (level - 1) / 20 * 35)));
  }

  // Calcula LP por partida — Rating Inimigos (RI)
  // RI = (KPR×0.35) + (ADR/100×0.35) + (EntrySuccess×0.15) + (Utility×0.15)
  // Vitória: RI>1.3→+25 | RI≥1.0→+18 | else→+10
  // Derrota: RI>1.3→-2  | RI≥1.0→-10 | else→-20
  // Bônus: v1wins×2, v2wins×3, mvp×5, 5K×5, 4K×3
  function calcMatchLP(
    won: boolean,
    kills: number, damage: number,
    rounds: number, entryWins: number, entryCount: number,
    utilityDamage: number, enemiesFlashed: number,
    v1Wins: number, v2Wins: number,
    mvps: number = 0, enemy5ks: number = 0, enemy4ks: number = 0,
  ): number {
    const r            = Math.max(rounds, 1);
    const kpr          = kills / r;
    const adr          = damage / r;
    const entrySuccess = entryCount > 0 ? entryWins / entryCount : 0;
    const utility      = (utilityDamage + enemiesFlashed * 7.5) / r;

    const ri = (kpr * 0.35) + (adr / 100 * 0.35) + (entrySuccess * 0.15) + (utility * 0.15);

    let lp = 0;
    if (won) {
      if      (ri > 1.3)  lp = 25;
      else if (ri >= 1.0) lp = 18;
      else                lp = 10;
    } else {
      if      (ri > 1.3)  lp = -2;
      else if (ri >= 1.0) lp = -10;
      else                lp = -20;
    }

    lp += v1Wins   * 2;
    lp += v2Wins   * 3;
    lp += mvps     * 5;
    lp += enemy5ks * 5;
    lp += enemy4ks * 3;

    return Math.max(-20, Math.min(40, lp));
  }

  // Retorna se o mercado do fantasy está aberto para uma rodada
  // Mercado fecha na segunda-feira às 16:00 BRT (19:00 UTC) da semana da rodada
  function isMarketOpen(roundStartDate: Date): boolean {
    const now = new Date();
    const start = new Date(roundStartDate);
    // Find the Monday of the same week as start_date (week starts Monday)
    const monday = new Date(start);
    monday.setUTCHours(0, 0, 0, 0);
    const dow = monday.getUTCDay(); // 0=Sun, 1=Mon, ...
    const daysToMonday = dow === 0 ? -6 : 1 - dow; // go back to monday
    monday.setUTCDate(monday.getUTCDate() + daysToMonday);
    // Market closes Monday 16:00 BRT = 19:00 UTC
    const marketClose = new Date(monday);
    marketClose.setUTCHours(19, 0, 0, 0);
    // If round start is past Monday, use the next Monday
    if (start > marketClose) {
      marketClose.setUTCDate(marketClose.getUTCDate() + 7);
    }
    return now < marketClose;
  }

  function calcFantasyPoints(stat: any): number {
    let pts = 0;

    const kills        = stat.kills        || 0;
    const deaths       = stat.deaths       || 0;
    const assists      = stat.assists      || 0;
    const fiveK        = stat.fiveK        || 0;
    const fourK        = stat.fourK        || 0;
    const threeK       = stat.threeK       || 0;
    const twoK         = stat.twoK         || 0;
    const damage       = stat.damage       || 0;
    const headshots    = stat.headshots    || 0;
    const clutch1v1    = stat.clutch1v1    || 0;
    const clutch1v2    = stat.clutch1v2    || 0;
    const firstKills   = stat.firstKills   || 0;
    const isMvp        = stat.isMvp        ? 1 : 0;
    const wonMatch     = stat.wonMatch;   // true/false/undefined

    // Base flat points
    pts += kills     * 1;
    pts -= deaths    * 1;
    pts += assists   * 1;
    pts += fiveK     * 8;
    pts += fourK     * 5;
    pts += threeK    * 3;
    pts += twoK      * 1;
    pts += clutch1v1 * 5;
    pts += clutch1v2 * 8;
    pts += firstKills * 1.5;
    pts += isMvp     * 4;
    if (wonMatch === true)       pts += 3;
    else if (wonMatch === false) pts -= 5;

    // KD ratio bonus/penalty (per match)
    const kd = deaths > 0 ? kills / deaths : kills;
    if (kd >= 1.20) {
      // Starts at 5 (kd=1.20), grows linearly to 10 (kd=2.50)
      const kdBonus = 5 + Math.min(1, (kd - 1.20) / (2.50 - 1.20)) * 5;
      pts += Math.min(10, kdBonus);
    } else if (kd >= 0.90) {
      pts += 2;
    } else {
      // Starts at -1 (kd=0.90), drops linearly to -6 (kd=0)
      const kdPenalty = -1 - Math.min(1, (0.90 - kd) / 0.90) * 5;
      pts += Math.max(-6, kdPenalty);
    }

    // Headshot % bonus/penalty (per match)
    const hsPct = kills > 0 ? (headshots / kills) * 100 : 0;
    if (hsPct > 50) {
      // Starts at 2 (hs%=50), grows linearly to 10 (hs%=100)
      const hsBonus = 2 + Math.min(1, (hsPct - 50) / 50) * 8;
      pts += Math.min(10, hsBonus);
    } else {
      // Starts at -1 (hs%=50), drops linearly to -6 (hs%=0)
      const hsPenalty = -1 - Math.min(1, (50 - hsPct) / 50) * 5;
      pts += Math.max(-6, hsPenalty);
    }

    // Damage bonus/penalty (per match)
    if (damage > 1000) {
      // Starts at 2 (damage=1000), grows linearly to 10 (damage=2000)
      const dmgBonus = 2 + Math.min(1, (damage - 1000) / 1000) * 8;
      pts += Math.min(10, dmgBonus);
    } else {
      // Starts at -1 (damage=1000), drops linearly to -6 (damage=0)
      const dmgPenalty = -1 - Math.min(1, (1000 - damage) / 1000) * 5;
      pts += Math.max(-6, dmgPenalty);
    }

    return Math.round(pts * 100) / 100;
  }

  // GET /api/fantasy/players — all users with calculated prices and avg stats
  app.get("/api/fantasy/players", isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(
        sql`SELECT id, nickname, first_name, last_name, profile_image_url, steam_id_64,
                   skill_rating, level_points, total_kills, total_deaths, total_assists,
                   total_headshots, total_matches, total_damage
            FROM users
            ORDER BY level_points DESC`
      );
      const players = (result.rows as any[]).map(u => {
        const matches = u.total_matches || 1;
        const kills = u.total_kills || 0;
        const deaths = u.total_deaths || 0;
        const lp = u.level_points ?? 0;
        const level = Math.max(1, Math.min(21, Math.floor(lp / 30) + 1));
        const avgKills   = kills / matches;
        const avgDeaths  = deaths / matches;
        const avgAssists = (u.total_assists || 0) / matches;
        const avgDamage  = (u.total_damage || 0) / matches;
        const avgHeadshots = (u.total_headshots || 0) / matches;

        // Project fantasy points per match from career averages
        const projectedPts = u.total_matches > 0
          ? calcFantasyPoints({
              kills: avgKills,
              deaths: avgDeaths,
              assists: avgAssists,
              headshots: avgHeadshots,
              fiveK: 0,
              fourK: 0,
              damage: avgDamage,
            })
          : 0;

        // Price: base of 5, driven by projected fantasy performance
        // projectedPts range: roughly -18 to +30
        // Map to price range 5..40
        const priceFromFantasy = Math.round(5 + Math.max(0, Math.min(35, (projectedPts + 18) / 48 * 35)));
        const price = u.total_matches > 0 ? priceFromFantasy : 5;

        return {
          ...u,
          level_points: lp,
          skill_rating: level,
          price,
          avg_kills: Math.round(avgKills * 10) / 10,
          avg_deaths: Math.round(avgDeaths * 10) / 10,
          avg_assists: Math.round(avgAssists * 10) / 10,
          avg_damage: Math.round(avgDamage),
          kd_ratio: deaths > 0 ? Math.round((kills / deaths) * 100) / 100 : kills,
          hs_pct: kills > 0 ? Math.round((u.total_headshots || 0) / kills * 1000) / 10 : 0,
        };
      });
      res.json({ players, budget: FANTASY_BUDGET });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // GET /api/fantasy/rounds — list all rounds
  app.get("/api/fantasy/rounds", isAuthenticated, async (req, res) => {
    try {
      const rounds = await db.execute(
        sql`SELECT * FROM fantasy_rounds ORDER BY created_at DESC`
      );
      res.json(rounds.rows);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // GET /api/fantasy/rounds/active — current open round
  app.get("/api/fantasy/rounds/active", isAuthenticated, async (req, res) => {
    try {
      const round = await db.execute(
        sql`SELECT * FROM fantasy_rounds WHERE status = 'open' ORDER BY created_at DESC LIMIT 1`
      );
      const r = round.rows[0] as any;
      if (!r) return res.json(null);
      const marketOpen = isMarketOpen(new Date(r.start_date));
      res.json({ ...r, marketOpen });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // GET /api/fantasy/my-team/:roundId — my team + picks for a round
  app.get("/api/fantasy/my-team/:roundId", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const roundId = parseInt(req.params.roundId);
      const team = await db.execute(
        sql`SELECT * FROM fantasy_teams WHERE user_id = ${userId} AND round_id = ${roundId} LIMIT 1`
      );
      if (!team.rows[0]) return res.json(null);
      const teamId = (team.rows[0] as any).id;
      const picks = await db.execute(
        sql`SELECT fp.*, u.nickname, u.first_name, u.last_name, u.profile_image_url, u.steam_id_64
            FROM fantasy_picks fp
            JOIN users u ON fp.picked_user_id = u.id
            WHERE fp.team_id = ${teamId}
            ORDER BY fp.points DESC`
      );
      res.json({ team: team.rows[0], picks: picks.rows });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // POST /api/fantasy/teams — create/replace my team for a round
  app.post("/api/fantasy/teams", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id;
      const { roundId, playerIds } = req.body;
      if (!roundId || !Array.isArray(playerIds) || playerIds.length === 0 || playerIds.length > 5) {
        return res.status(400).json({ message: "Selecione entre 1 e 5 jogadores." });
      }
      // Check round exists and is open
      const round = await db.execute(
        sql`SELECT * FROM fantasy_rounds WHERE id = ${roundId} AND status = 'open' LIMIT 1`
      );
      if (!round.rows[0]) return res.status(400).json({ message: "Rodada não está aberta para escalações." });
      // Check market is still open (closes Monday 16:00 BRT)
      const roundData = round.rows[0] as any;
      if (!isMarketOpen(new Date(roundData.start_date))) {
        return res.status(400).json({ message: "Mercado fechado! Escalações encerram às segundas-feiras às 16h (horário de Brasília)." });
      }

      // Fetch level_points for each selected player to calculate prices
      const playerRows = await db.execute(
        sql`SELECT id, level_points FROM users WHERE id IN (${sql.join(playerIds.map((id: string) => sql`${id}`), sql`, `)})`
      );
      const lpMap: Record<string, number> = {};
      for (const row of playerRows.rows as any[]) {
        lpMap[row.id] = row.level_points ?? 0;
      }
      const prices: Record<string, number> = {};
      let totalCost = 0;
      for (const pid of playerIds) {
        const price = calcPlayerPrice(lpMap[pid] ?? 500);
        prices[pid] = price;
        totalCost += price;
      }
      if (totalCost > FANTASY_BUDGET) {
        return res.status(400).json({
          message: `Orçamento excedido! Total: R$${totalCost} / Limite: R$${FANTASY_BUDGET}`,
          totalCost,
          budget: FANTASY_BUDGET,
        });
      }

      // Upsert team
      const existing = await db.execute(
        sql`SELECT id FROM fantasy_teams WHERE user_id = ${userId} AND round_id = ${roundId} LIMIT 1`
      );
      let teamId: number;
      if (existing.rows[0]) {
        teamId = (existing.rows[0] as any).id;
        await db.execute(sql`DELETE FROM fantasy_picks WHERE team_id = ${teamId}`);
        await db.execute(
          sql`UPDATE fantasy_teams SET budget_used = ${totalCost} WHERE id = ${teamId}`
        );
      } else {
        const ins = await db.execute(
          sql`INSERT INTO fantasy_teams (user_id, round_id, total_points, budget_used) VALUES (${userId}, ${roundId}, 0, ${totalCost}) RETURNING id`
        );
        teamId = (ins.rows[0] as any).id;
      }
      for (const pid of playerIds) {
        const price = prices[pid];
        await db.execute(
          sql`INSERT INTO fantasy_picks (team_id, picked_user_id, points, price) VALUES (${teamId}, ${pid}, 0, ${price})`
        );
      }
      res.json({ success: true, teamId, totalCost, budget: FANTASY_BUDGET });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // GET /api/fantasy/ranking/:roundId — ranking of all teams
  app.get("/api/fantasy/ranking/:roundId", isAuthenticated, async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      const teams = await db.execute(
        sql`SELECT ft.id, ft.total_points, ft.user_id,
                   u.nickname, u.first_name, u.last_name, u.profile_image_url
            FROM fantasy_teams ft
            JOIN users u ON ft.user_id = u.id
            WHERE ft.round_id = ${roundId}
            ORDER BY ft.total_points DESC`
      );
      // For each team, get picks count
      const result = [];
      for (const t of teams.rows as any[]) {
        const picks = await db.execute(
          sql`SELECT COUNT(*) as cnt FROM fantasy_picks WHERE team_id = ${t.id}`
        );
        result.push({ ...t, playerCount: parseInt((picks.rows[0] as any).cnt) });
      }
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // POST /api/fantasy/rounds — admin creates a round
  app.post("/api/fantasy/rounds", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub ?? (req.user as any)?.id ?? null;
      const adminUser = userId ? await storage.getUser(userId) : null;
      if (!adminUser?.isAdmin) return res.status(403).json({ message: "Acesso negado." });
      const { name, startDate, endDate } = req.body;
      if (!name || !startDate || !endDate) return res.status(400).json({ message: "Dados incompletos." });
      const r = await db.execute(
        sql`INSERT INTO fantasy_rounds (name, status, start_date, end_date)
            VALUES (${name}, 'open', ${new Date(startDate).toISOString()}, ${new Date(endDate).toISOString()})
            RETURNING *`
      );
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // POST /api/fantasy/rounds/:id/calculate — admin calculates points
  app.post("/api/fantasy/rounds/:id/calculate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const adminUser = await storage.getUser(userId);
      if (!adminUser?.isAdmin) return res.status(403).json({ message: "Acesso negado." });
      const roundId = parseInt(req.params.id);
      const round = await db.execute(
        sql`SELECT * FROM fantasy_rounds WHERE id = ${roundId} LIMIT 1`
      );
      if (!round.rows[0]) return res.status(404).json({ message: "Rodada não encontrada." });
      const r = round.rows[0] as any;

      // Update status to calculating
      await db.execute(sql`UPDATE fantasy_rounds SET status = 'calculating' WHERE id = ${roundId}`);

      // Get all match stats in the round date range
      const stats = await db.execute(
        sql`SELECT ms.*, m.winner_team, (ms.team_name = m.winner_team) AS won_match
            FROM match_stats ms
            JOIN matches m ON ms.match_id = m.id
            WHERE m.date >= ${r.start_date} AND m.date <= ${r.end_date}`
      );

      // Build a map: userId -> total fantasy points
      const pointMap: Record<string, number> = {};
      for (const stat of stats.rows as any[]) {
        const pid = stat.user_id;
        if (!pid) continue;
        const pts = calcFantasyPoints({
          kills:      stat.kills,
          deaths:     stat.deaths,
          assists:    stat.assists,
          headshots:  stat.headshots,
          fiveK:      stat.enemy_5ks,
          fourK:      stat.enemy_4ks,
          threeK:     stat.enemy_3ks,
          twoK:       stat.enemy_2ks,
          damage:     stat.damage,
          clutch1v1:  stat.v1_wins,
          clutch1v2:  stat.v2_wins,
          firstKills: stat.entry_wins,
          isMvp:      stat.mvps > 0,
          wonMatch:   stat.won_match === true || stat.won_match === "true",
        });
        pointMap[pid] = (pointMap[pid] || 0) + pts;
      }

      // Update fantasy_picks.points for each pick in this round
      const teams = await db.execute(sql`SELECT id FROM fantasy_teams WHERE round_id = ${roundId}`);
      for (const team of teams.rows as any[]) {
        const picks = await db.execute(sql`SELECT * FROM fantasy_picks WHERE team_id = ${team.id}`);
        let teamTotal = 0;
        for (const pick of picks.rows as any[]) {
          const pts = pointMap[pick.picked_user_id] || 0;
          await db.execute(sql`UPDATE fantasy_picks SET points = ${pts} WHERE id = ${pick.id}`);
          teamTotal += pts;
        }
        await db.execute(sql`UPDATE fantasy_teams SET total_points = ${Math.round(teamTotal * 100) / 100} WHERE id = ${team.id}`);
      }

      await db.execute(sql`UPDATE fantasy_rounds SET status = 'finished' WHERE id = ${roundId}`);
      res.json({ success: true, message: "Pontuação calculada com sucesso!" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // DELETE /api/fantasy/rounds/:id — admin deletes a round
  app.delete("/api/fantasy/rounds/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const adminUser = await storage.getUser(userId);
      if (!adminUser?.isAdmin) return res.status(403).json({ message: "Acesso negado." });
      await db.execute(sql`DELETE FROM fantasy_rounds WHERE id = ${parseInt(req.params.id)}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ======== Sorteios (Raffles) ========

  async function getMonthlyMatchCounts(year: number, month: number) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);
    const allMatches = await storage.getAllMatches();
    const monthMatches = allMatches.filter((m) => {
      const d = new Date(m.date);
      return d >= firstDay && d <= lastDay;
    });
    const counts = new Map<string, Set<string>>();
    for (const match of monthMatches) {
      const stats = await storage.getMatchStats(match.id);
      for (const s of stats) {
        if (!counts.has(s.userId)) counts.set(s.userId, new Set());
        counts.get(s.userId)!.add(match.id);
      }
    }
    const map = new Map<string, number>();
    Array.from(counts.entries()).forEach(([uid, set]) => map.set(uid, set.size));
    return map;
  }

  async function buildEligibleList(year: number, month: number, minMatches: number): Promise<RaffleEligibleEntry[]> {
    const counts = await getMonthlyMatchCounts(year, month);
    const allUsers = await storage.getAllUsers();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));
    const list: RaffleEligibleEntry[] = [];
    for (const [userId, matchesPlayed] of Array.from(counts.entries())) {
      if (matchesPlayed < minMatches) continue;
      const u = userMap.get(userId);
      if (!u) continue;
      if (u.isBanned || u.isCheaterBanned) continue;
      list.push({
        userId,
        nickname: u.nickname || u.firstName || u.email || u.id,
        matchesPlayed,
        profileImageUrl: u.profileImageUrl ?? null,
      });
    }
    list.sort((a, b) => a.userId.localeCompare(b.userId));
    return list;
  }

  function deriveRandom(seed: string): { value: string; valueNumber: number } {
    const hash = createHash("sha256").update(seed).digest();
    // Use first 6 bytes (48 bits) as unsigned int / 2^48 to stay in safe integer range
    let intVal = 0;
    for (let i = 0; i < 6; i++) {
      intVal = intVal * 256 + hash[i];
    }
    const denom = Math.pow(2, 48);
    const num = intVal / denom;
    return { value: num.toFixed(18), valueNumber: num };
  }

  async function ensureAdmin(req: any, res: any) {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      res.status(401).json({ message: "Não autenticado" });
      return null;
    }
    const u = await storage.getUser(userId);
    if (!u?.isAdmin) {
      res.status(403).json({ message: "Acesso restrito a administradores" });
      return null;
    }
    return u;
  }

  app.get("/api/admin/raffles/eligible", isAuthenticated, async (req: any, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const now = new Date();
      const year = Number(req.query.year) || now.getFullYear();
      const month = Number(req.query.month) || now.getMonth() + 1;
      const minMatches = Math.max(1, Number(req.query.minMatches) || 3);
      const list = await buildEligibleList(year, month, minMatches);
      res.json({ year, month, minMatches, eligible: list });
    } catch (err) {
      console.error("[Raffles] eligible error:", err);
      res.status(500).json({ message: "Erro ao listar elegíveis" });
    }
  });

  const createRaffleSchema = z.object({
    title: z.string().min(1).max(120),
    year: z.number().int().min(2020).max(2100),
    month: z.number().int().min(1).max(12),
    minMatches: z.number().int().min(1).max(50),
  });

  app.post("/api/admin/raffles", isAuthenticated, async (req: any, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const parsed = createRaffleSchema.parse(req.body);
      const eligible = await buildEligibleList(parsed.year, parsed.month, parsed.minMatches);
      if (eligible.length === 0) {
        return res.status(400).json({ message: "Não há jogadores elegíveis para o sorteio." });
      }
      const seed = randomBytes(32).toString("hex");
      const { value, valueNumber } = deriveRandom(seed);
      const winnerIndex = Math.floor(valueNumber * eligible.length);
      const winner = eligible[winnerIndex];

      const [created] = await db
        .insert(raffles)
        .values({
          title: parsed.title,
          year: parsed.year,
          month: parsed.month,
          minMatches: parsed.minMatches,
          eligibleSnapshot: eligible,
          winnerUserId: winner.userId,
          winnerNickname: winner.nickname,
          seed,
          randomValue: value,
          winnerIndex,
          createdById: admin.id,
        })
        .returning();

      res.json(created);
    } catch (err: any) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: "Dados inválidos", errors: err.errors });
      console.error("[Raffles] create error:", err);
      res.status(500).json({ message: "Erro ao criar sorteio" });
    }
  });

  app.get("/api/admin/raffles", isAuthenticated, async (req: any, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const list = await db.select().from(raffles).orderBy(desc(raffles.createdAt));
      res.json(list);
    } catch (err) {
      console.error("[Raffles] list error:", err);
      res.status(500).json({ message: "Erro ao listar sorteios" });
    }
  });

  app.get("/api/admin/raffles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const [r] = await db.select().from(raffles).where(eq(raffles.id, req.params.id));
      if (!r) return res.status(404).json({ message: "Sorteio não encontrado" });
      res.json(r);
    } catch (err) {
      console.error("[Raffles] get error:", err);
      res.status(500).json({ message: "Erro ao buscar sorteio" });
    }
  });

  app.post("/api/admin/raffles/:id/notify", isAuthenticated, async (req: any, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const [r] = await db.select().from(raffles).where(eq(raffles.id, req.params.id));
      if (!r) return res.status(404).json({ message: "Sorteio não encontrado" });
      if (!r.winnerUserId) return res.status(400).json({ message: "Sorteio sem vencedor" });

      const pushResult = await sendPushToUser(r.winnerUserId, {
        title: "Você ganhou um sorteio!",
        body: `Parabéns! Você foi sorteado em: ${r.title}`,
        url: "/",
        tag: `raffle-${r.id}`,
      }).catch((e) => {
        console.error("[Raffles] push error:", e);
        return { sent: 0, failed: 0, total: 0 };
      });

      const [updated] = await db
        .update(raffles)
        .set({ notifiedAt: new Date(), winnerSeenAt: null })
        .where(eq(raffles.id, r.id))
        .returning();

      res.json({ raffle: updated, push: pushResult });
    } catch (err) {
      console.error("[Raffles] notify error:", err);
      res.status(500).json({ message: "Erro ao notificar vencedor" });
    }
  });

  // For the winner: get unseen wins, mark as seen
  app.get("/api/raffles/my-unseen-wins", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Não autenticado" });
      const rows = await db
        .select()
        .from(raffles)
        .where(and(eq(raffles.winnerUserId, userId), sql`${raffles.notifiedAt} is not null`, sql`${raffles.winnerSeenAt} is null`))
        .orderBy(desc(raffles.notifiedAt));
      res.json(rows);
    } catch (err) {
      console.error("[Raffles] my-unseen error:", err);
      res.status(500).json({ message: "Erro ao buscar sorteios" });
    }
  });

  app.post("/api/raffles/:id/mark-seen", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Não autenticado" });
      const [r] = await db.select().from(raffles).where(eq(raffles.id, req.params.id));
      if (!r || r.winnerUserId !== userId) return res.status(404).json({ message: "Sorteio não encontrado" });
      const [updated] = await db
        .update(raffles)
        .set({ winnerSeenAt: new Date() })
        .where(eq(raffles.id, r.id))
        .returning();
      res.json(updated);
    } catch (err) {
      console.error("[Raffles] mark-seen error:", err);
      res.status(500).json({ message: "Erro ao confirmar" });
    }
  });

  registerTournament2x2Routes(app, isAuthenticated);

  return httpServer;
}

// Helper function to generate slot symbols
function generateSlotSymbols(won: boolean): string[][] {
  const symbols = ['🐯', '💎', '7️⃣', '🍀', '⭐', '🔔', '🍒', '🍋'];
  
  if (won) {
    // Winning combination - at least one row matches
    const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const winRow = Math.floor(Math.random() * 3);
    return Array(3).fill(null).map((_, row) => {
      if (row === winRow) {
        return [winSymbol, winSymbol, winSymbol];
      }
      return Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    });
  } else {
    // Losing combination - no matching rows
    return Array(3).fill(null).map(() => {
      const row = Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      // Ensure no three in a row
      if (row[0] === row[1] && row[1] === row[2]) {
        row[2] = symbols[(symbols.indexOf(row[2]) + 1) % symbols.length];
      }
      return row;
    });
  }
}

// Helper function to generate random CS:GO-style skin
function generateRandomSkin(rarity: string): { name: string; weapon: string; skin: string } {
  const weapons: Record<string, string[]> = {
    'Consumidor': ['P250', 'MAG-7', 'PP-Bizon', 'Sawed-Off', 'Nova'],
    'Industrial': ['Galil AR', 'FAMAS', 'MAC-10', 'MP7', 'UMP-45'],
    'Militar': ['M4A4', 'AK-47', 'AWP', 'Desert Eagle', 'USP-S'],
    'Restrito': ['M4A1-S', 'AK-47', 'AWP', 'Glock-18', 'Five-SeveN'],
    'Secreto': ['AK-47', 'M4A4', 'AWP', 'Desert Eagle', 'USP-S'],
    'Faca/Luva': ['Karambit', 'Butterfly Knife', 'M9 Bayonet', 'Skeleton Knife', 'Talon Knife'],
  };

  const skins: Record<string, string[]> = {
    'Consumidor': ['Sand Dune', 'Safari Mesh', 'Groundwater', 'Forest DDPAT', 'Urban DDPAT'],
    'Industrial': ['Blue Steel', 'Stainless', 'Urban Masked', 'Jungle Tiger', 'Predator'],
    'Militar': ['Redline', 'Asiimov', 'Hyper Beast', 'Vulcan', 'Kill Confirmed'],
    'Restrito': ['Neo-Noir', 'Printstream', 'The Prince', 'Fade', 'Fire Serpent'],
    'Secreto': ['Dragon Lore', 'Howl', 'Medusa', 'Gungnir', 'The Empress'],
    'Faca/Luva': ['Doppler', 'Fade', 'Marble Fade', 'Tiger Tooth', 'Crimson Web'],
  };

  const weaponList = weapons[rarity] || weapons['Consumidor'];
  const skinList = skins[rarity] || skins['Consumidor'];
  
  const weapon = weaponList[Math.floor(Math.random() * weaponList.length)];
  const skin = skinList[Math.floor(Math.random() * skinList.length)];
  
  return {
    name: `${weapon} | ${skin}`,
    weapon,
    skin,
  };
}

function sanitizeTournament2x2Team(team: any, isAdmin: boolean) {
  if (isAdmin) return team;
  // Esconde dados sensíveis para usuários públicos
  const { contactPhone, paymentMethod, paymentProof, notes, ...rest } = team;
  return rest;
}

export function registerTournament2x2Routes(app: any, isAuthenticated: any) {
  // PÚBLICO: listar times (sem dados sensíveis)
  app.get("/api/tournament-2x2/teams", async (req: any, res: any) => {
    try {
      const teams = await storage.listTournament2x2Teams();
      const isAuth = typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : false;
      let isAdmin = false;
      if (isAuth && req.user?.claims?.sub) {
        const u = await storage.getUser((req.user?.id || req.user?.claims?.sub));
        isAdmin = !!u?.isAdmin;
      }
      res.json(teams.map((t) => sanitizeTournament2x2Team(t, isAdmin)));
    } catch (e) {
      console.error("[t2x2] list teams", e);
      res.status(500).json({ message: "Erro ao listar times" });
    }
  });

  // PÚBLICO: cadastro (sem login)
  app.post("/api/tournament-2x2/teams", async (req: any, res: any) => {
    try {
      const parsed = insertTournament2x2TeamSchema.parse(req.body);
      const all = await storage.listTournament2x2Teams();
      if (all.length >= 32) {
        return res.status(400).json({ message: "Limite de 32 duplas atingido" });
      }
      const created = await storage.createTournament2x2Team(parsed);
      res.json({ id: created.id, teamName: created.teamName });
    } catch (e: any) {
      if (e?.name === "ZodError") return res.status(400).json({ message: "Dados inválidos", errors: e.errors });
      console.error("[t2x2] create team", e);
      res.status(500).json({ message: "Erro ao cadastrar dupla" });
    }
  });

  // ADMIN: editar
  app.patch("/api/tournament-2x2/teams/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const u = await storage.getUser((req.user?.id || req.user?.claims?.sub));
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const parsed = updateTournament2x2TeamSchema.parse(req.body);
      const updated = await storage.updateTournament2x2Team(Number(req.params.id), parsed);
      if (!updated) return res.status(404).json({ message: "Não encontrado" });
      res.json(updated);
    } catch (e: any) {
      if (e?.name === "ZodError") return res.status(400).json({ message: "Dados inválidos", errors: e.errors });
      console.error("[t2x2] update team", e);
      res.status(500).json({ message: "Erro ao atualizar" });
    }
  });

  // ADMIN: confirmar
  app.post("/api/tournament-2x2/teams/:id/confirm", isAuthenticated, async (req: any, res: any) => {
    try {
      const u = await storage.getUser((req.user?.id || req.user?.claims?.sub));
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const { confirmed } = req.body as { confirmed: boolean };
      const updated = await storage.updateTournament2x2Team(Number(req.params.id), { isConfirmed: !!confirmed });
      if (!updated) return res.status(404).json({ message: "Não encontrado" });
      res.json(updated);
    } catch (e) {
      console.error("[t2x2] confirm", e);
      res.status(500).json({ message: "Erro" });
    }
  });

  // ADMIN: excluir
  app.delete("/api/tournament-2x2/teams/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const u = await storage.getUser((req.user?.id || req.user?.claims?.sub));
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const ok = await storage.deleteTournament2x2Team(Number(req.params.id));
      res.json({ ok });
    } catch (e) {
      console.error("[t2x2] delete", e);
      res.status(500).json({ message: "Erro" });
    }
  });

  // PÚBLICO: chaveamento (com nomes dos times)
  app.get("/api/tournament-2x2/bracket", async (_req: any, res: any) => {
    try {
      const matches = await storage.listTournament2x2Matches();
      const teams = await storage.listTournament2x2Teams();
      const byId = new Map(teams.map((t) => [t.id, t.teamName]));
      res.json(matches.map((m) => ({
        ...m,
        team1Name: m.team1Id ? byId.get(m.team1Id) ?? null : null,
        team2Name: m.team2Id ? byId.get(m.team2Id) ?? null : null,
      })));
    } catch (e) {
      console.error("[t2x2] bracket", e);
      res.status(500).json({ message: "Erro" });
    }
  });

  // ADMIN: sortear chaveamento (apenas times confirmados)
  app.post("/api/tournament-2x2/bracket/draw", isAuthenticated, async (req: any, res: any) => {
    try {
      const u = await storage.getUser((req.user?.id || req.user?.claims?.sub));
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const all = await storage.listTournament2x2Teams();
      const confirmed = all.filter((t) => t.isConfirmed);
      if (confirmed.length < 2) return res.status(400).json({ message: "Pelo menos 2 duplas confirmadas" });

      // Embaralhar
      const shuffled = [...confirmed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Encontrar próxima potência de 2 (até 32)
      let bracketSize = 2;
      while (bracketSize < shuffled.length) bracketSize *= 2;
      if (bracketSize > 32) bracketSize = 32;

      // Round 1 (R32): bracketSize/2 partidas
      const matches: { round: number; position: number; team1Id: number | null; team2Id: number | null }[] = [];
      const firstRoundMatches = bracketSize / 2;
      for (let i = 0; i < firstRoundMatches; i++) {
        const t1 = shuffled[i * 2] ?? null;
        const t2 = shuffled[i * 2 + 1] ?? null;
        matches.push({
          round: 1,
          position: i + 1,
          team1Id: t1?.id ?? null,
          team2Id: t2?.id ?? null,
        });
      }
      // Rounds subsequentes vazios
      let cur = firstRoundMatches / 2;
      let round = 2;
      while (cur >= 1) {
        for (let i = 0; i < cur; i++) {
          matches.push({ round, position: i + 1, team1Id: null, team2Id: null });
        }
        cur = Math.floor(cur / 2);
        round++;
      }

      const created = await storage.replaceTournament2x2Bracket(matches as any);

      // Auto-avança byes (times sem oponente na rodada 1)
      const allMatches = await storage.listTournament2x2Matches();
      for (const m of allMatches.filter((x) => x.round === 1)) {
        const lone = m.team1Id && !m.team2Id ? m.team1Id : !m.team1Id && m.team2Id ? m.team2Id : null;
        if (lone) {
          await storage.updateTournament2x2Match(m.id, { winnerId: lone });
          await propagateWinner(m.round, m.position, lone);
        }
      }

      res.json(await storage.listTournament2x2Matches());
    } catch (e) {
      console.error("[t2x2] draw", e);
      res.status(500).json({ message: "Erro ao sortear" });
    }
  });

  // ADMIN: registrar resultado de partida
  app.patch("/api/tournament-2x2/matches/:id", isAuthenticated, async (req: any, res: any) => {
    try {
      const u = await storage.getUser((req.user?.id || req.user?.claims?.sub));
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });

      const matchId = Number(req.params.id);
      const all = await storage.listTournament2x2Matches();
      const current = all.find((m) => m.id === matchId);
      if (!current) return res.status(404).json({ message: "Partida não encontrada" });

      const { score1, score2, winnerId } = req.body;
      const newWinnerId = winnerId != null ? Number(winnerId) : null;

      // Validação: winnerId deve ser null ou um dos participantes da partida
      if (newWinnerId !== null && newWinnerId !== current.team1Id && newWinnerId !== current.team2Id) {
        return res.status(400).json({ message: "Vencedor inválido para esta partida" });
      }

      const updated = await storage.updateTournament2x2Match(matchId, {
        score1: score1 != null ? Number(score1) : null,
        score2: score2 != null ? Number(score2) : null,
        winnerId: newWinnerId,
      });
      if (!updated) return res.status(404).json({ message: "Partida não encontrada" });

      // Se vencedor mudou, limpa propagações antigas (cascata) e propaga o novo
      if (current.winnerId !== newWinnerId) {
        if (current.winnerId != null) {
          await clearDownstream(updated.round, updated.position, current.winnerId);
        }
        if (newWinnerId !== null) {
          await propagateWinner(updated.round, updated.position, newWinnerId);
        }
      }

      res.json(updated);
    } catch (e) {
      console.error("[t2x2] match update", e);
      res.status(500).json({ message: "Erro" });
    }
  });
}

async function propagateWinner(fromRound: number, fromPosition: number, winnerId: number) {
  const all = await storage.listTournament2x2Matches();
  const next = all.find((m) => m.round === fromRound + 1 && m.position === Math.ceil(fromPosition / 2));
  if (!next) return;
  const isTeam1Slot = fromPosition % 2 === 1;
  await storage.updateTournament2x2Match(next.id, {
    [isTeam1Slot ? "team1Id" : "team2Id"]: winnerId,
  } as any);
}

async function clearDownstream(fromRound: number, fromPosition: number, oldWinnerId: number) {
  const all = await storage.listTournament2x2Matches();
  let curRound = fromRound + 1;
  let curPosition = Math.ceil(fromPosition / 2);
  let isTeam1Slot = fromPosition % 2 === 1;
  while (true) {
    const next = all.find((m) => m.round === curRound && m.position === curPosition);
    if (!next) return;
    const fieldHadOld = isTeam1Slot ? next.team1Id === oldWinnerId : next.team2Id === oldWinnerId;
    if (!fieldHadOld) return;
    // Limpa slot e qualquer resultado dessa partida (e segue cascateando se já tinha winner)
    await storage.updateTournament2x2Match(next.id, {
      [isTeam1Slot ? "team1Id" : "team2Id"]: null,
      score1: null,
      score2: null,
      winnerId: null,
    } as any);
    if (next.winnerId == null) return;
    // próxima cascata: se a partida next tinha esse winner como seu próprio winner, limpa adiante
    const propagatedWinner = next.winnerId;
    isTeam1Slot = curPosition % 2 === 1;
    curPosition = Math.ceil(curPosition / 2);
    curRound++;
    oldWinnerId = propagatedWinner;
  }
}
