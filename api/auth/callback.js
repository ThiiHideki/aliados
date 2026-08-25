"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/auth/callback.ts
var callback_exports = {};
__export(callback_exports, {
  default: () => handler
});
module.exports = __toCommonJS(callback_exports);
var import_crypto = require("crypto");

// server/db.ts
var import_postgres = __toESM(require("postgres"), 1);
var import_postgres_js = require("drizzle-orm/postgres-js");

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  FANTASY_BUDGET: () => FANTASY_BUDGET,
  appSettings: () => appSettings,
  betItems: () => betItems,
  bets: () => bets,
  casinoBalances: () => casinoBalances,
  casinoTransactions: () => casinoTransactions,
  championshipRegistrations: () => championshipRegistrations,
  championshipRegistrationsRelations: () => championshipRegistrationsRelations,
  copaMatchRelations: () => copaMatchRelations,
  copaMatchStats: () => copaMatchStats,
  copaMatchStatsRelations: () => copaMatchStatsRelations,
  copaMatches: () => copaMatches,
  copaPlayerRelations: () => copaPlayerRelations,
  copaPlayers: () => copaPlayers,
  copaTeamRelations: () => copaTeamRelations,
  copaTeams: () => copaTeams,
  fantasyPicks: () => fantasyPicks,
  fantasyRounds: () => fantasyRounds,
  fantasyTeams: () => fantasyTeams,
  insertBetSchema: () => insertBetSchema,
  insertCasinoBalanceSchema: () => insertCasinoBalanceSchema,
  insertCasinoTransactionSchema: () => insertCasinoTransactionSchema,
  insertChampionshipRegistrationSchema: () => insertChampionshipRegistrationSchema,
  insertFantasyPickSchema: () => insertFantasyPickSchema,
  insertFantasyRoundSchema: () => insertFantasyRoundSchema,
  insertFantasyTeamSchema: () => insertFantasyTeamSchema,
  insertMatchSchema: () => insertMatchSchema,
  insertMatchStatsSchema: () => insertMatchStatsSchema,
  insertMixAvailabilitySchema: () => insertMixAvailabilitySchema,
  insertMixPenaltySchema: () => insertMixPenaltySchema,
  insertMonthlyRankingSchema: () => insertMonthlyRankingSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertPushSubscriptionSchema: () => insertPushSubscriptionSchema,
  insertReportSchema: () => insertReportSchema,
  insertSurveySchema: () => insertSurveySchema,
  insertTournament2x2MatchSchema: () => insertTournament2x2MatchSchema,
  insertTournament2x2TeamSchema: () => insertTournament2x2TeamSchema,
  insertTrophySchema: () => insertTrophySchema,
  insertUserSchema: () => insertUserSchema,
  matchStats: () => matchStats,
  matchStatsRelations: () => matchStatsRelations,
  matches: () => matches,
  matchesRelations: () => matchesRelations,
  mixAvailability: () => mixAvailability,
  mixAvailabilityRelations: () => mixAvailabilityRelations,
  mixPenalties: () => mixPenalties,
  mixPenaltyRelations: () => mixPenaltyRelations,
  monthlyRankings: () => monthlyRankings,
  news: () => news,
  newsRelations: () => newsRelations,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  pushSubscriptions: () => pushSubscriptions,
  raffles: () => raffles,
  reports: () => reports,
  reportsRelations: () => reportsRelations,
  sessions: () => sessions,
  surveyRelations: () => surveyRelations,
  surveys: () => surveys,
  tournament2x2Matches: () => tournament2x2Matches,
  tournament2x2Teams: () => tournament2x2Teams,
  trophies: () => trophies,
  trophyRelations: () => trophyRelations,
  updateReportSchema: () => updateReportSchema,
  updateTournament2x2TeamSchema: () => updateTournament2x2TeamSchema,
  updateUserStatsSchema: () => updateUserStatsSchema,
  users: () => users,
  usersRelations: () => usersRelations
});
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_zod = require("drizzle-zod");
var import_zod = require("zod");
var sessions = (0, import_pg_core.pgTable)(
  "sessions",
  {
    sid: (0, import_pg_core.varchar)("sid").primaryKey(),
    sess: (0, import_pg_core.jsonb)("sess").notNull(),
    expire: (0, import_pg_core.timestamp)("expire").notNull()
  },
  (table) => [(0, import_pg_core.index)("IDX_session_expire").on(table.expire)]
);
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  email: (0, import_pg_core.varchar)("email").unique(),
  firstName: (0, import_pg_core.varchar)("first_name"),
  lastName: (0, import_pg_core.varchar)("last_name"),
  profileImageUrl: (0, import_pg_core.varchar)("profile_image_url"),
  isAdmin: (0, import_pg_core.boolean)("is_admin").default(false).notNull(),
  // Steam ID for linking with server data
  steamId64: (0, import_pg_core.varchar)("steam_id_64").unique(),
  // CS:GO Stats (aggregated from matches)
  nickname: (0, import_pg_core.varchar)("nickname"),
  totalKills: (0, import_pg_core.integer)("total_kills").default(0).notNull(),
  totalDeaths: (0, import_pg_core.integer)("total_deaths").default(0).notNull(),
  totalAssists: (0, import_pg_core.integer)("total_assists").default(0).notNull(),
  totalHeadshots: (0, import_pg_core.integer)("total_headshots").default(0).notNull(),
  totalDamage: (0, import_pg_core.integer)("total_damage").default(0).notNull(),
  totalMatches: (0, import_pg_core.integer)("total_matches").default(0).notNull(),
  matchesWon: (0, import_pg_core.integer)("matches_won").default(0).notNull(),
  matchesLost: (0, import_pg_core.integer)("matches_lost").default(0).notNull(),
  totalRoundsPlayed: (0, import_pg_core.integer)("total_rounds_played").default(0).notNull(),
  roundsWon: (0, import_pg_core.integer)("rounds_won").default(0).notNull(),
  totalMvps: (0, import_pg_core.integer)("total_mvps").default(0).notNull(),
  // Clutch stats
  total1v1Count: (0, import_pg_core.integer)("total_1v1_count").default(0).notNull(),
  total1v1Wins: (0, import_pg_core.integer)("total_1v1_wins").default(0).notNull(),
  total1v2Count: (0, import_pg_core.integer)("total_1v2_count").default(0).notNull(),
  total1v2Wins: (0, import_pg_core.integer)("total_1v2_wins").default(0).notNull(),
  // Entry frag stats
  totalEntryCount: (0, import_pg_core.integer)("total_entry_count").default(0).notNull(),
  totalEntryWins: (0, import_pg_core.integer)("total_entry_wins").default(0).notNull(),
  // Multi-kill rounds
  total5ks: (0, import_pg_core.integer)("total_5ks").default(0).notNull(),
  total4ks: (0, import_pg_core.integer)("total_4ks").default(0).notNull(),
  total3ks: (0, import_pg_core.integer)("total_3ks").default(0).notNull(),
  total2ks: (0, import_pg_core.integer)("total_2ks").default(0).notNull(),
  // Utility stats
  totalFlashCount: (0, import_pg_core.integer)("total_flash_count").default(0).notNull(),
  totalFlashSuccesses: (0, import_pg_core.integer)("total_flash_successes").default(0).notNull(),
  totalEnemiesFlashed: (0, import_pg_core.integer)("total_enemies_flashed").default(0).notNull(),
  totalUtilityDamage: (0, import_pg_core.integer)("total_utility_damage").default(0).notNull(),
  // Accuracy stats
  totalShotsFired: (0, import_pg_core.integer)("total_shots_fired").default(0).notNull(),
  totalShotsOnTarget: (0, import_pg_core.integer)("total_shots_on_target").default(0).notNull(),
  skillRating: (0, import_pg_core.integer)("skill_rating").default(1e3).notNull(),
  levelPoints: (0, import_pg_core.integer)("level_points").default(0).notNull(),
  discordUserId: (0, import_pg_core.varchar)("discord_user_id", { length: 32 }).unique(),
  // Streak system
  winStreak: (0, import_pg_core.integer)("win_streak").default(0).notNull(),
  // Modifier items
  desafioRpCount: (0, import_pg_core.integer)("desafio_rp_count").default(0).notNull(),
  freezeRpCount: (0, import_pg_core.integer)("freeze_rp_count").default(0).notNull(),
  activeModifier: (0, import_pg_core.varchar)("active_modifier", { length: 20 }),
  itemsUsedToday: (0, import_pg_core.integer)("items_used_today").default(0).notNull(),
  itemsLastUsedDate: (0, import_pg_core.varchar)("items_last_used_date", { length: 10 }),
  // Ban system
  isBanned: (0, import_pg_core.boolean)("is_banned").default(false).notNull(),
  isCheaterBanned: (0, import_pg_core.boolean)("is_cheater_banned").default(false).notNull(),
  lastLoginAt: (0, import_pg_core.timestamp)("last_login_at"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
});
var matches = (0, import_pg_core.pgTable)("matches", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  externalMatchId: (0, import_pg_core.integer)("external_match_id"),
  mapNumber: (0, import_pg_core.integer)("map_number").default(0).notNull(),
  map: (0, import_pg_core.varchar)("map").notNull(),
  date: (0, import_pg_core.timestamp)("date").defaultNow().notNull(),
  team1Name: (0, import_pg_core.varchar)("team1_name"),
  team2Name: (0, import_pg_core.varchar)("team2_name"),
  team1Score: (0, import_pg_core.integer)("team1_score").default(0).notNull(),
  team2Score: (0, import_pg_core.integer)("team2_score").default(0).notNull(),
  winnerTeam: (0, import_pg_core.varchar)("winner_team"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var matchStats = (0, import_pg_core.pgTable)("match_stats", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  matchId: (0, import_pg_core.varchar)("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  steamId64: (0, import_pg_core.varchar)("steam_id_64"),
  team: (0, import_pg_core.varchar)("team_name"),
  playerName: (0, import_pg_core.varchar)("player_name"),
  // Basic stats
  kills: (0, import_pg_core.integer)("kills").default(0).notNull(),
  deaths: (0, import_pg_core.integer)("deaths").default(0).notNull(),
  assists: (0, import_pg_core.integer)("assists").default(0).notNull(),
  damage: (0, import_pg_core.integer)("damage").default(0).notNull(),
  headshots: (0, import_pg_core.integer)("headshots").default(0).notNull(),
  // Multi-kill rounds
  enemy5ks: (0, import_pg_core.integer)("enemy_5ks").default(0).notNull(),
  enemy4ks: (0, import_pg_core.integer)("enemy_4ks").default(0).notNull(),
  enemy3ks: (0, import_pg_core.integer)("enemy_3ks").default(0).notNull(),
  enemy2ks: (0, import_pg_core.integer)("enemy_2ks").default(0).notNull(),
  // Utility stats
  utilityCount: (0, import_pg_core.integer)("utility_count").default(0).notNull(),
  utilityDamage: (0, import_pg_core.integer)("utility_damage").default(0).notNull(),
  utilitySuccesses: (0, import_pg_core.integer)("utility_successes").default(0).notNull(),
  utilityEnemies: (0, import_pg_core.integer)("utility_enemies").default(0).notNull(),
  // Flash stats
  flashCount: (0, import_pg_core.integer)("flash_count").default(0).notNull(),
  flashSuccesses: (0, import_pg_core.integer)("flash_successes").default(0).notNull(),
  enemiesFlashed: (0, import_pg_core.integer)("enemies_flashed").default(0).notNull(),
  // Damage stats
  healthPointsRemovedTotal: (0, import_pg_core.integer)("health_points_removed_total").default(0).notNull(),
  healthPointsDealtTotal: (0, import_pg_core.integer)("health_points_dealt_total").default(0).notNull(),
  // Accuracy stats
  shotsFiredTotal: (0, import_pg_core.integer)("shots_fired_total").default(0).notNull(),
  shotsOnTargetTotal: (0, import_pg_core.integer)("shots_on_target_total").default(0).notNull(),
  // Clutch stats
  v1Count: (0, import_pg_core.integer)("v1_count").default(0).notNull(),
  v1Wins: (0, import_pg_core.integer)("v1_wins").default(0).notNull(),
  v2Count: (0, import_pg_core.integer)("v2_count").default(0).notNull(),
  v2Wins: (0, import_pg_core.integer)("v2_wins").default(0).notNull(),
  // Entry frag stats
  entryCount: (0, import_pg_core.integer)("entry_count").default(0).notNull(),
  entryWins: (0, import_pg_core.integer)("entry_wins").default(0).notNull(),
  // Economy stats
  equipmentValue: (0, import_pg_core.integer)("equipment_value").default(0).notNull(),
  moneySaved: (0, import_pg_core.integer)("money_saved").default(0).notNull(),
  killReward: (0, import_pg_core.integer)("kill_reward").default(0).notNull(),
  cashEarned: (0, import_pg_core.integer)("cash_earned").default(0).notNull(),
  // Other stats
  liveTime: (0, import_pg_core.integer)("live_time").default(0).notNull(),
  mvps: (0, import_pg_core.integer)("mvps").default(0).notNull(),
  score: (0, import_pg_core.integer)("score").default(0).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var usersRelations = (0, import_drizzle_orm.relations)(users, ({ many }) => ({
  matchStats: many(matchStats)
}));
var matchesRelations = (0, import_drizzle_orm.relations)(matches, ({ many }) => ({
  stats: many(matchStats)
}));
var matchStatsRelations = (0, import_drizzle_orm.relations)(matchStats, ({ one }) => ({
  match: one(matches, {
    fields: [matchStats.matchId],
    references: [matches.id]
  }),
  user: one(users, {
    fields: [matchStats.userId],
    references: [users.id]
  })
}));
var payments = (0, import_pg_core.pgTable)("payments", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: (0, import_pg_core.real)("amount").notNull(),
  description: (0, import_pg_core.varchar)("description"),
  paymentDate: (0, import_pg_core.timestamp)("payment_date").defaultNow().notNull(),
  createdBy: (0, import_pg_core.varchar)("created_by").references(() => users.id),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var paymentsRelations = (0, import_drizzle_orm.relations)(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  }),
  creator: one(users, {
    fields: [payments.createdBy],
    references: [users.id]
  })
}));
var reports = (0, import_pg_core.pgTable)("reports", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").references(() => users.id, { onDelete: "set null" }),
  description: (0, import_pg_core.varchar)("description", { length: 2e3 }).notNull(),
  attachmentUrl: (0, import_pg_core.varchar)("attachment_url"),
  attachmentType: (0, import_pg_core.varchar)("attachment_type"),
  isAnonymous: (0, import_pg_core.boolean)("is_anonymous").default(false).notNull(),
  status: (0, import_pg_core.varchar)("status").default("pending").notNull(),
  adminNotes: (0, import_pg_core.varchar)("admin_notes", { length: 1e3 }),
  reviewedBy: (0, import_pg_core.varchar)("reviewed_by").references(() => users.id),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  reviewedAt: (0, import_pg_core.timestamp)("reviewed_at")
});
var reportsRelations = (0, import_drizzle_orm.relations)(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id]
  }),
  reviewer: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id]
  })
}));
var championshipRegistrations = (0, import_pg_core.pgTable)("championship_registrations", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: (0, import_pg_core.varchar)("status").default("interested").notNull(),
  notes: (0, import_pg_core.varchar)("notes", { length: 500 }),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var championshipRegistrationsRelations = (0, import_drizzle_orm.relations)(championshipRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [championshipRegistrations.userId],
    references: [users.id]
  })
}));
var monthlyRankings = (0, import_pg_core.pgTable)("monthly_rankings", {
  id: (0, import_pg_core.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
  month: (0, import_pg_core.integer)("month").notNull(),
  // 1-12
  year: (0, import_pg_core.integer)("year").notNull(),
  rankings: (0, import_pg_core.jsonb)("rankings").notNull(),
  // Array of player rankings with stats
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var mixAvailability = (0, import_pg_core.pgTable)("mix_availability", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  listDate: (0, import_pg_core.varchar)("list_date").notNull(),
  // YYYY-MM-DD format
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  position: (0, import_pg_core.integer)("position").notNull(),
  // 1-10 main, 11+ substitutes
  isSub: (0, import_pg_core.boolean)("is_sub").default(false).notNull(),
  joinedAt: (0, import_pg_core.timestamp)("joined_at").defaultNow().notNull()
});
var mixAvailabilityRelations = (0, import_drizzle_orm.relations)(mixAvailability, ({ one }) => ({
  user: one(users, {
    fields: [mixAvailability.userId],
    references: [users.id]
  })
}));
var insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateUserStatsSchema = import_zod.z.object({
  nickname: import_zod.z.string().optional(),
  steamId64: import_zod.z.string().optional(),
  totalKills: import_zod.z.number().int().min(0).optional(),
  totalDeaths: import_zod.z.number().int().min(0).optional(),
  totalAssists: import_zod.z.number().int().min(0).optional(),
  totalHeadshots: import_zod.z.number().int().min(0).optional(),
  totalDamage: import_zod.z.number().int().min(0).optional(),
  totalMatches: import_zod.z.number().int().min(0).optional(),
  matchesWon: import_zod.z.number().int().min(0).optional(),
  matchesLost: import_zod.z.number().int().min(0).optional(),
  totalRoundsPlayed: import_zod.z.number().int().min(0).optional(),
  roundsWon: import_zod.z.number().int().min(0).optional(),
  totalMvps: import_zod.z.number().int().min(0).optional(),
  total1v1Count: import_zod.z.number().int().min(0).optional(),
  total1v1Wins: import_zod.z.number().int().min(0).optional(),
  total1v2Count: import_zod.z.number().int().min(0).optional(),
  total1v2Wins: import_zod.z.number().int().min(0).optional(),
  totalEntryCount: import_zod.z.number().int().min(0).optional(),
  totalEntryWins: import_zod.z.number().int().min(0).optional(),
  total5ks: import_zod.z.number().int().min(0).optional(),
  total4ks: import_zod.z.number().int().min(0).optional(),
  total3ks: import_zod.z.number().int().min(0).optional(),
  total2ks: import_zod.z.number().int().min(0).optional(),
  totalFlashCount: import_zod.z.number().int().min(0).optional(),
  totalFlashSuccesses: import_zod.z.number().int().min(0).optional(),
  totalEnemiesFlashed: import_zod.z.number().int().min(0).optional(),
  totalUtilityDamage: import_zod.z.number().int().min(0).optional(),
  totalShotsFired: import_zod.z.number().int().min(0).optional(),
  totalShotsOnTarget: import_zod.z.number().int().min(0).optional(),
  skillRating: import_zod.z.number().int().min(0).optional(),
  isAdmin: import_zod.z.boolean().optional()
});
var insertMatchSchema = (0, import_drizzle_zod.createInsertSchema)(matches).omit({
  id: true,
  createdAt: true
});
var insertMatchStatsSchema = (0, import_drizzle_zod.createInsertSchema)(matchStats).omit({
  id: true,
  createdAt: true
});
var insertPaymentSchema = (0, import_drizzle_zod.createInsertSchema)(payments).omit({
  id: true,
  createdAt: true
});
var insertReportSchema = (0, import_drizzle_zod.createInsertSchema)(reports).omit({
  id: true,
  createdAt: true,
  reviewedAt: true
});
var updateReportSchema = import_zod.z.object({
  status: import_zod.z.enum(["pending", "reviewing", "resolved", "dismissed"]).optional(),
  adminNotes: import_zod.z.string().max(1e3).optional(),
  reviewedBy: import_zod.z.string().optional(),
  reviewedAt: import_zod.z.date().optional()
});
var insertChampionshipRegistrationSchema = (0, import_drizzle_zod.createInsertSchema)(championshipRegistrations).omit({
  id: true,
  createdAt: true
});
var insertMonthlyRankingSchema = import_zod.z.object({
  month: import_zod.z.number().int().min(1).max(12),
  year: import_zod.z.number().int().min(2020).max(2100),
  rankings: import_zod.z.any()
});
var casinoBalances = (0, import_pg_core.pgTable)("casino_balances", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  balance: (0, import_pg_core.real)("balance").default(1e7).notNull(),
  // Start with R$10 million
  totalWon: (0, import_pg_core.real)("total_won").default(0).notNull(),
  totalLost: (0, import_pg_core.real)("total_lost").default(0).notNull(),
  totalBets: (0, import_pg_core.integer)("total_bets").default(0).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
});
var bets = (0, import_pg_core.pgTable)("bets", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetPlayerId: (0, import_pg_core.varchar)("target_player_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  matchId: (0, import_pg_core.varchar)("match_id").references(() => matches.id, { onDelete: "set null" }),
  amount: (0, import_pg_core.real)("amount").notNull(),
  // Amount wagered
  totalOdds: (0, import_pg_core.real)("total_odds").notNull(),
  // Combined odds
  potentialWin: (0, import_pg_core.real)("potential_win").notNull(),
  // amount * totalOdds
  status: (0, import_pg_core.varchar)("status").default("pending").notNull(),
  // pending, won, lost, cancelled
  result: (0, import_pg_core.varchar)("result"),
  // Details about result
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  resolvedAt: (0, import_pg_core.timestamp)("resolved_at")
});
var betItems = (0, import_pg_core.pgTable)("bet_items", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  betId: (0, import_pg_core.varchar)("bet_id").notNull().references(() => bets.id, { onDelete: "cascade" }),
  betType: (0, import_pg_core.varchar)("bet_type").notNull(),
  // kills_over, kills_under, kd_over, kd_under, win, headshots_over, etc.
  targetValue: (0, import_pg_core.real)("target_value").notNull(),
  // The value to compare against
  odds: (0, import_pg_core.real)("odds").notNull(),
  // Individual odds for this condition
  won: (0, import_pg_core.boolean)("won"),
  // null if pending, true/false after resolution
  actualValue: (0, import_pg_core.real)("actual_value")
  // Actual value achieved
});
var casinoTransactions = (0, import_pg_core.pgTable)("casino_transactions", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: (0, import_pg_core.varchar)("type").notNull(),
  // bet, case_opening, slot_win, slot_loss
  amount: (0, import_pg_core.real)("amount").notNull(),
  // Positive for wins, negative for losses
  description: (0, import_pg_core.varchar)("description"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var insertCasinoBalanceSchema = (0, import_drizzle_zod.createInsertSchema)(casinoBalances).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBetSchema = import_zod.z.object({
  targetPlayerId: import_zod.z.string(),
  amount: import_zod.z.number().min(10, "Aposta m\xEDnima \xE9 R$10"),
  items: import_zod.z.array(import_zod.z.object({
    betType: import_zod.z.string(),
    targetValue: import_zod.z.number()
  })).min(1, "Selecione pelo menos uma condi\xE7\xE3o")
});
var insertCasinoTransactionSchema = (0, import_drizzle_zod.createInsertSchema)(casinoTransactions).omit({
  id: true,
  createdAt: true
});
var insertMixAvailabilitySchema = (0, import_drizzle_zod.createInsertSchema)(mixAvailability).omit({
  id: true,
  joinedAt: true
});
var mixPenalties = (0, import_pg_core.pgTable)("mix_penalties", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listDate: (0, import_pg_core.varchar)("list_date").notNull(),
  type: (0, import_pg_core.varchar)("type").notNull().default("no_show"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var mixPenaltyRelations = (0, import_drizzle_orm.relations)(mixPenalties, ({ one }) => ({
  user: one(users, {
    fields: [mixPenalties.userId],
    references: [users.id]
  })
}));
var insertMixPenaltySchema = (0, import_drizzle_zod.createInsertSchema)(mixPenalties).omit({
  id: true,
  createdAt: true
});
var news = (0, import_pg_core.pgTable)("news", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  authorId: (0, import_pg_core.varchar)("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: (0, import_pg_core.varchar)("title").notNull(),
  content: (0, import_pg_core.text)("content").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var newsRelations = (0, import_drizzle_orm.relations)(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id]
  })
}));
var insertNewsSchema = (0, import_drizzle_zod.createInsertSchema)(news).omit({
  id: true,
  createdAt: true
});
var trophies = (0, import_pg_core.pgTable)("trophies", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: (0, import_pg_core.varchar)("type").notNull(),
  month: (0, import_pg_core.integer)("month").notNull(),
  year: (0, import_pg_core.integer)("year").notNull(),
  title: (0, import_pg_core.varchar)("title").notNull(),
  description: (0, import_pg_core.varchar)("description").notNull(),
  value: (0, import_pg_core.varchar)("value"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var trophyRelations = (0, import_drizzle_orm.relations)(trophies, ({ one }) => ({
  user: one(users, {
    fields: [trophies.userId],
    references: [users.id]
  })
}));
var insertTrophySchema = (0, import_drizzle_zod.createInsertSchema)(trophies).omit({
  id: true,
  createdAt: true
});
var surveys = (0, import_pg_core.pgTable)("surveys", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  bestPlayTimes: (0, import_pg_core.text)("best_play_times").array(),
  // selected hours e.g. ["19:00","20:00"]
  faceitLevel: (0, import_pg_core.integer)("faceit_level"),
  // 1-10
  gcLevel: (0, import_pg_core.integer)("gc_level"),
  // 1-21
  valveLevel: (0, import_pg_core.varchar)("valve_level"),
  // text
  improvementSuggestions: (0, import_pg_core.text)("improvement_suggestions"),
  reasonNotPlaying: (0, import_pg_core.text)("reason_not_playing"),
  attractMorePlayers: (0, import_pg_core.text)("attract_more_players"),
  playMoreWays: (0, import_pg_core.text)("play_more_ways"),
  generalOpinions: (0, import_pg_core.text)("general_opinions"),
  levelUpInfluenced: (0, import_pg_core.varchar)("level_up_influenced"),
  // "yes" | "no"
  levelUpInfluencedComment: (0, import_pg_core.text)("level_up_influenced_comment"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var surveyRelations = (0, import_drizzle_orm.relations)(surveys, ({ one }) => ({
  user: one(users, { fields: [surveys.userId], references: [users.id] })
}));
var insertSurveySchema = (0, import_drizzle_zod.createInsertSchema)(surveys).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});
var copaTeams = (0, import_pg_core.pgTable)("copa_teams", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  teamName: (0, import_pg_core.varchar)("team_name", { length: 100 }).notNull(),
  leaderName: (0, import_pg_core.varchar)("leader_name", { length: 100 }).notNull(),
  leaderContact: (0, import_pg_core.varchar)("leader_contact", { length: 200 }).notNull(),
  // email or phone
  paymentProof: (0, import_pg_core.text)("payment_proof"),
  // base64 image or URL
  status: (0, import_pg_core.varchar)("status", { length: 20 }).default("pending").notNull(),
  // pending|confirmed|rejected
  adminNotes: (0, import_pg_core.text)("admin_notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var copaPlayers = (0, import_pg_core.pgTable)("copa_players", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  teamId: (0, import_pg_core.integer)("team_id").notNull().references(() => copaTeams.id, { onDelete: "cascade" }),
  playerName: (0, import_pg_core.varchar)("player_name", { length: 100 }).notNull(),
  steamProfile: (0, import_pg_core.varchar)("steam_profile", { length: 200 }).notNull(),
  age: (0, import_pg_core.integer)("age").notNull(),
  position: (0, import_pg_core.varchar)("position", { length: 50 }).notNull(),
  // AWPer/Rifler/IGL/Support/Entry/Lurker
  gcLevel: (0, import_pg_core.integer)("gc_level"),
  // 0 = sem conta, 1-21
  faceitLevel: (0, import_pg_core.integer)("faceit_level"),
  // 0 = sem conta, 1-10
  isLeader: (0, import_pg_core.boolean)("is_leader").default(false).notNull(),
  playerOrder: (0, import_pg_core.integer)("player_order").default(0).notNull()
});
var copaMatches = (0, import_pg_core.pgTable)("copa_matches", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  round: (0, import_pg_core.varchar)("round", { length: 50 }).notNull(),
  // "Fase de Grupos", "Oitavas", "Quartas", "Semi", "Final"
  roundNumber: (0, import_pg_core.integer)("round_number").notNull(),
  // 1, 2, 3...
  team1Id: (0, import_pg_core.integer)("team1_id").references(() => copaTeams.id),
  team2Id: (0, import_pg_core.integer)("team2_id").references(() => copaTeams.id),
  team1Score: (0, import_pg_core.integer)("team1_score"),
  team2Score: (0, import_pg_core.integer)("team2_score"),
  winnerId: (0, import_pg_core.integer)("winner_id").references(() => copaTeams.id),
  mapName: (0, import_pg_core.varchar)("map_name", { length: 50 }),
  scheduledAt: (0, import_pg_core.timestamp)("scheduled_at"),
  streamUrl: (0, import_pg_core.varchar)("stream_url", { length: 500 }),
  notes: (0, import_pg_core.text)("notes"),
  isFinished: (0, import_pg_core.boolean)("is_finished").default(false).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var copaMatchStats = (0, import_pg_core.pgTable)("copa_match_stats", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  matchId: (0, import_pg_core.integer)("match_id").notNull().references(() => copaMatches.id, { onDelete: "cascade" }),
  teamId: (0, import_pg_core.integer)("team_id").references(() => copaTeams.id),
  playerName: (0, import_pg_core.varchar)("player_name", { length: 100 }).notNull(),
  steamProfile: (0, import_pg_core.varchar)("steam_profile", { length: 200 }),
  kills: (0, import_pg_core.integer)("kills").default(0).notNull(),
  deaths: (0, import_pg_core.integer)("deaths").default(0).notNull(),
  assists: (0, import_pg_core.integer)("assists").default(0).notNull(),
  headshots: (0, import_pg_core.integer)("headshots").default(0).notNull(),
  damage: (0, import_pg_core.integer)("damage").default(0).notNull(),
  adr: (0, import_pg_core.real)("adr").default(0).notNull(),
  // average damage per round
  firstKills: (0, import_pg_core.integer)("first_kills").default(0).notNull(),
  flashAssists: (0, import_pg_core.integer)("flash_assists").default(0).notNull(),
  twoK: (0, import_pg_core.integer)("two_k").default(0).notNull(),
  threeK: (0, import_pg_core.integer)("three_k").default(0).notNull(),
  fourK: (0, import_pg_core.integer)("four_k").default(0).notNull(),
  fiveK: (0, import_pg_core.integer)("five_k").default(0).notNull(),
  clutch1v1Wins: (0, import_pg_core.integer)("clutch_1v1_wins").default(0).notNull(),
  clutch1v2Wins: (0, import_pg_core.integer)("clutch_1v2_wins").default(0).notNull(),
  rating: (0, import_pg_core.real)("rating").default(0)
  // custom rating
});
var copaTeamRelations = (0, import_drizzle_orm.relations)(copaTeams, ({ many }) => ({
  players: many(copaPlayers)
}));
var copaPlayerRelations = (0, import_drizzle_orm.relations)(copaPlayers, ({ one }) => ({
  team: one(copaTeams, { fields: [copaPlayers.teamId], references: [copaTeams.id] })
}));
var copaMatchRelations = (0, import_drizzle_orm.relations)(copaMatches, ({ one, many }) => ({
  team1: one(copaTeams, { fields: [copaMatches.team1Id], references: [copaTeams.id], relationName: "team1" }),
  team2: one(copaTeams, { fields: [copaMatches.team2Id], references: [copaTeams.id], relationName: "team2" }),
  winner: one(copaTeams, { fields: [copaMatches.winnerId], references: [copaTeams.id], relationName: "winner" }),
  stats: many(copaMatchStats)
}));
var copaMatchStatsRelations = (0, import_drizzle_orm.relations)(copaMatchStats, ({ one }) => ({
  match: one(copaMatches, { fields: [copaMatchStats.matchId], references: [copaMatches.id] }),
  team: one(copaTeams, { fields: [copaMatchStats.teamId], references: [copaTeams.id] })
}));
var fantasyRounds = (0, import_pg_core.pgTable)("fantasy_rounds", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  name: (0, import_pg_core.varchar)("name", { length: 100 }).notNull(),
  status: (0, import_pg_core.varchar)("status", { length: 20 }).default("open").notNull(),
  // open | calculating | finished
  startDate: (0, import_pg_core.timestamp)("start_date").notNull(),
  endDate: (0, import_pg_core.timestamp)("end_date").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var fantasyTeams = (0, import_pg_core.pgTable)("fantasy_teams", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roundId: (0, import_pg_core.integer)("round_id").notNull().references(() => fantasyRounds.id, { onDelete: "cascade" }),
  totalPoints: (0, import_pg_core.real)("total_points").default(0).notNull(),
  budgetUsed: (0, import_pg_core.integer)("budget_used").default(0).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var fantasyPicks = (0, import_pg_core.pgTable)("fantasy_picks", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  teamId: (0, import_pg_core.integer)("team_id").notNull().references(() => fantasyTeams.id, { onDelete: "cascade" }),
  pickedUserId: (0, import_pg_core.varchar)("picked_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  points: (0, import_pg_core.real)("points").default(0).notNull(),
  price: (0, import_pg_core.integer)("price").default(0).notNull()
});
var FANTASY_BUDGET = 100;
var insertFantasyRoundSchema = (0, import_drizzle_zod.createInsertSchema)(fantasyRounds).omit({ id: true, createdAt: true });
var insertFantasyTeamSchema = (0, import_drizzle_zod.createInsertSchema)(fantasyTeams).omit({ id: true, createdAt: true, totalPoints: true });
var insertFantasyPickSchema = (0, import_drizzle_zod.createInsertSchema)(fantasyPicks).omit({ id: true, points: true });
var pushSubscriptions = (0, import_pg_core.pgTable)("push_subscriptions", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: (0, import_pg_core.text)("endpoint").notNull().unique(),
  p256dh: (0, import_pg_core.text)("p256dh").notNull(),
  auth: (0, import_pg_core.text)("auth").notNull(),
  userAgent: (0, import_pg_core.text)("user_agent"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var insertPushSubscriptionSchema = (0, import_drizzle_zod.createInsertSchema)(pushSubscriptions).omit({ id: true, createdAt: true });
var appSettings = (0, import_pg_core.pgTable)("app_settings", {
  key: (0, import_pg_core.varchar)("key").primaryKey(),
  value: (0, import_pg_core.text)("value").notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var raffles = (0, import_pg_core.pgTable)("raffles", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  title: (0, import_pg_core.varchar)("title").notNull(),
  month: (0, import_pg_core.integer)("month").notNull(),
  year: (0, import_pg_core.integer)("year").notNull(),
  minMatches: (0, import_pg_core.integer)("min_matches").notNull(),
  eligibleSnapshot: (0, import_pg_core.jsonb)("eligible_snapshot").notNull(),
  winnerUserId: (0, import_pg_core.varchar)("winner_user_id").references(() => users.id, { onDelete: "set null" }),
  winnerNickname: (0, import_pg_core.varchar)("winner_nickname"),
  seed: (0, import_pg_core.varchar)("seed").notNull(),
  randomValue: (0, import_pg_core.varchar)("random_value").notNull(),
  winnerIndex: (0, import_pg_core.integer)("winner_index").notNull(),
  notifiedAt: (0, import_pg_core.timestamp)("notified_at"),
  winnerSeenAt: (0, import_pg_core.timestamp)("winner_seen_at"),
  createdById: (0, import_pg_core.varchar)("created_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var tournament2x2Teams = (0, import_pg_core.pgTable)("tournament_2x2_teams", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  teamName: (0, import_pg_core.varchar)("team_name", { length: 100 }).notNull(),
  player1Name: (0, import_pg_core.varchar)("player1_name", { length: 100 }).notNull(),
  player1SteamId: (0, import_pg_core.varchar)("player1_steam_id", { length: 200 }).notNull(),
  player1Discord: (0, import_pg_core.varchar)("player1_discord", { length: 100 }),
  player2Name: (0, import_pg_core.varchar)("player2_name", { length: 100 }).notNull(),
  player2SteamId: (0, import_pg_core.varchar)("player2_steam_id", { length: 200 }).notNull(),
  player2Discord: (0, import_pg_core.varchar)("player2_discord", { length: 100 }),
  contactPhone: (0, import_pg_core.varchar)("contact_phone", { length: 50 }).notNull(),
  paymentMethod: (0, import_pg_core.varchar)("payment_method", { length: 50 }).notNull(),
  paymentProof: (0, import_pg_core.text)("payment_proof"),
  notes: (0, import_pg_core.text)("notes"),
  isConfirmed: (0, import_pg_core.boolean)("is_confirmed").default(false).notNull(),
  seed: (0, import_pg_core.integer)("seed"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var tournament2x2Matches = (0, import_pg_core.pgTable)("tournament_2x2_matches", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  round: (0, import_pg_core.integer)("round").notNull(),
  position: (0, import_pg_core.integer)("position").notNull(),
  team1Id: (0, import_pg_core.integer)("team1_id").references(() => tournament2x2Teams.id, { onDelete: "set null" }),
  team2Id: (0, import_pg_core.integer)("team2_id").references(() => tournament2x2Teams.id, { onDelete: "set null" }),
  score1: (0, import_pg_core.integer)("score1"),
  score2: (0, import_pg_core.integer)("score2"),
  winnerId: (0, import_pg_core.integer)("winner_id").references(() => tournament2x2Teams.id, { onDelete: "set null" }),
  scheduledAt: (0, import_pg_core.timestamp)("scheduled_at")
});
var insertTournament2x2TeamSchema = (0, import_drizzle_zod.createInsertSchema)(tournament2x2Teams).omit({
  id: true,
  isConfirmed: true,
  seed: true,
  createdAt: true,
  updatedAt: true
});
var updateTournament2x2TeamSchema = (0, import_drizzle_zod.createInsertSchema)(tournament2x2Teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).partial();
var insertTournament2x2MatchSchema = (0, import_drizzle_zod.createInsertSchema)(tournament2x2Matches).omit({ id: true });

// server/db.ts
var connectionString = process.env.DATABASE_URL || "postgresql://postgres:aliados123%40@db.akvybywdkwyajuvifpic.supabase.co:5432/postgres";
var _client = null;
var _db = null;
function getDb() {
  if (!_db) {
    _client = (0, import_postgres.default)(connectionString, { prepare: false, ssl: "require" });
    _db = (0, import_postgres_js.drizzle)(_client, { schema: schema_exports });
  }
  return _db;
}
var db = new Proxy({}, {
  get(_target, prop) {
    return getDb()[prop];
  }
});

// api/auth/callback.ts
var import_drizzle_orm2 = require("drizzle-orm");
var SECRET = process.env.SESSION_SECRET || "aliados_secret_key_2026_steam_auth";
var COOKIE_NAME = "aliados_session";
function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = (0, import_crypto.createHmac)("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}
async function verifySteamOpenId(query) {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(query)) {
    if (key.startsWith("openid.")) {
      params.set(key, val);
    }
  }
  params.set("openid.mode", "check_authentication");
  try {
    const response = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    const text2 = await response.text();
    if (text2.includes("is_valid:true")) {
      const claimedId = query["openid.claimed_id"] || "";
      const match = claimedId.match(/(?:id\/|id=)(\d+)/);
      return match ? match[1] : null;
    }
  } catch (err) {
    console.error("[SteamAuth] Verification error:", err);
  }
  return null;
}
async function fetchSteamProfile(steamId64) {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) return null;
  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId64}`;
    const response = await fetch(url);
    const data = await response.json();
    const player = data?.response?.players?.[0];
    if (!player) return null;
    return {
      nickname: player.personaname || `Player_${steamId64.slice(-6)}`,
      avatar: player.avatarfull || player.avatarmedium || player.avatar || null
    };
  } catch {
    return null;
  }
}
async function handler(req, res) {
  try {
    const query = req.query || {};
    const steamId64 = await verifySteamOpenId(query);
    if (!steamId64) {
      return res.redirect("/?auth_error=steam_failed");
    }
    const steamAccountId = `steam_${steamId64}`;
    const profile = await fetchSteamProfile(steamId64);
    const nickname = profile?.nickname || `Jogador_${steamId64.slice(-6)}`;
    const avatar = profile?.avatar || null;
    const now = /* @__PURE__ */ new Date();
    const existing = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.steamId64, steamId64));
    let userId = steamAccountId;
    if (existing.length > 0) {
      userId = existing[0].id;
      await db.update(users).set({
        firstName: nickname,
        profileImageUrl: avatar || existing[0].profileImageUrl,
        lastLoginAt: now,
        updatedAt: now
      }).where((0, import_drizzle_orm2.eq)(users.id, userId));
    } else {
      const allUsers = await db.select({ id: users.id }).from(users).limit(1);
      const isFirst = allUsers.length === 0;
      await db.insert(users).values({
        id: steamAccountId,
        email: null,
        firstName: nickname,
        lastName: null,
        profileImageUrl: avatar,
        steamId64,
        isAdmin: isFirst,
        lastLoginAt: now,
        updatedAt: now
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: nickname,
          profileImageUrl: avatar,
          lastLoginAt: now,
          updatedAt: now
        }
      });
    }
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1e3;
    const token = signToken({ userId, steamId64, expiresAt });
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure`);
    res.redirect("/");
  } catch (err) {
    console.error("[SteamAuth Callback Error]:", err);
    res.redirect("/?auth_error=callback_error");
  }
}
