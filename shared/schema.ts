import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with CS stats
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  // Steam ID for linking with server data
  steamId64: varchar("steam_id_64").unique(),
  // CS:GO Stats (aggregated from matches)
  nickname: varchar("nickname"),
  totalKills: integer("total_kills").default(0).notNull(),
  totalDeaths: integer("total_deaths").default(0).notNull(),
  totalAssists: integer("total_assists").default(0).notNull(),
  totalHeadshots: integer("total_headshots").default(0).notNull(),
  totalDamage: integer("total_damage").default(0).notNull(),
  totalMatches: integer("total_matches").default(0).notNull(),
  matchesWon: integer("matches_won").default(0).notNull(),
  matchesLost: integer("matches_lost").default(0).notNull(),
  totalRoundsPlayed: integer("total_rounds_played").default(0).notNull(),
  roundsWon: integer("rounds_won").default(0).notNull(),
  totalMvps: integer("total_mvps").default(0).notNull(),
  // Clutch stats
  total1v1Count: integer("total_1v1_count").default(0).notNull(),
  total1v1Wins: integer("total_1v1_wins").default(0).notNull(),
  total1v2Count: integer("total_1v2_count").default(0).notNull(),
  total1v2Wins: integer("total_1v2_wins").default(0).notNull(),
  // Entry frag stats
  totalEntryCount: integer("total_entry_count").default(0).notNull(),
  totalEntryWins: integer("total_entry_wins").default(0).notNull(),
  // Multi-kill rounds
  total5ks: integer("total_5ks").default(0).notNull(),
  total4ks: integer("total_4ks").default(0).notNull(),
  total3ks: integer("total_3ks").default(0).notNull(),
  total2ks: integer("total_2ks").default(0).notNull(),
  // Utility stats
  totalFlashCount: integer("total_flash_count").default(0).notNull(),
  totalFlashSuccesses: integer("total_flash_successes").default(0).notNull(),
  totalEnemiesFlashed: integer("total_enemies_flashed").default(0).notNull(),
  totalUtilityDamage: integer("total_utility_damage").default(0).notNull(),
  // Accuracy stats
  totalShotsFired: integer("total_shots_fired").default(0).notNull(),
  totalShotsOnTarget: integer("total_shots_on_target").default(0).notNull(),
  skillRating: integer("skill_rating").default(1000).notNull(),
  levelPoints: integer("level_points").default(0).notNull(),
  discordUserId: varchar("discord_user_id", { length: 32 }).unique(),
  // Streak system
  winStreak: integer("win_streak").default(0).notNull(),
  // Modifier items
  desafioRpCount: integer("desafio_rp_count").default(0).notNull(),
  freezeRpCount: integer("freeze_rp_count").default(0).notNull(),
  activeModifier: varchar("active_modifier", { length: 20 }),
  itemsUsedToday: integer("items_used_today").default(0).notNull(),
  itemsLastUsedDate: varchar("items_last_used_date", { length: 10 }),
  // Ban system
  isBanned: boolean("is_banned").default(false).notNull(),
  isCheaterBanned: boolean("is_cheater_banned").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Matches table
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  externalMatchId: integer("external_match_id"),
  mapNumber: integer("map_number").default(0).notNull(),
  map: varchar("map").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  team1Name: varchar("team1_name"),
  team2Name: varchar("team2_name"),
  team1Score: integer("team1_score").default(0).notNull(),
  team2Score: integer("team2_score").default(0).notNull(),
  winnerTeam: varchar("winner_team"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Match stats per player - detailed stats from server CSV
export const matchStats = pgTable("match_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  steamId64: varchar("steam_id_64"),
  team: varchar("team_name"),
  playerName: varchar("player_name"),
  // Basic stats
  kills: integer("kills").default(0).notNull(),
  deaths: integer("deaths").default(0).notNull(),
  assists: integer("assists").default(0).notNull(),
  damage: integer("damage").default(0).notNull(),
  headshots: integer("headshots").default(0).notNull(),
  // Multi-kill rounds
  enemy5ks: integer("enemy_5ks").default(0).notNull(),
  enemy4ks: integer("enemy_4ks").default(0).notNull(),
  enemy3ks: integer("enemy_3ks").default(0).notNull(),
  enemy2ks: integer("enemy_2ks").default(0).notNull(),
  // Utility stats
  utilityCount: integer("utility_count").default(0).notNull(),
  utilityDamage: integer("utility_damage").default(0).notNull(),
  utilitySuccesses: integer("utility_successes").default(0).notNull(),
  utilityEnemies: integer("utility_enemies").default(0).notNull(),
  // Flash stats
  flashCount: integer("flash_count").default(0).notNull(),
  flashSuccesses: integer("flash_successes").default(0).notNull(),
  enemiesFlashed: integer("enemies_flashed").default(0).notNull(),
  // Damage stats
  healthPointsRemovedTotal: integer("health_points_removed_total").default(0).notNull(),
  healthPointsDealtTotal: integer("health_points_dealt_total").default(0).notNull(),
  // Accuracy stats
  shotsFiredTotal: integer("shots_fired_total").default(0).notNull(),
  shotsOnTargetTotal: integer("shots_on_target_total").default(0).notNull(),
  // Clutch stats
  v1Count: integer("v1_count").default(0).notNull(),
  v1Wins: integer("v1_wins").default(0).notNull(),
  v2Count: integer("v2_count").default(0).notNull(),
  v2Wins: integer("v2_wins").default(0).notNull(),
  // Entry frag stats
  entryCount: integer("entry_count").default(0).notNull(),
  entryWins: integer("entry_wins").default(0).notNull(),
  // Economy stats
  equipmentValue: integer("equipment_value").default(0).notNull(),
  moneySaved: integer("money_saved").default(0).notNull(),
  killReward: integer("kill_reward").default(0).notNull(),
  cashEarned: integer("cash_earned").default(0).notNull(),
  // Other stats
  liveTime: integer("live_time").default(0).notNull(),
  mvps: integer("mvps").default(0).notNull(),
  score: integer("score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  matchStats: many(matchStats),
}));

export const matchesRelations = relations(matches, ({ many }) => ({
  stats: many(matchStats),
}));

export const matchStatsRelations = relations(matchStats, ({ one }) => ({
  match: one(matches, {
    fields: [matchStats.matchId],
    references: [matches.id],
  }),
  user: one(users, {
    fields: [matchStats.userId],
    references: [users.id],
  }),
}));

// Payments table for financial tracking
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: real("amount").notNull(),
  description: varchar("description"),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [payments.createdBy],
    references: [users.id],
  }),
}));

// Reports table for user complaints/denuncias
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  description: varchar("description", { length: 2000 }).notNull(),
  attachmentUrl: varchar("attachment_url"),
  attachmentType: varchar("attachment_type"),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  status: varchar("status").default("pending").notNull(),
  adminNotes: varchar("admin_notes", { length: 1000 }),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id],
  }),
}));

// Championship registrations table
export const championshipRegistrations = pgTable("championship_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar("status").default("interested").notNull(),
  notes: varchar("notes", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const championshipRegistrationsRelations = relations(championshipRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [championshipRegistrations.userId],
    references: [users.id],
  }),
}));

// Monthly ranking snapshots table
export const monthlyRankings = pgTable("monthly_rankings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  rankings: jsonb("rankings").notNull(), // Array of player rankings with stats
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mix availability list - players available for mix
export const mixAvailability = pgTable("mix_availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listDate: varchar("list_date").notNull(), // YYYY-MM-DD format
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  position: integer("position").notNull(), // 1-10 main, 11+ substitutes
  isSub: boolean("is_sub").default(false).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const mixAvailabilityRelations = relations(mixAvailability, ({ one }) => ({
  user: one(users, {
    fields: [mixAvailability.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserStatsSchema = z.object({
  nickname: z.string().optional(),
  steamId64: z.string().optional(),
  totalKills: z.number().int().min(0).optional(),
  totalDeaths: z.number().int().min(0).optional(),
  totalAssists: z.number().int().min(0).optional(),
  totalHeadshots: z.number().int().min(0).optional(),
  totalDamage: z.number().int().min(0).optional(),
  totalMatches: z.number().int().min(0).optional(),
  matchesWon: z.number().int().min(0).optional(),
  matchesLost: z.number().int().min(0).optional(),
  totalRoundsPlayed: z.number().int().min(0).optional(),
  roundsWon: z.number().int().min(0).optional(),
  totalMvps: z.number().int().min(0).optional(),
  total1v1Count: z.number().int().min(0).optional(),
  total1v1Wins: z.number().int().min(0).optional(),
  total1v2Count: z.number().int().min(0).optional(),
  total1v2Wins: z.number().int().min(0).optional(),
  totalEntryCount: z.number().int().min(0).optional(),
  totalEntryWins: z.number().int().min(0).optional(),
  total5ks: z.number().int().min(0).optional(),
  total4ks: z.number().int().min(0).optional(),
  total3ks: z.number().int().min(0).optional(),
  total2ks: z.number().int().min(0).optional(),
  totalFlashCount: z.number().int().min(0).optional(),
  totalFlashSuccesses: z.number().int().min(0).optional(),
  totalEnemiesFlashed: z.number().int().min(0).optional(),
  totalUtilityDamage: z.number().int().min(0).optional(),
  totalShotsFired: z.number().int().min(0).optional(),
  totalShotsOnTarget: z.number().int().min(0).optional(),
  skillRating: z.number().int().min(0).optional(),
  isAdmin: z.boolean().optional(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertMatchStatsSchema = createInsertSchema(matchStats).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
});

export const updateReportSchema = z.object({
  status: z.enum(["pending", "reviewing", "resolved", "dismissed"]).optional(),
  adminNotes: z.string().max(1000).optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.date().optional(),
});

export const insertChampionshipRegistrationSchema = createInsertSchema(championshipRegistrations).omit({
  id: true,
  createdAt: true,
});

export const insertMonthlyRankingSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  rankings: z.any(),
});

// Casino balance table - fictional money for betting
export const casinoBalances = pgTable("casino_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  balance: real("balance").default(10000000).notNull(), // Start with R$10 million
  totalWon: real("total_won").default(0).notNull(),
  totalLost: real("total_lost").default(0).notNull(),
  totalBets: integer("total_bets").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bets table - main bet record
export const bets = pgTable("bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetPlayerId: varchar("target_player_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  matchId: varchar("match_id").references(() => matches.id, { onDelete: 'set null' }),
  amount: real("amount").notNull(), // Amount wagered
  totalOdds: real("total_odds").notNull(), // Combined odds
  potentialWin: real("potential_win").notNull(), // amount * totalOdds
  status: varchar("status").default("pending").notNull(), // pending, won, lost, cancelled
  result: varchar("result"), // Details about result
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Bet items - individual conditions within a bet
export const betItems = pgTable("bet_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  betId: varchar("bet_id").notNull().references(() => bets.id, { onDelete: 'cascade' }),
  betType: varchar("bet_type").notNull(), // kills_over, kills_under, kd_over, kd_under, win, headshots_over, etc.
  targetValue: real("target_value").notNull(), // The value to compare against
  odds: real("odds").notNull(), // Individual odds for this condition
  won: boolean("won"), // null if pending, true/false after resolution
  actualValue: real("actual_value"), // Actual value achieved
});

// Casino transactions for case openings and slots
export const casinoTransactions = pgTable("casino_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type").notNull(), // bet, case_opening, slot_win, slot_loss
  amount: real("amount").notNull(), // Positive for wins, negative for losses
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCasinoBalanceSchema = createInsertSchema(casinoBalances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBetSchema = z.object({
  targetPlayerId: z.string(),
  amount: z.number().min(10, "Aposta mínima é R$10"),
  items: z.array(z.object({
    betType: z.string(),
    targetValue: z.number(),
  })).min(1, "Selecione pelo menos uma condição"),
});

export const insertCasinoTransactionSchema = createInsertSchema(casinoTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertMixAvailabilitySchema = createInsertSchema(mixAvailability).omit({
  id: true,
  joinedAt: true,
});

export const mixPenalties = pgTable("mix_penalties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  listDate: varchar("list_date").notNull(),
  type: varchar("type").notNull().default("no_show"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mixPenaltyRelations = relations(mixPenalties, ({ one }) => ({
  user: one(users, {
    fields: [mixPenalties.userId],
    references: [users.id],
  }),
}));

export const insertMixPenaltySchema = createInsertSchema(mixPenalties).omit({
  id: true,
  createdAt: true,
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export const trophies = pgTable("trophies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  value: varchar("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trophyRelations = relations(trophies, ({ one }) => ({
  user: one(users, {
    fields: [trophies.userId],
    references: [users.id],
  }),
}));

export const insertTrophySchema = createInsertSchema(trophies).omit({
  id: true,
  createdAt: true,
});

// Community survey table - required for all users
export const surveys = pgTable("surveys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  bestPlayTimes: text("best_play_times").array(), // selected hours e.g. ["19:00","20:00"]
  faceitLevel: integer("faceit_level"), // 1-10
  gcLevel: integer("gc_level"), // 1-21
  valveLevel: varchar("valve_level"), // text
  improvementSuggestions: text("improvement_suggestions"),
  reasonNotPlaying: text("reason_not_playing"),
  attractMorePlayers: text("attract_more_players"),
  playMoreWays: text("play_more_ways"),
  generalOpinions: text("general_opinions"),
  levelUpInfluenced: varchar("level_up_influenced"), // "yes" | "no"
  levelUpInfluencedComment: text("level_up_influenced_comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const surveyRelations = relations(surveys, ({ one }) => ({
  user: one(users, { fields: [surveys.userId], references: [users.id] }),
}));

export const insertSurveySchema = createInsertSchema(surveys).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// ── Copa Aliados ─────────────────────────────────────────────────────────────

export const copaTeams = pgTable("copa_teams", {
  id: serial("id").primaryKey(),
  teamName: varchar("team_name", { length: 100 }).notNull(),
  leaderName: varchar("leader_name", { length: 100 }).notNull(),
  leaderContact: varchar("leader_contact", { length: 200 }).notNull(), // email or phone
  paymentProof: text("payment_proof"), // base64 image or URL
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending|confirmed|rejected
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const copaPlayers = pgTable("copa_players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => copaTeams.id, { onDelete: "cascade" }),
  playerName: varchar("player_name", { length: 100 }).notNull(),
  steamProfile: varchar("steam_profile", { length: 200 }).notNull(),
  age: integer("age").notNull(),
  position: varchar("position", { length: 50 }).notNull(), // AWPer/Rifler/IGL/Support/Entry/Lurker
  gcLevel: integer("gc_level"), // 0 = sem conta, 1-21
  faceitLevel: integer("faceit_level"), // 0 = sem conta, 1-10
  isLeader: boolean("is_leader").default(false).notNull(),
  playerOrder: integer("player_order").default(0).notNull(),
});

export const copaMatches = pgTable("copa_matches", {
  id: serial("id").primaryKey(),
  round: varchar("round", { length: 50 }).notNull(), // "Fase de Grupos", "Oitavas", "Quartas", "Semi", "Final"
  roundNumber: integer("round_number").notNull(), // 1, 2, 3...
  team1Id: integer("team1_id").references(() => copaTeams.id),
  team2Id: integer("team2_id").references(() => copaTeams.id),
  team1Score: integer("team1_score"),
  team2Score: integer("team2_score"),
  winnerId: integer("winner_id").references(() => copaTeams.id),
  mapName: varchar("map_name", { length: 50 }),
  scheduledAt: timestamp("scheduled_at"),
  streamUrl: varchar("stream_url", { length: 500 }),
  notes: text("notes"),
  isFinished: boolean("is_finished").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const copaMatchStats = pgTable("copa_match_stats", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => copaMatches.id, { onDelete: "cascade" }),
  teamId: integer("team_id").references(() => copaTeams.id),
  playerName: varchar("player_name", { length: 100 }).notNull(),
  steamProfile: varchar("steam_profile", { length: 200 }),
  kills: integer("kills").default(0).notNull(),
  deaths: integer("deaths").default(0).notNull(),
  assists: integer("assists").default(0).notNull(),
  headshots: integer("headshots").default(0).notNull(),
  damage: integer("damage").default(0).notNull(),
  adr: real("adr").default(0).notNull(), // average damage per round
  firstKills: integer("first_kills").default(0).notNull(),
  flashAssists: integer("flash_assists").default(0).notNull(),
  twoK: integer("two_k").default(0).notNull(),
  threeK: integer("three_k").default(0).notNull(),
  fourK: integer("four_k").default(0).notNull(),
  fiveK: integer("five_k").default(0).notNull(),
  clutch1v1Wins: integer("clutch_1v1_wins").default(0).notNull(),
  clutch1v2Wins: integer("clutch_1v2_wins").default(0).notNull(),
  rating: real("rating").default(0), // custom rating
});

export const copaTeamRelations = relations(copaTeams, ({ many }) => ({
  players: many(copaPlayers),
}));

export const copaPlayerRelations = relations(copaPlayers, ({ one }) => ({
  team: one(copaTeams, { fields: [copaPlayers.teamId], references: [copaTeams.id] }),
}));

export const copaMatchRelations = relations(copaMatches, ({ one, many }) => ({
  team1: one(copaTeams, { fields: [copaMatches.team1Id], references: [copaTeams.id], relationName: "team1" }),
  team2: one(copaTeams, { fields: [copaMatches.team2Id], references: [copaTeams.id], relationName: "team2" }),
  winner: one(copaTeams, { fields: [copaMatches.winnerId], references: [copaTeams.id], relationName: "winner" }),
  stats: many(copaMatchStats),
}));

export const copaMatchStatsRelations = relations(copaMatchStats, ({ one }) => ({
  match: one(copaMatches, { fields: [copaMatchStats.matchId], references: [copaMatches.id] }),
  team: one(copaTeams, { fields: [copaMatchStats.teamId], references: [copaTeams.id] }),
}));

export type CopaTeam = typeof copaTeams.$inferSelect;
export type CopaPlayer = typeof copaPlayers.$inferSelect;
export type CopaMatch = typeof copaMatches.$inferSelect;
export type CopaMatchStats = typeof copaMatchStats.$inferSelect;

// Types
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type Trophy = typeof trophies.$inferSelect;
export type InsertTrophy = z.infer<typeof insertTrophySchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type MatchStats = typeof matchStats.$inferSelect;
export type InsertMatchStats = z.infer<typeof insertMatchStatsSchema>;
export type UpdateUserStats = z.infer<typeof updateUserStatsSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type UpdateReport = z.infer<typeof updateReportSchema>;
export type ChampionshipRegistration = typeof championshipRegistrations.$inferSelect;
export type InsertChampionshipRegistration = z.infer<typeof insertChampionshipRegistrationSchema>;
export type MonthlyRanking = typeof monthlyRankings.$inferSelect;
export type InsertMonthlyRanking = z.infer<typeof insertMonthlyRankingSchema>;
export type CasinoBalance = typeof casinoBalances.$inferSelect;
export type InsertCasinoBalance = z.infer<typeof insertCasinoBalanceSchema>;
export type Bet = typeof bets.$inferSelect;
export type BetItem = typeof betItems.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;
export type CasinoTransaction = typeof casinoTransactions.$inferSelect;
export type InsertCasinoTransaction = z.infer<typeof insertCasinoTransactionSchema>;
export type MixAvailability = typeof mixAvailability.$inferSelect;
export type InsertMixAvailability = z.infer<typeof insertMixAvailabilitySchema>;
export type MixPenalty = typeof mixPenalties.$inferSelect;
export type InsertMixPenalty = z.infer<typeof insertMixPenaltySchema>;

// ─── Aliados Fantasy ─────────────────────────────────────────────────────────

export const fantasyRounds = pgTable("fantasy_rounds", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).default("open").notNull(), // open | calculating | finished
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fantasyTeams = pgTable("fantasy_teams", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roundId: integer("round_id").notNull().references(() => fantasyRounds.id, { onDelete: "cascade" }),
  totalPoints: real("total_points").default(0).notNull(),
  budgetUsed: integer("budget_used").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fantasyPicks = pgTable("fantasy_picks", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => fantasyTeams.id, { onDelete: "cascade" }),
  pickedUserId: varchar("picked_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  points: real("points").default(0).notNull(),
  price: integer("price").default(0).notNull(),
});

// Budget for fantasy team selection
export const FANTASY_BUDGET = 100;

export const insertFantasyRoundSchema = createInsertSchema(fantasyRounds).omit({ id: true, createdAt: true });
export const insertFantasyTeamSchema = createInsertSchema(fantasyTeams).omit({ id: true, createdAt: true, totalPoints: true });
export const insertFantasyPickSchema = createInsertSchema(fantasyPicks).omit({ id: true, points: true });

export type FantasyRound = typeof fantasyRounds.$inferSelect;
export type InsertFantasyRound = z.infer<typeof insertFantasyRoundSchema>;
export type FantasyTeam = typeof fantasyTeams.$inferSelect;
export type FantasyPick = typeof fantasyPicks.$inferSelect;

// Web Push subscriptions (VAPID)
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({ id: true, createdAt: true });
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;

// Generic key/value app settings (used to persist VAPID keys)
export const appSettings = pgTable("app_settings", {
  key: varchar("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AppSetting = typeof appSettings.$inferSelect;

// Raffles / Sorteios
export const raffles = pgTable("raffles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  minMatches: integer("min_matches").notNull(),
  eligibleSnapshot: jsonb("eligible_snapshot").notNull(),
  winnerUserId: varchar("winner_user_id").references(() => users.id, { onDelete: "set null" }),
  winnerNickname: varchar("winner_nickname"),
  seed: varchar("seed").notNull(),
  randomValue: varchar("random_value").notNull(),
  winnerIndex: integer("winner_index").notNull(),
  notifiedAt: timestamp("notified_at"),
  winnerSeenAt: timestamp("winner_seen_at"),
  createdById: varchar("created_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Raffle = typeof raffles.$inferSelect;
export type RaffleEligibleEntry = {
  userId: string;
  nickname: string;
  matchesPlayed: number;
  profileImageUrl?: string | null;
};

// Torneio 2x2
export const tournament2x2Teams = pgTable("tournament_2x2_teams", {
  id: serial("id").primaryKey(),
  teamName: varchar("team_name", { length: 100 }).notNull(),
  player1Name: varchar("player1_name", { length: 100 }).notNull(),
  player1SteamId: varchar("player1_steam_id", { length: 200 }).notNull(),
  player1Discord: varchar("player1_discord", { length: 100 }),
  player2Name: varchar("player2_name", { length: 100 }).notNull(),
  player2SteamId: varchar("player2_steam_id", { length: 200 }).notNull(),
  player2Discord: varchar("player2_discord", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentProof: text("payment_proof"),
  notes: text("notes"),
  isConfirmed: boolean("is_confirmed").default(false).notNull(),
  seed: integer("seed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tournament2x2Matches = pgTable("tournament_2x2_matches", {
  id: serial("id").primaryKey(),
  round: integer("round").notNull(),
  position: integer("position").notNull(),
  team1Id: integer("team1_id").references(() => tournament2x2Teams.id, { onDelete: "set null" }),
  team2Id: integer("team2_id").references(() => tournament2x2Teams.id, { onDelete: "set null" }),
  score1: integer("score1"),
  score2: integer("score2"),
  winnerId: integer("winner_id").references(() => tournament2x2Teams.id, { onDelete: "set null" }),
  scheduledAt: timestamp("scheduled_at"),
});

export const insertTournament2x2TeamSchema = createInsertSchema(tournament2x2Teams).omit({
  id: true,
  isConfirmed: true,
  seed: true,
  createdAt: true,
  updatedAt: true,
});
export const updateTournament2x2TeamSchema = createInsertSchema(tournament2x2Teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();
export const insertTournament2x2MatchSchema = createInsertSchema(tournament2x2Matches).omit({ id: true });

export type Tournament2x2Team = typeof tournament2x2Teams.$inferSelect;
export type InsertTournament2x2Team = z.infer<typeof insertTournament2x2TeamSchema>;
export type UpdateTournament2x2Team = z.infer<typeof updateTournament2x2TeamSchema>;
export type Tournament2x2Match = typeof tournament2x2Matches.$inferSelect;
export type InsertTournament2x2Match = z.infer<typeof insertTournament2x2MatchSchema>;
