"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
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
var import_drizzle_orm, import_pg_core, import_drizzle_zod, import_zod, sessions, users, matches, matchStats, usersRelations, matchesRelations, matchStatsRelations, payments, paymentsRelations, reports, reportsRelations, championshipRegistrations, championshipRegistrationsRelations, monthlyRankings, mixAvailability, mixAvailabilityRelations, insertUserSchema, updateUserStatsSchema, insertMatchSchema, insertMatchStatsSchema, insertPaymentSchema, insertReportSchema, updateReportSchema, insertChampionshipRegistrationSchema, insertMonthlyRankingSchema, casinoBalances, bets, betItems, casinoTransactions, insertCasinoBalanceSchema, insertBetSchema, insertCasinoTransactionSchema, insertMixAvailabilitySchema, mixPenalties, mixPenaltyRelations, insertMixPenaltySchema, news, newsRelations, insertNewsSchema, trophies, trophyRelations, insertTrophySchema, surveys, surveyRelations, insertSurveySchema, copaTeams, copaPlayers, copaMatches, copaMatchStats, copaTeamRelations, copaPlayerRelations, copaMatchRelations, copaMatchStatsRelations, fantasyRounds, fantasyTeams, fantasyPicks, FANTASY_BUDGET, insertFantasyRoundSchema, insertFantasyTeamSchema, insertFantasyPickSchema, pushSubscriptions, insertPushSubscriptionSchema, appSettings, raffles, tournament2x2Teams, tournament2x2Matches, insertTournament2x2TeamSchema, updateTournament2x2TeamSchema, insertTournament2x2MatchSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_drizzle_orm = require("drizzle-orm");
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    import_zod = require("zod");
    sessions = (0, import_pg_core.pgTable)(
      "sessions",
      {
        sid: (0, import_pg_core.varchar)("sid").primaryKey(),
        sess: (0, import_pg_core.jsonb)("sess").notNull(),
        expire: (0, import_pg_core.timestamp)("expire").notNull()
      },
      (table) => [(0, import_pg_core.index)("IDX_session_expire").on(table.expire)]
    );
    users = (0, import_pg_core.pgTable)("users", {
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
    matches = (0, import_pg_core.pgTable)("matches", {
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
    matchStats = (0, import_pg_core.pgTable)("match_stats", {
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
    usersRelations = (0, import_drizzle_orm.relations)(users, ({ many }) => ({
      matchStats: many(matchStats)
    }));
    matchesRelations = (0, import_drizzle_orm.relations)(matches, ({ many }) => ({
      stats: many(matchStats)
    }));
    matchStatsRelations = (0, import_drizzle_orm.relations)(matchStats, ({ one }) => ({
      match: one(matches, {
        fields: [matchStats.matchId],
        references: [matches.id]
      }),
      user: one(users, {
        fields: [matchStats.userId],
        references: [users.id]
      })
    }));
    payments = (0, import_pg_core.pgTable)("payments", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      amount: (0, import_pg_core.real)("amount").notNull(),
      description: (0, import_pg_core.varchar)("description"),
      paymentDate: (0, import_pg_core.timestamp)("payment_date").defaultNow().notNull(),
      createdBy: (0, import_pg_core.varchar)("created_by").references(() => users.id),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    paymentsRelations = (0, import_drizzle_orm.relations)(payments, ({ one }) => ({
      user: one(users, {
        fields: [payments.userId],
        references: [users.id]
      }),
      creator: one(users, {
        fields: [payments.createdBy],
        references: [users.id]
      })
    }));
    reports = (0, import_pg_core.pgTable)("reports", {
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
    reportsRelations = (0, import_drizzle_orm.relations)(reports, ({ one }) => ({
      user: one(users, {
        fields: [reports.userId],
        references: [users.id]
      }),
      reviewer: one(users, {
        fields: [reports.reviewedBy],
        references: [users.id]
      })
    }));
    championshipRegistrations = (0, import_pg_core.pgTable)("championship_registrations", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      status: (0, import_pg_core.varchar)("status").default("interested").notNull(),
      notes: (0, import_pg_core.varchar)("notes", { length: 500 }),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    championshipRegistrationsRelations = (0, import_drizzle_orm.relations)(championshipRegistrations, ({ one }) => ({
      user: one(users, {
        fields: [championshipRegistrations.userId],
        references: [users.id]
      })
    }));
    monthlyRankings = (0, import_pg_core.pgTable)("monthly_rankings", {
      id: (0, import_pg_core.integer)("id").primaryKey().generatedAlwaysAsIdentity(),
      month: (0, import_pg_core.integer)("month").notNull(),
      // 1-12
      year: (0, import_pg_core.integer)("year").notNull(),
      rankings: (0, import_pg_core.jsonb)("rankings").notNull(),
      // Array of player rankings with stats
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    mixAvailability = (0, import_pg_core.pgTable)("mix_availability", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      listDate: (0, import_pg_core.varchar)("list_date").notNull(),
      // YYYY-MM-DD format
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      position: (0, import_pg_core.integer)("position").notNull(),
      // 1-10 main, 11+ substitutes
      isSub: (0, import_pg_core.boolean)("is_sub").default(false).notNull(),
      joinedAt: (0, import_pg_core.timestamp)("joined_at").defaultNow().notNull()
    });
    mixAvailabilityRelations = (0, import_drizzle_orm.relations)(mixAvailability, ({ one }) => ({
      user: one(users, {
        fields: [mixAvailability.userId],
        references: [users.id]
      })
    }));
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    updateUserStatsSchema = import_zod.z.object({
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
    insertMatchSchema = (0, import_drizzle_zod.createInsertSchema)(matches).omit({
      id: true,
      createdAt: true
    });
    insertMatchStatsSchema = (0, import_drizzle_zod.createInsertSchema)(matchStats).omit({
      id: true,
      createdAt: true
    });
    insertPaymentSchema = (0, import_drizzle_zod.createInsertSchema)(payments).omit({
      id: true,
      createdAt: true
    });
    insertReportSchema = (0, import_drizzle_zod.createInsertSchema)(reports).omit({
      id: true,
      createdAt: true,
      reviewedAt: true
    });
    updateReportSchema = import_zod.z.object({
      status: import_zod.z.enum(["pending", "reviewing", "resolved", "dismissed"]).optional(),
      adminNotes: import_zod.z.string().max(1e3).optional(),
      reviewedBy: import_zod.z.string().optional(),
      reviewedAt: import_zod.z.date().optional()
    });
    insertChampionshipRegistrationSchema = (0, import_drizzle_zod.createInsertSchema)(championshipRegistrations).omit({
      id: true,
      createdAt: true
    });
    insertMonthlyRankingSchema = import_zod.z.object({
      month: import_zod.z.number().int().min(1).max(12),
      year: import_zod.z.number().int().min(2020).max(2100),
      rankings: import_zod.z.any()
    });
    casinoBalances = (0, import_pg_core.pgTable)("casino_balances", {
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
    bets = (0, import_pg_core.pgTable)("bets", {
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
    betItems = (0, import_pg_core.pgTable)("bet_items", {
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
    casinoTransactions = (0, import_pg_core.pgTable)("casino_transactions", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      type: (0, import_pg_core.varchar)("type").notNull(),
      // bet, case_opening, slot_win, slot_loss
      amount: (0, import_pg_core.real)("amount").notNull(),
      // Positive for wins, negative for losses
      description: (0, import_pg_core.varchar)("description"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    insertCasinoBalanceSchema = (0, import_drizzle_zod.createInsertSchema)(casinoBalances).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertBetSchema = import_zod.z.object({
      targetPlayerId: import_zod.z.string(),
      amount: import_zod.z.number().min(10, "Aposta m\xEDnima \xE9 R$10"),
      items: import_zod.z.array(import_zod.z.object({
        betType: import_zod.z.string(),
        targetValue: import_zod.z.number()
      })).min(1, "Selecione pelo menos uma condi\xE7\xE3o")
    });
    insertCasinoTransactionSchema = (0, import_drizzle_zod.createInsertSchema)(casinoTransactions).omit({
      id: true,
      createdAt: true
    });
    insertMixAvailabilitySchema = (0, import_drizzle_zod.createInsertSchema)(mixAvailability).omit({
      id: true,
      joinedAt: true
    });
    mixPenalties = (0, import_pg_core.pgTable)("mix_penalties", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      listDate: (0, import_pg_core.varchar)("list_date").notNull(),
      type: (0, import_pg_core.varchar)("type").notNull().default("no_show"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    mixPenaltyRelations = (0, import_drizzle_orm.relations)(mixPenalties, ({ one }) => ({
      user: one(users, {
        fields: [mixPenalties.userId],
        references: [users.id]
      })
    }));
    insertMixPenaltySchema = (0, import_drizzle_zod.createInsertSchema)(mixPenalties).omit({
      id: true,
      createdAt: true
    });
    news = (0, import_pg_core.pgTable)("news", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      authorId: (0, import_pg_core.varchar)("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      title: (0, import_pg_core.varchar)("title").notNull(),
      content: (0, import_pg_core.text)("content").notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    newsRelations = (0, import_drizzle_orm.relations)(news, ({ one }) => ({
      author: one(users, {
        fields: [news.authorId],
        references: [users.id]
      })
    }));
    insertNewsSchema = (0, import_drizzle_zod.createInsertSchema)(news).omit({
      id: true,
      createdAt: true
    });
    trophies = (0, import_pg_core.pgTable)("trophies", {
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
    trophyRelations = (0, import_drizzle_orm.relations)(trophies, ({ one }) => ({
      user: one(users, {
        fields: [trophies.userId],
        references: [users.id]
      })
    }));
    insertTrophySchema = (0, import_drizzle_zod.createInsertSchema)(trophies).omit({
      id: true,
      createdAt: true
    });
    surveys = (0, import_pg_core.pgTable)("surveys", {
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
    surveyRelations = (0, import_drizzle_orm.relations)(surveys, ({ one }) => ({
      user: one(users, { fields: [surveys.userId], references: [users.id] })
    }));
    insertSurveySchema = (0, import_drizzle_zod.createInsertSchema)(surveys).omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    });
    copaTeams = (0, import_pg_core.pgTable)("copa_teams", {
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
    copaPlayers = (0, import_pg_core.pgTable)("copa_players", {
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
    copaMatches = (0, import_pg_core.pgTable)("copa_matches", {
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
    copaMatchStats = (0, import_pg_core.pgTable)("copa_match_stats", {
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
    copaTeamRelations = (0, import_drizzle_orm.relations)(copaTeams, ({ many }) => ({
      players: many(copaPlayers)
    }));
    copaPlayerRelations = (0, import_drizzle_orm.relations)(copaPlayers, ({ one }) => ({
      team: one(copaTeams, { fields: [copaPlayers.teamId], references: [copaTeams.id] })
    }));
    copaMatchRelations = (0, import_drizzle_orm.relations)(copaMatches, ({ one, many }) => ({
      team1: one(copaTeams, { fields: [copaMatches.team1Id], references: [copaTeams.id], relationName: "team1" }),
      team2: one(copaTeams, { fields: [copaMatches.team2Id], references: [copaTeams.id], relationName: "team2" }),
      winner: one(copaTeams, { fields: [copaMatches.winnerId], references: [copaTeams.id], relationName: "winner" }),
      stats: many(copaMatchStats)
    }));
    copaMatchStatsRelations = (0, import_drizzle_orm.relations)(copaMatchStats, ({ one }) => ({
      match: one(copaMatches, { fields: [copaMatchStats.matchId], references: [copaMatches.id] }),
      team: one(copaTeams, { fields: [copaMatchStats.teamId], references: [copaTeams.id] })
    }));
    fantasyRounds = (0, import_pg_core.pgTable)("fantasy_rounds", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      name: (0, import_pg_core.varchar)("name", { length: 100 }).notNull(),
      status: (0, import_pg_core.varchar)("status", { length: 20 }).default("open").notNull(),
      // open | calculating | finished
      startDate: (0, import_pg_core.timestamp)("start_date").notNull(),
      endDate: (0, import_pg_core.timestamp)("end_date").notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    fantasyTeams = (0, import_pg_core.pgTable)("fantasy_teams", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      roundId: (0, import_pg_core.integer)("round_id").notNull().references(() => fantasyRounds.id, { onDelete: "cascade" }),
      totalPoints: (0, import_pg_core.real)("total_points").default(0).notNull(),
      budgetUsed: (0, import_pg_core.integer)("budget_used").default(0).notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    fantasyPicks = (0, import_pg_core.pgTable)("fantasy_picks", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      teamId: (0, import_pg_core.integer)("team_id").notNull().references(() => fantasyTeams.id, { onDelete: "cascade" }),
      pickedUserId: (0, import_pg_core.varchar)("picked_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      points: (0, import_pg_core.real)("points").default(0).notNull(),
      price: (0, import_pg_core.integer)("price").default(0).notNull()
    });
    FANTASY_BUDGET = 100;
    insertFantasyRoundSchema = (0, import_drizzle_zod.createInsertSchema)(fantasyRounds).omit({ id: true, createdAt: true });
    insertFantasyTeamSchema = (0, import_drizzle_zod.createInsertSchema)(fantasyTeams).omit({ id: true, createdAt: true, totalPoints: true });
    insertFantasyPickSchema = (0, import_drizzle_zod.createInsertSchema)(fantasyPicks).omit({ id: true, points: true });
    pushSubscriptions = (0, import_pg_core.pgTable)("push_subscriptions", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      userId: (0, import_pg_core.varchar)("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      endpoint: (0, import_pg_core.text)("endpoint").notNull().unique(),
      p256dh: (0, import_pg_core.text)("p256dh").notNull(),
      auth: (0, import_pg_core.text)("auth").notNull(),
      userAgent: (0, import_pg_core.text)("user_agent"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    insertPushSubscriptionSchema = (0, import_drizzle_zod.createInsertSchema)(pushSubscriptions).omit({ id: true, createdAt: true });
    appSettings = (0, import_pg_core.pgTable)("app_settings", {
      key: (0, import_pg_core.varchar)("key").primaryKey(),
      value: (0, import_pg_core.text)("value").notNull(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
    });
    raffles = (0, import_pg_core.pgTable)("raffles", {
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
    tournament2x2Teams = (0, import_pg_core.pgTable)("tournament_2x2_teams", {
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
    tournament2x2Matches = (0, import_pg_core.pgTable)("tournament_2x2_matches", {
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
    insertTournament2x2TeamSchema = (0, import_drizzle_zod.createInsertSchema)(tournament2x2Teams).omit({
      id: true,
      isConfirmed: true,
      seed: true,
      createdAt: true,
      updatedAt: true
    });
    updateTournament2x2TeamSchema = (0, import_drizzle_zod.createInsertSchema)(tournament2x2Teams).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }).partial();
    insertTournament2x2MatchSchema = (0, import_drizzle_zod.createInsertSchema)(tournament2x2Matches).omit({ id: true });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
var import_pg, import_node_postgres, Pool, connectionString, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_pg = __toESM(require("pg"), 1);
    import_node_postgres = require("drizzle-orm/node-postgres");
    init_schema();
    ({ Pool } = import_pg.default);
    connectionString = process.env.DATABASE_URL || "postgresql://postgres:aliados123%40@db.akvybywdkwyajuvifpic.supabase.co:5432/postgres";
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("supabase") || true ? { rejectUnauthorized: false } : void 0,
      max: 5,
      idleTimeoutMillis: 3e3,
      connectionTimeoutMillis: 5e3
    });
    pool.on("error", (err) => {
      console.error("[PG Pool Error]:", err?.message || err);
    });
    db = (0, import_node_postgres.drizzle)({ client: pool, schema: schema_exports });
  }
});

// server/vercel.ts
var vercel_exports = {};
__export(vercel_exports, {
  default: () => vercel_default
});
module.exports = __toCommonJS(vercel_exports);
var import_express = __toESM(require("express"), 1);
var import_http = require("http");

// server/storage.ts
init_schema();
init_db();
var import_drizzle_orm2 = require("drizzle-orm");
var DatabaseStorage = class {
  // User operations (required for Replit Auth)
  async getUser(id) {
    try {
      const [user] = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.id, id));
      return user;
    } catch (err) {
      console.error("[Storage] getUser error:", err);
      return void 0;
    }
  }
  async upsertUser(userData) {
    const existingUsers = await db.select({ id: users.id }).from(users).limit(1);
    const isFirstUser = existingUsers.length === 0;
    const now = /* @__PURE__ */ new Date();
    const [user] = await db.insert(users).values({
      ...userData,
      isAdmin: isFirstUser ? true : userData.isAdmin ?? false,
      lastLoginAt: now
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        lastLoginAt: now,
        updatedAt: now
      }
    }).returning();
    return user;
  }
  // Extended user operations
  async getAllUsers(includeAll = false) {
    try {
      if (includeAll) {
        return await db.select().from(users);
      }
      return await db.select().from(users).where(
        (0, import_drizzle_orm2.and)((0, import_drizzle_orm2.eq)(users.isBanned, false), (0, import_drizzle_orm2.eq)(users.isCheaterBanned, false))
      );
    } catch (err) {
      console.error("[Storage] getAllUsers error:", err);
      return [];
    }
  }
  async banUser(id) {
    const [user] = await db.update(users).set({ isBanned: true, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(users.id, id)).returning();
    return user;
  }
  async unbanUser(id) {
    const [user] = await db.update(users).set({ isBanned: false, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.and)((0, import_drizzle_orm2.eq)(users.id, id), (0, import_drizzle_orm2.eq)(users.isCheaterBanned, false))).returning();
    return user;
  }
  async cheaterBanUser(id) {
    const [user] = await db.update(users).set({ isBanned: true, isCheaterBanned: true, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(users.id, id)).returning();
    return user;
  }
  async getUserBySteamId(steamId64) {
    try {
      const [user] = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.steamId64, steamId64));
      return user;
    } catch (err) {
      console.error("[Storage] getUserBySteamId error:", err);
      return void 0;
    }
  }
  async getUserByDiscordId(discordUserId) {
    try {
      const [user] = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.discordUserId, discordUserId));
      return user;
    } catch (err) {
      console.error("[Storage] getUserByDiscordId error:", err);
      return void 0;
    }
  }
  async createPlayerFromSteam(steamId64, playerName) {
    const existingUser = await this.getUserBySteamId(steamId64);
    if (existingUser) {
      const trimmedName = (playerName ?? "").trim();
      if (trimmedName && trimmedName !== existingUser.nickname) {
        const [updatedUser] = await db.update(users).set({
          nickname: trimmedName,
          firstName: existingUser.firstName || trimmedName,
          updatedAt: /* @__PURE__ */ new Date()
        }).where((0, import_drizzle_orm2.eq)(users.id, existingUser.id)).returning();
        return updatedUser;
      }
      return existingUser;
    }
    const [user] = await db.insert(users).values({
      id: `steam_${steamId64}`,
      steamId64,
      nickname: playerName,
      firstName: playerName
    }).returning();
    return user;
  }
  async updateUserStats(id, stats) {
    const [user] = await db.update(users).set({
      ...stats,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm2.eq)(users.id, id)).returning();
    return user;
  }
  async recalculateUserStats(userId) {
    const userMatchStatsWithMatch = await db.select({
      stats: matchStats,
      match: matches
    }).from(matchStats).innerJoin(matches, (0, import_drizzle_orm2.eq)(matchStats.matchId, matches.id)).where((0, import_drizzle_orm2.eq)(matchStats.userId, userId));
    if (userMatchStatsWithMatch.length === 0) {
      return await this.getUser(userId);
    }
    let totalRoundsPlayed = 0;
    let roundsWon = 0;
    let matchesWon = 0;
    let matchesLost = 0;
    const aggregated = userMatchStatsWithMatch.reduce((acc, { stats: stat, match }) => {
      const matchRounds = (match.team1Score || 0) + (match.team2Score || 0);
      totalRoundsPlayed += matchRounds;
      const playerTeam = stat.team;
      const team1Name = match.team1Name;
      const isTeam1 = playerTeam === team1Name;
      if (isTeam1) {
        roundsWon += match.team1Score || 0;
      } else {
        roundsWon += match.team2Score || 0;
      }
      if (match.winnerTeam) {
        if (match.winnerTeam === playerTeam) {
          matchesWon++;
        } else {
          matchesLost++;
        }
      } else {
        const team1Score = match.team1Score || 0;
        const team2Score = match.team2Score || 0;
        if (team1Score !== team2Score) {
          if (isTeam1 && team1Score > team2Score) {
            matchesWon++;
          } else if (!isTeam1 && team2Score > team1Score) {
            matchesWon++;
          } else {
            matchesLost++;
          }
        }
      }
      return {
        totalKills: acc.totalKills + stat.kills,
        totalDeaths: acc.totalDeaths + stat.deaths,
        totalAssists: acc.totalAssists + stat.assists,
        totalHeadshots: acc.totalHeadshots + stat.headshots,
        totalDamage: acc.totalDamage + stat.damage,
        totalMatches: acc.totalMatches + 1,
        totalMvps: acc.totalMvps + stat.mvps,
        total1v1Count: acc.total1v1Count + stat.v1Count,
        total1v1Wins: acc.total1v1Wins + stat.v1Wins,
        total1v2Count: acc.total1v2Count + stat.v2Count,
        total1v2Wins: acc.total1v2Wins + stat.v2Wins,
        totalEntryCount: acc.totalEntryCount + stat.entryCount,
        totalEntryWins: acc.totalEntryWins + stat.entryWins,
        total5ks: acc.total5ks + stat.enemy5ks,
        total4ks: acc.total4ks + stat.enemy4ks,
        total3ks: acc.total3ks + stat.enemy3ks,
        total2ks: acc.total2ks + stat.enemy2ks,
        totalFlashCount: acc.totalFlashCount + stat.flashCount,
        totalFlashSuccesses: acc.totalFlashSuccesses + stat.flashSuccesses,
        totalEnemiesFlashed: acc.totalEnemiesFlashed + stat.enemiesFlashed,
        totalUtilityDamage: acc.totalUtilityDamage + stat.utilityDamage,
        totalShotsFired: acc.totalShotsFired + stat.shotsFiredTotal,
        totalShotsOnTarget: acc.totalShotsOnTarget + stat.shotsOnTargetTotal
      };
    }, {
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalHeadshots: 0,
      totalDamage: 0,
      totalMatches: 0,
      totalMvps: 0,
      total1v1Count: 0,
      total1v1Wins: 0,
      total1v2Count: 0,
      total1v2Wins: 0,
      totalEntryCount: 0,
      totalEntryWins: 0,
      total5ks: 0,
      total4ks: 0,
      total3ks: 0,
      total2ks: 0,
      totalFlashCount: 0,
      totalFlashSuccesses: 0,
      totalEnemiesFlashed: 0,
      totalUtilityDamage: 0,
      totalShotsFired: 0,
      totalShotsOnTarget: 0
    });
    const kd = aggregated.totalDeaths > 0 ? aggregated.totalKills / aggregated.totalDeaths : aggregated.totalKills;
    const hsPercent = aggregated.totalKills > 0 ? aggregated.totalHeadshots / aggregated.totalKills * 100 : 0;
    const adr = totalRoundsPlayed > 0 ? aggregated.totalDamage / totalRoundsPlayed : 0;
    const winRate = aggregated.totalMatches > 0 ? matchesWon / aggregated.totalMatches * 100 : 50;
    const mvpRate = aggregated.totalMatches > 0 ? aggregated.totalMvps / aggregated.totalMatches * 100 : 0;
    const mvpBonus = (mvpRate - 10) * 5;
    const skillRating = Math.round(
      1e3 + (kd - 1) * 150 + (hsPercent - 30) * 2 + (adr - 70) * 1.5 + (winRate - 50) * 3 + mvpBonus + aggregated.totalMvps * 3 + aggregated.total5ks * 30 + aggregated.total4ks * 15 + aggregated.total3ks * 5
    );
    let levelPoints = 0;
    for (const { stats: stat, match } of userMatchStatsWithMatch) {
      const matchRounds = (match.team1Score || 0) + (match.team2Score || 0);
      const playerTeam = stat.team;
      const team1Name = match.team1Name;
      let wonMatch = false;
      if (match.winnerTeam) {
        wonMatch = match.winnerTeam === playerTeam;
      } else {
        const isTeam1 = playerTeam === team1Name;
        const t1 = match.team1Score || 0;
        const t2 = match.team2Score || 0;
        wonMatch = isTeam1 ? t1 > t2 : t2 > t1;
      }
      const kills = Number(stat.kills) || 0;
      const damage = Number(stat.damage) || 0;
      const entryWins = Number(stat.entryWins) || 0;
      const entryCount = Number(stat.entryCount) || 0;
      const utilityDmg = Number(stat.utilityDamage) || 0;
      const enemiesFlash = Number(stat.enemiesFlashed) || 0;
      const v1wins = Number(stat.v1Wins) || 0;
      const v2wins = Number(stat.v2Wins) || 0;
      const mvps = Number(stat.mvps) || 0;
      const enemy5ks = Number(stat.enemy5ks) || 0;
      const enemy4ks = Number(stat.enemy4ks) || 0;
      const rounds = matchRounds || 24;
      const kpr = kills / Math.max(rounds, 1);
      const adr2 = damage / Math.max(rounds, 1);
      const entrySuccess = entryCount > 0 ? entryWins / entryCount : 0;
      const utility = (utilityDmg + enemiesFlash * 7.5) / Math.max(rounds, 1);
      const ri = kpr * 0.35 + adr2 / 100 * 0.35 + entrySuccess * 0.15 + utility * 0.15;
      let lpMatch = 0;
      if (wonMatch) {
        if (ri > 1.3) lpMatch = 25;
        else if (ri >= 1) lpMatch = 18;
        else lpMatch = 10;
      } else {
        if (ri > 1.3) lpMatch = -2;
        else if (ri >= 1) lpMatch = -10;
        else lpMatch = -20;
      }
      lpMatch += v1wins * 2;
      lpMatch += v2wins * 3;
      lpMatch += mvps * 5;
      lpMatch += enemy5ks * 5;
      lpMatch += enemy4ks * 3;
      const clampedLP = Math.max(-20, Math.min(40, lpMatch));
      levelPoints = Math.max(0, Math.min(2100, levelPoints + clampedLP));
    }
    const [user] = await db.update(users).set({
      ...aggregated,
      totalRoundsPlayed,
      roundsWon,
      matchesWon,
      matchesLost,
      skillRating: Math.max(100, Math.min(3e3, skillRating)),
      levelPoints,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm2.eq)(users.id, userId)).returning();
    return user;
  }
  async deleteUser(id) {
    const result = await db.delete(users).where((0, import_drizzle_orm2.eq)(users.id, id)).returning();
    return result.length > 0;
  }
  // Match operations
  async getMatch(id) {
    const [match] = await db.select().from(matches).where((0, import_drizzle_orm2.eq)(matches.id, id));
    return match;
  }
  async getMatchByExternalId(externalMatchId, mapNumber) {
    const [match] = await db.select().from(matches).where(import_drizzle_orm2.sql`${matches.externalMatchId} = ${externalMatchId} AND ${matches.mapNumber} = ${mapNumber}`);
    return match;
  }
  async getAllMatches() {
    return await db.select().from(matches);
  }
  async createMatch(match) {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }
  // Match stats operations
  async getMatchStats(matchId) {
    return await db.select().from(matchStats).where((0, import_drizzle_orm2.eq)(matchStats.matchId, matchId));
  }
  async getUserMatchStats(userId) {
    return await db.select().from(matchStats).where((0, import_drizzle_orm2.eq)(matchStats.userId, userId));
  }
  async getUserMatchStatsWithMatches(userId) {
    return await db.select({
      stats: matchStats,
      match: matches
    }).from(matchStats).innerJoin(matches, (0, import_drizzle_orm2.eq)(matchStats.matchId, matches.id)).where((0, import_drizzle_orm2.eq)(matchStats.userId, userId)).orderBy(import_drizzle_orm2.sql`${matches.date} DESC`);
  }
  async createMatchStats(stats) {
    const [newStats] = await db.insert(matchStats).values(stats).returning();
    return newStats;
  }
  async updateMatchStatsMvp(id, mvpValue) {
    const [updated] = await db.update(matchStats).set({ mvps: mvpValue }).where((0, import_drizzle_orm2.eq)(matchStats.id, id)).returning();
    return updated;
  }
  // Payment operations
  async getAllPayments() {
    return await db.select().from(payments);
  }
  async getPaymentsByUser(userId) {
    return await db.select().from(payments).where((0, import_drizzle_orm2.eq)(payments.userId, userId));
  }
  async createPayment(payment) {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }
  async deletePayment(id) {
    const result = await db.delete(payments).where((0, import_drizzle_orm2.eq)(payments.id, id)).returning();
    return result.length > 0;
  }
  // Report operations
  async getAllReports() {
    return await db.select().from(reports).orderBy((0, import_drizzle_orm2.desc)(reports.createdAt));
  }
  async getReport(id) {
    const [report] = await db.select().from(reports).where((0, import_drizzle_orm2.eq)(reports.id, id));
    return report;
  }
  async createReport(report) {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }
  async updateReport(id, data) {
    const [updatedReport] = await db.update(reports).set({
      ...data,
      reviewedAt: data.status && data.status !== "pending" ? /* @__PURE__ */ new Date() : void 0
    }).where((0, import_drizzle_orm2.eq)(reports.id, id)).returning();
    return updatedReport;
  }
  async deleteReport(id) {
    const result = await db.delete(reports).where((0, import_drizzle_orm2.eq)(reports.id, id)).returning();
    return result.length > 0;
  }
  // Merge users: transfer all data from source to target and delete source
  async mergeUsers(sourceId, targetId) {
    const sourceUser = await this.getUser(sourceId);
    const targetUser = await this.getUser(targetId);
    if (!sourceUser || !targetUser) {
      return void 0;
    }
    await db.update(matchStats).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(matchStats.userId, sourceId));
    await db.update(payments).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(payments.userId, sourceId));
    const [sourceCasino] = await db.select().from(casinoBalances).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, sourceId));
    const [targetCasino] = await db.select().from(casinoBalances).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, targetId));
    if (sourceCasino) {
      if (targetCasino) {
        await db.update(casinoBalances).set({
          balance: (targetCasino.balance || 0) + (sourceCasino.balance || 0),
          totalWon: (targetCasino.totalWon || 0) + (sourceCasino.totalWon || 0),
          totalLost: (targetCasino.totalLost || 0) + (sourceCasino.totalLost || 0),
          totalBets: (targetCasino.totalBets || 0) + (sourceCasino.totalBets || 0),
          updatedAt: /* @__PURE__ */ new Date()
        }).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, targetId));
        await db.delete(casinoBalances).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, sourceId));
      } else {
        await db.update(casinoBalances).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, sourceId));
      }
    }
    await db.update(bets).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(bets.userId, sourceId));
    await db.update(bets).set({ targetPlayerId: targetId }).where((0, import_drizzle_orm2.eq)(bets.targetPlayerId, sourceId));
    await db.update(casinoTransactions).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(casinoTransactions.userId, sourceId));
    await db.update(mixAvailability).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(mixAvailability.userId, sourceId));
    await db.update(mixPenalties).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(mixPenalties.userId, sourceId));
    await db.update(news).set({ authorId: targetId }).where((0, import_drizzle_orm2.eq)(news.authorId, sourceId));
    await db.update(trophies).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(trophies.userId, sourceId));
    await db.update(championshipRegistrations).set({ userId: targetId }).where((0, import_drizzle_orm2.eq)(championshipRegistrations.userId, sourceId));
    const totalKills = (targetUser.totalKills || 0) + (sourceUser.totalKills || 0);
    const totalDeaths = (targetUser.totalDeaths || 0) + (sourceUser.totalDeaths || 0);
    const totalAssists = (targetUser.totalAssists || 0) + (sourceUser.totalAssists || 0);
    const totalHeadshots = (targetUser.totalHeadshots || 0) + (sourceUser.totalHeadshots || 0);
    const totalDamage = (targetUser.totalDamage || 0) + (sourceUser.totalDamage || 0);
    const totalMatches = (targetUser.totalMatches || 0) + (sourceUser.totalMatches || 0);
    const matchesWon = (targetUser.matchesWon || 0) + (sourceUser.matchesWon || 0);
    const matchesLost = (targetUser.matchesLost || 0) + (sourceUser.matchesLost || 0);
    const totalRoundsPlayed = (targetUser.totalRoundsPlayed || 0) + (sourceUser.totalRoundsPlayed || 0);
    const roundsWon = (targetUser.roundsWon || 0) + (sourceUser.roundsWon || 0);
    const totalMvps = (targetUser.totalMvps || 0) + (sourceUser.totalMvps || 0);
    const total1v1Count = (targetUser.total1v1Count || 0) + (sourceUser.total1v1Count || 0);
    const total1v1Wins = (targetUser.total1v1Wins || 0) + (sourceUser.total1v1Wins || 0);
    const total1v2Count = (targetUser.total1v2Count || 0) + (sourceUser.total1v2Count || 0);
    const total1v2Wins = (targetUser.total1v2Wins || 0) + (sourceUser.total1v2Wins || 0);
    const totalEntryCount = (targetUser.totalEntryCount || 0) + (sourceUser.totalEntryCount || 0);
    const totalEntryWins = (targetUser.totalEntryWins || 0) + (sourceUser.totalEntryWins || 0);
    const total5ks = (targetUser.total5ks || 0) + (sourceUser.total5ks || 0);
    const total4ks = (targetUser.total4ks || 0) + (sourceUser.total4ks || 0);
    const total3ks = (targetUser.total3ks || 0) + (sourceUser.total3ks || 0);
    const total2ks = (targetUser.total2ks || 0) + (sourceUser.total2ks || 0);
    const totalFlashCount = (targetUser.totalFlashCount || 0) + (sourceUser.totalFlashCount || 0);
    const totalFlashSuccesses = (targetUser.totalFlashSuccesses || 0) + (sourceUser.totalFlashSuccesses || 0);
    const totalEnemiesFlashed = (targetUser.totalEnemiesFlashed || 0) + (sourceUser.totalEnemiesFlashed || 0);
    const totalUtilityDamage = (targetUser.totalUtilityDamage || 0) + (sourceUser.totalUtilityDamage || 0);
    const totalShotsFired = (targetUser.totalShotsFired || 0) + (sourceUser.totalShotsFired || 0);
    const totalShotsOnTarget = (targetUser.totalShotsOnTarget || 0) + (sourceUser.totalShotsOnTarget || 0);
    const srcM = sourceUser.totalMatches || 0;
    const tgtM = targetUser.totalMatches || 0;
    const srcR = sourceUser.skillRating || 1e3;
    const tgtR = targetUser.skillRating || 1e3;
    const skillRating = srcM + tgtM > 0 ? Math.round((srcR * srcM + tgtR * tgtM) / (srcM + tgtM)) : Math.round((srcR + tgtR) / 2);
    const srcLP = sourceUser.levelPoints ?? 0;
    const tgtLP = targetUser.levelPoints ?? 0;
    const levelPoints = srcM + tgtM > 0 ? Math.round((srcLP * srcM + tgtLP * tgtM) / (srcM + tgtM)) : Math.round((srcLP + tgtLP) / 2);
    const mergedStats = {
      totalKills,
      totalDeaths,
      totalAssists,
      totalHeadshots,
      totalDamage,
      totalMatches,
      matchesWon,
      matchesLost,
      totalRoundsPlayed,
      roundsWon,
      totalMvps,
      total1v1Count,
      total1v1Wins,
      total1v2Count,
      total1v2Wins,
      totalEntryCount,
      totalEntryWins,
      total5ks,
      total4ks,
      total3ks,
      total2ks,
      totalFlashCount,
      totalFlashSuccesses,
      totalEnemiesFlashed,
      totalUtilityDamage,
      totalShotsFired,
      totalShotsOnTarget,
      skillRating: Math.max(100, Math.min(3e3, skillRating)),
      levelPoints: Math.max(0, Math.min(2100, levelPoints)),
      nickname: targetUser.nickname || sourceUser.nickname
    };
    const newSteamId64 = targetUser.steamId64 || sourceUser.steamId64;
    await db.delete(users).where((0, import_drizzle_orm2.eq)(users.id, sourceId));
    const [updatedUser] = await db.update(users).set({ ...mergedStats, steamId64: newSteamId64, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(users.id, targetId)).returning();
    return updatedUser;
  }
  // Championship registration operations
  async getAllChampionshipRegistrations() {
    return await db.select().from(championshipRegistrations).orderBy((0, import_drizzle_orm2.desc)(championshipRegistrations.createdAt));
  }
  async getChampionshipRegistrationByUser(userId) {
    const [registration] = await db.select().from(championshipRegistrations).where((0, import_drizzle_orm2.eq)(championshipRegistrations.userId, userId));
    return registration;
  }
  async createChampionshipRegistration(registration) {
    const [newRegistration] = await db.insert(championshipRegistrations).values(registration).returning();
    return newRegistration;
  }
  async deleteChampionshipRegistration(id) {
    const result = await db.delete(championshipRegistrations).where((0, import_drizzle_orm2.eq)(championshipRegistrations.id, id)).returning();
    return result.length > 0;
  }
  // Monthly ranking operations
  async getAllMonthlyRankings() {
    return await db.select().from(monthlyRankings).orderBy((0, import_drizzle_orm2.desc)(monthlyRankings.year), (0, import_drizzle_orm2.desc)(monthlyRankings.month));
  }
  async getMonthlyRanking(id) {
    const [ranking] = await db.select().from(monthlyRankings).where((0, import_drizzle_orm2.eq)(monthlyRankings.id, id));
    return ranking;
  }
  async getMonthlyRankingByMonthYear(month, year) {
    const [ranking] = await db.select().from(monthlyRankings).where(import_drizzle_orm2.sql`${monthlyRankings.month} = ${month} AND ${monthlyRankings.year} = ${year}`);
    return ranking;
  }
  async createMonthlyRanking(ranking) {
    const [newRanking] = await db.insert(monthlyRankings).values({
      month: ranking.month,
      year: ranking.year,
      rankings: ranking.rankings
    }).returning();
    return newRanking;
  }
  async deleteMonthlyRanking(id) {
    const result = await db.delete(monthlyRankings).where((0, import_drizzle_orm2.eq)(monthlyRankings.id, id)).returning();
    return result.length > 0;
  }
  // Casino operations
  async getCasinoBalance(userId) {
    const [balance] = await db.select().from(casinoBalances).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, userId));
    return balance;
  }
  async getOrCreateCasinoBalance(userId) {
    let balance = await this.getCasinoBalance(userId);
    if (!balance) {
      const [newBalance] = await db.insert(casinoBalances).values({
        userId,
        balance: 1e7
        // R$10 million starting balance
      }).returning();
      balance = newBalance;
    }
    return balance;
  }
  async updateCasinoBalance(userId, delta, type, description) {
    const currentBalance = await this.getOrCreateCasinoBalance(userId);
    const newBalance = currentBalance.balance + delta;
    if (newBalance < 0) {
      return void 0;
    }
    const [updated] = await db.update(casinoBalances).set({
      balance: newBalance,
      totalWon: delta > 0 ? import_drizzle_orm2.sql`${casinoBalances.totalWon} + ${delta}` : casinoBalances.totalWon,
      totalLost: delta < 0 ? import_drizzle_orm2.sql`${casinoBalances.totalLost} + ${Math.abs(delta)}` : casinoBalances.totalLost,
      totalBets: type === "bet" ? import_drizzle_orm2.sql`${casinoBalances.totalBets} + 1` : casinoBalances.totalBets,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm2.eq)(casinoBalances.userId, userId)).returning();
    await db.insert(casinoTransactions).values({
      userId,
      type,
      amount: delta,
      description
    });
    return updated;
  }
  async createBet(userId, targetPlayerId, amount, items) {
    const totalOdds = items.reduce((acc, item) => acc * item.odds, 1);
    const potentialWin = amount * totalOdds;
    const balanceUpdate = await this.updateCasinoBalance(userId, -amount, "bet", `Aposta em jogador`);
    if (!balanceUpdate) {
      return void 0;
    }
    const [bet] = await db.insert(bets).values({
      userId,
      targetPlayerId,
      amount,
      totalOdds,
      potentialWin,
      status: "pending"
    }).returning();
    for (const item of items) {
      await db.insert(betItems).values({
        betId: bet.id,
        betType: item.betType,
        targetValue: item.targetValue,
        odds: item.odds
      });
    }
    return bet;
  }
  async getUserBets(userId) {
    const userBets = await db.select().from(bets).where((0, import_drizzle_orm2.eq)(bets.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(bets.createdAt));
    const result = [];
    for (const bet of userBets) {
      const items = await db.select().from(betItems).where((0, import_drizzle_orm2.eq)(betItems.betId, bet.id));
      const targetPlayer = await this.getUser(bet.targetPlayerId);
      result.push({
        ...bet,
        items,
        targetPlayer: targetPlayer || null
      });
    }
    return result;
  }
  async getPendingBetsForPlayer(targetPlayerId) {
    return await db.select().from(bets).where(import_drizzle_orm2.sql`${bets.targetPlayerId} = ${targetPlayerId} AND ${bets.status} = 'pending'`);
  }
  async resolveBet(betId, matchStat, winnerTeam) {
    const [bet] = await db.select().from(bets).where((0, import_drizzle_orm2.eq)(bets.id, betId));
    if (!bet || bet.status !== "pending") return void 0;
    const items = await db.select().from(betItems).where((0, import_drizzle_orm2.eq)(betItems.betId, betId));
    const hasWinBetType = items.some((item) => item.betType === "win");
    if (hasWinBetType && winnerTeam === null) {
      return void 0;
    }
    let allWon = true;
    const results = [];
    for (const item of items) {
      let actualValue;
      let won;
      switch (item.betType) {
        case "kills_over":
          actualValue = matchStat.kills;
          won = actualValue > item.targetValue;
          results.push(`Kills: ${actualValue} (meta: >${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "kills_under":
          actualValue = matchStat.kills;
          won = actualValue < item.targetValue;
          results.push(`Kills: ${actualValue} (meta: <${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "deaths_under":
          actualValue = matchStat.deaths;
          won = actualValue < item.targetValue;
          results.push(`Deaths: ${actualValue} (meta: <${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "kd_over":
          actualValue = matchStat.deaths > 0 ? matchStat.kills / matchStat.deaths : matchStat.kills;
          won = actualValue > item.targetValue;
          results.push(`K/D: ${actualValue.toFixed(2)} (meta: >${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "headshots_over":
          actualValue = matchStat.headshots;
          won = actualValue > item.targetValue;
          results.push(`Headshots: ${actualValue} (meta: >${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "mvps_over":
          actualValue = matchStat.mvps;
          won = actualValue >= item.targetValue;
          results.push(`MVPs: ${actualValue} (meta: >=${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "damage_over":
          actualValue = matchStat.damage;
          won = actualValue > item.targetValue;
          results.push(`Damage: ${actualValue} (meta: >${item.targetValue}) - ${won ? "Acertou!" : "Errou"}`);
          break;
        case "win":
          const playerTeam = matchStat.team;
          won = playerTeam === winnerTeam;
          actualValue = won ? 1 : 0;
          results.push(`Vit\xF3ria do time ${playerTeam}: ${won ? "Sim" : "N\xE3o"} (Vencedor: ${winnerTeam})`);
          break;
        default:
          actualValue = 0;
          won = false;
      }
      if (!won) allWon = false;
      await db.update(betItems).set({ won, actualValue }).where((0, import_drizzle_orm2.eq)(betItems.id, item.id));
    }
    const status = allWon ? "won" : "lost";
    const [updatedBet] = await db.update(bets).set({
      status,
      result: results.join("\n"),
      resolvedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm2.eq)(bets.id, betId)).returning();
    if (allWon) {
      await this.updateCasinoBalance(bet.userId, bet.potentialWin, "bet_win", `Ganhou aposta! Odds: ${bet.totalOdds.toFixed(2)}x`);
    }
    return updatedBet;
  }
  async deleteBet(betId, userId) {
    const [bet] = await db.select().from(bets).where((0, import_drizzle_orm2.eq)(bets.id, betId));
    if (!bet) {
      return { success: false };
    }
    if (bet.userId !== userId) {
      return { success: false };
    }
    if (bet.status !== "pending") {
      return { success: false };
    }
    await db.delete(betItems).where((0, import_drizzle_orm2.eq)(betItems.betId, betId));
    await db.delete(bets).where((0, import_drizzle_orm2.eq)(bets.id, betId));
    await this.updateCasinoBalance(userId, bet.amount, "bet_refund", `Aposta cancelada - Reembolso`);
    return { success: true, refundAmount: bet.amount };
  }
  async getCasinoTransactions(userId) {
    return await db.select().from(casinoTransactions).where((0, import_drizzle_orm2.eq)(casinoTransactions.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(casinoTransactions.createdAt)).limit(50);
  }
  async getMixList(listDate) {
    const results = await db.select().from(mixAvailability).innerJoin(users, (0, import_drizzle_orm2.eq)(mixAvailability.userId, users.id)).where((0, import_drizzle_orm2.eq)(mixAvailability.listDate, listDate)).orderBy(mixAvailability.position);
    return results.map((r) => ({
      ...r.mix_availability,
      user: r.users
    }));
  }
  async joinMixList(userId, listDate, isSub) {
    const existing = await db.select().from(mixAvailability).where(import_drizzle_orm2.sql`${mixAvailability.userId} = ${userId} AND ${mixAvailability.listDate} = ${listDate}`);
    if (existing.length > 0) {
      return void 0;
    }
    const currentList = await db.select().from(mixAvailability).where((0, import_drizzle_orm2.eq)(mixAvailability.listDate, listDate)).orderBy(mixAvailability.position);
    let position;
    if (isSub) {
      const subs = currentList.filter((e) => e.isSub);
      position = subs.length > 0 ? Math.max(...subs.map((s) => s.position)) + 1 : 11;
    } else {
      const mains = currentList.filter((e) => !e.isSub);
      if (mains.length >= 10) {
        const subs = currentList.filter((e) => e.isSub);
        position = subs.length > 0 ? Math.max(...subs.map((s) => s.position)) + 1 : 11;
        isSub = true;
      } else {
        position = mains.length + 1;
      }
    }
    const [entry] = await db.insert(mixAvailability).values({
      listDate,
      userId,
      position,
      isSub
    }).returning();
    return entry;
  }
  async leaveMixList(userId, listDate) {
    const result = await db.delete(mixAvailability).where(import_drizzle_orm2.sql`${mixAvailability.userId} = ${userId} AND ${mixAvailability.listDate} = ${listDate}`).returning();
    if (result.length === 0) return false;
    const removedEntry = result[0];
    const remaining = await db.select().from(mixAvailability).where((0, import_drizzle_orm2.eq)(mixAvailability.listDate, listDate)).orderBy(mixAvailability.position);
    if (!removedEntry.isSub) {
      const firstSub = remaining.find((e) => e.isSub);
      if (firstSub) {
        await db.update(mixAvailability).set({ isSub: false, position: removedEntry.position }).where((0, import_drizzle_orm2.eq)(mixAvailability.id, firstSub.id));
      }
      const mains = remaining.filter((e) => !e.isSub && e.id !== firstSub?.id);
      for (let i = 0; i < mains.length; i++) {
        const expectedPos = i + 1 + (mains[i].position <= removedEntry.position ? 0 : -1);
        if (mains[i].position !== expectedPos) {
        }
      }
    }
    const allEntries = await db.select().from(mixAvailability).where((0, import_drizzle_orm2.eq)(mixAvailability.listDate, listDate)).orderBy(mixAvailability.position);
    const mainEntries = allEntries.filter((e) => !e.isSub);
    const subEntries = allEntries.filter((e) => e.isSub);
    for (let i = 0; i < mainEntries.length; i++) {
      if (mainEntries[i].position !== i + 1) {
        await db.update(mixAvailability).set({ position: i + 1 }).where((0, import_drizzle_orm2.eq)(mixAvailability.id, mainEntries[i].id));
      }
    }
    for (let i = 0; i < subEntries.length; i++) {
      if (subEntries[i].position !== 11 + i) {
        await db.update(mixAvailability).set({ position: 11 + i }).where((0, import_drizzle_orm2.eq)(mixAvailability.id, subEntries[i].id));
      }
    }
    return true;
  }
  async getLatestMatchWithMvp() {
    const [latestMatch] = await db.select().from(matches).orderBy((0, import_drizzle_orm2.desc)(matches.date)).limit(1);
    if (!latestMatch) return void 0;
    const stats = await db.select().from(matchStats).where((0, import_drizzle_orm2.eq)(matchStats.matchId, latestMatch.id));
    if (stats.length === 0) return void 0;
    const mvp = stats.reduce((best, s) => {
      return (s.mvps || 0) > (best.mvps || 0) ? s : best;
    }, stats[0]);
    const [mvpUser] = await db.select().from(users).where(
      (0, import_drizzle_orm2.and)((0, import_drizzle_orm2.eq)(users.id, mvp.userId), (0, import_drizzle_orm2.eq)(users.isBanned, false), (0, import_drizzle_orm2.eq)(users.isCheaterBanned, false))
    );
    if (!mvpUser) return void 0;
    return { match: latestMatch, mvpStats: mvp, mvpUser };
  }
  async getLatestAce() {
    const rows = await db.select({
      matchStat: matchStats,
      match: matches,
      user: users
    }).from(matchStats).innerJoin(matches, (0, import_drizzle_orm2.eq)(matchStats.matchId, matches.id)).innerJoin(users, (0, import_drizzle_orm2.eq)(matchStats.userId, users.id)).where((0, import_drizzle_orm2.and)(
      import_drizzle_orm2.sql`${matchStats.enemy5ks} > 0`,
      (0, import_drizzle_orm2.eq)(users.isBanned, false),
      (0, import_drizzle_orm2.eq)(users.isCheaterBanned, false)
    )).orderBy((0, import_drizzle_orm2.desc)(matches.date), (0, import_drizzle_orm2.desc)(matchStats.id)).limit(1);
    if (rows.length === 0) return void 0;
    const { matchStat, match, user: aceUser } = rows[0];
    return { match, aceStats: matchStat, aceUser };
  }
  async getUserPenalties(userId) {
    return db.select().from(mixPenalties).where((0, import_drizzle_orm2.eq)(mixPenalties.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(mixPenalties.createdAt));
  }
  async getAllPenalties() {
    return db.select().from(mixPenalties).orderBy((0, import_drizzle_orm2.desc)(mixPenalties.createdAt));
  }
  async getActivePenaltyCount(userId) {
    const penalties = await db.select().from(mixPenalties).where((0, import_drizzle_orm2.eq)(mixPenalties.userId, userId));
    return penalties.length;
  }
  async addPenalty(userId, listDate) {
    const [penalty] = await db.insert(mixPenalties).values({
      userId,
      listDate,
      type: "no_show"
    }).returning();
    return penalty;
  }
  async getMixListUserIds(listDate) {
    const entries = await db.select({ userId: mixAvailability.userId }).from(mixAvailability).where(import_drizzle_orm2.sql`${mixAvailability.listDate} = ${listDate} AND ${mixAvailability.isSub} = false`);
    return entries.map((e) => e.userId);
  }
  async getAllNews() {
    const result = await db.select().from(news).innerJoin(users, (0, import_drizzle_orm2.eq)(news.authorId, users.id)).orderBy((0, import_drizzle_orm2.desc)(news.createdAt));
    return result.map((r) => ({ ...r.news, author: r.users }));
  }
  async createNews(authorId, title, content) {
    const [item] = await db.insert(news).values({ authorId, title, content }).returning();
    return item;
  }
  async deleteNews(id) {
    const result = await db.delete(news).where((0, import_drizzle_orm2.eq)(news.id, id)).returning();
    return result.length > 0;
  }
  async getUserTrophies(userId) {
    return await db.select().from(trophies).where((0, import_drizzle_orm2.eq)(trophies.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(trophies.year), (0, import_drizzle_orm2.desc)(trophies.month));
  }
  async getAllTrophies() {
    return await db.select().from(trophies).orderBy((0, import_drizzle_orm2.desc)(trophies.year), (0, import_drizzle_orm2.desc)(trophies.month));
  }
  async getTrophiesByMonthYear(month, year) {
    return await db.select().from(trophies).where(import_drizzle_orm2.sql`${trophies.month} = ${month} AND ${trophies.year} = ${year}`);
  }
  async createTrophy(trophy) {
    const [created] = await db.insert(trophies).values(trophy).returning();
    return created;
  }
  async deleteTrophiesByMonthYear(month, year) {
    const result = await db.delete(trophies).where(import_drizzle_orm2.sql`${trophies.month} = ${month} AND ${trophies.year} = ${year}`).returning();
    return result.length > 0;
  }
  // Survey operations
  async getSurveyByUserId(userId) {
    const [survey] = await db.select().from(surveys).where((0, import_drizzle_orm2.eq)(surveys.userId, userId));
    return survey;
  }
  async getAllSurveys() {
    const all = await db.select().from(surveys).orderBy((0, import_drizzle_orm2.desc)(surveys.createdAt));
    const allUsers = await db.select().from(users);
    const userMap = new Map(allUsers.map((u) => [u.id, u]));
    return all.map((s) => ({ ...s, user: userMap.get(s.userId) }));
  }
  async upsertSurvey(userId, data) {
    const [survey] = await db.insert(surveys).values({ ...data, userId, updatedAt: /* @__PURE__ */ new Date() }).onConflictDoUpdate({
      target: surveys.userId,
      set: { ...data, updatedAt: /* @__PURE__ */ new Date() }
    }).returning();
    return survey;
  }
  // ── Copa Aliados ──────────────────────────────────────────────────────────
  async createCopaTeam(data) {
    const [team] = await db.insert(copaTeams).values(data).returning();
    return team;
  }
  async getCopaTeam(id) {
    const [team] = await db.select().from(copaTeams).where((0, import_drizzle_orm2.eq)(copaTeams.id, id));
    if (!team) return void 0;
    const players = await db.select().from(copaPlayers).where((0, import_drizzle_orm2.eq)(copaPlayers.teamId, id)).orderBy(copaPlayers.playerOrder);
    return { ...team, players };
  }
  async getAllCopaTeams() {
    const teams = await db.select().from(copaTeams).orderBy((0, import_drizzle_orm2.desc)(copaTeams.createdAt));
    const allPlayers = await db.select().from(copaPlayers).orderBy(copaPlayers.playerOrder);
    return teams.map((t) => ({
      ...t,
      players: allPlayers.filter((p) => p.teamId === t.id)
    }));
  }
  async updateCopaTeamStatus(id, status, adminNotes) {
    const [team] = await db.update(copaTeams).set({ status, adminNotes: adminNotes ?? void 0, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(copaTeams.id, id)).returning();
    return team;
  }
  async addCopaPlayers(teamId, players) {
    const values = players.map((p, i) => ({ ...p, teamId, playerOrder: i }));
    return await db.insert(copaPlayers).values(values).returning();
  }
  async updateCopaTeam(id, data) {
    const [team] = await db.update(copaTeams).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(copaTeams.id, id)).returning();
    return team;
  }
  async updateCopaPlayers(teamId, players) {
    await db.delete(copaPlayers).where((0, import_drizzle_orm2.eq)(copaPlayers.teamId, teamId));
    if (players.length === 0) return [];
    const values = players.map((p, i) => ({ ...p, teamId, playerOrder: i }));
    return db.insert(copaPlayers).values(values).returning();
  }
  async getCopaMatches() {
    const matches2 = await db.select().from(copaMatches).orderBy(copaMatches.roundNumber, copaMatches.id);
    const teams = await db.select().from(copaTeams);
    const teamMap = new Map(teams.map((t) => [t.id, t]));
    return matches2.map((m) => ({
      ...m,
      team1: m.team1Id ? teamMap.get(m.team1Id) ?? null : null,
      team2: m.team2Id ? teamMap.get(m.team2Id) ?? null : null,
      winner: m.winnerId ? teamMap.get(m.winnerId) ?? null : null
    }));
  }
  async createCopaMatch(data) {
    const [match] = await db.insert(copaMatches).values(data).returning();
    return match;
  }
  async updateCopaMatch(id, data) {
    const [match] = await db.update(copaMatches).set(data).where((0, import_drizzle_orm2.eq)(copaMatches.id, id)).returning();
    return match;
  }
  async getCopaMatchStats(matchId) {
    return db.select().from(copaMatchStats).where((0, import_drizzle_orm2.eq)(copaMatchStats.matchId, matchId));
  }
  async setCopaMatchStats(matchId, stats) {
    await db.delete(copaMatchStats).where((0, import_drizzle_orm2.eq)(copaMatchStats.matchId, matchId));
    if (stats.length === 0) return [];
    return db.insert(copaMatchStats).values(stats).returning();
  }
  async getAllCopaStats() {
    return db.select().from(copaMatchStats);
  }
  // Tournament 2x2
  async listTournament2x2Teams() {
    return db.select().from(tournament2x2Teams).orderBy((0, import_drizzle_orm2.desc)(tournament2x2Teams.createdAt));
  }
  async getTournament2x2Team(id) {
    const [t] = await db.select().from(tournament2x2Teams).where((0, import_drizzle_orm2.eq)(tournament2x2Teams.id, id));
    return t;
  }
  async createTournament2x2Team(team) {
    const [created] = await db.insert(tournament2x2Teams).values(team).returning();
    return created;
  }
  async updateTournament2x2Team(id, data) {
    const [updated] = await db.update(tournament2x2Teams).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(tournament2x2Teams.id, id)).returning();
    return updated;
  }
  async deleteTournament2x2Team(id) {
    await db.delete(tournament2x2Matches).where(
      import_drizzle_orm2.sql`${tournament2x2Matches.team1Id} = ${id} OR ${tournament2x2Matches.team2Id} = ${id} OR ${tournament2x2Matches.winnerId} = ${id}`
    );
    const result = await db.delete(tournament2x2Teams).where((0, import_drizzle_orm2.eq)(tournament2x2Teams.id, id)).returning();
    return result.length > 0;
  }
  async listTournament2x2Matches() {
    return db.select().from(tournament2x2Matches).orderBy(tournament2x2Matches.round, tournament2x2Matches.position);
  }
  async replaceTournament2x2Bracket(matches2) {
    await db.delete(tournament2x2Matches);
    if (matches2.length === 0) return [];
    return db.insert(tournament2x2Matches).values(matches2).returning();
  }
  async updateTournament2x2Match(id, data) {
    const [updated] = await db.update(tournament2x2Matches).set(data).where((0, import_drizzle_orm2.eq)(tournament2x2Matches.id, id)).returning();
    return updated;
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
var client = __toESM(require("openid-client"), 1);
var import_passport = require("openid-client/passport");
var import_passport2 = __toESM(require("passport"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var import_memoizee = __toESM(require("memoizee"), 1);
var import_memorystore = __toESM(require("memorystore"), 1);
var MemorySessionStore = (0, import_memorystore.default)(import_express_session.default);
var getOidcConfig = (0, import_memoizee.default)(
  async () => {
    if (!process.env.REPL_ID) return null;
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  return (0, import_express_session.default)({
    secret: process.env.SESSION_SECRET || "aliados_inimigosdabala_secret_key_2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(import_passport2.default.initialize());
  app2.use(import_passport2.default.session());
  import_passport2.default.serializeUser((user, cb) => cb(null, user));
  import_passport2.default.deserializeUser((user, cb) => cb(null, user));
  if (!process.env.REPL_ID) {
    console.log("[Auth] REPL_ID n\xE3o configurado. Replit OIDC desativado, Steam Auth pronta.");
    app2.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect("/");
      });
    });
    return;
  }
  let config;
  try {
    config = await getOidcConfig();
  } catch (err) {
    console.error("[Auth] Falha na descoberta do OIDC Replit:", err);
  }
  if (!config) {
    app2.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect("/");
      });
    });
    return;
  }
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  const registeredStrategies = /* @__PURE__ */ new Set();
  const ensureStrategy = (domain) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new import_passport.Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      import_passport2.default.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };
  app2.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    import_passport2.default.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    import_passport2.default.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (user.isSteamAuth) {
    const now2 = Math.floor(Date.now() / 1e3);
    if (user.expires_at && now2 <= user.expires_at) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/steamAuth.ts
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
    console.log("[SteamAuth] Verification response text:", text2);
    if (text2.includes("is_valid:true")) {
      const claimedId = query["openid.claimed_id"] || "";
      const match = claimedId.match(/(?:id\/|id=)(\d+)/);
      return match ? match[1] : null;
    }
  } catch (err) {
    console.error("Steam OpenID verification error:", err);
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
  } catch (err) {
    console.error("Steam profile fetch error:", err);
    return null;
  }
}
function setupSteamAuth(app2) {
  const handleSteamLogin = (req, res) => {
    try {
      const rawProto = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const scheme = rawProto.split(",")[0].trim();
      const rawHost = req.headers["x-forwarded-host"] || req.headers.host || req.hostname || "localhost";
      const host = rawHost.split(",")[0].trim();
      const returnUrl = `${scheme}://${host}/api/auth/steam/callback`;
      const realm = `${scheme}://${host}/`;
      console.log(`[SteamAuth] Initiating auth. returnUrl: ${returnUrl}, realm: ${realm}`);
      const params = new URLSearchParams({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": returnUrl,
        "openid.realm": realm,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
      });
      res.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`);
    } catch (err) {
      console.error("[SteamAuth] Error initiating Steam login:", err);
      res.redirect("/?auth_error=init_failed");
    }
  };
  app2.get("/api/auth/steam", handleSteamLogin);
  app2.get("/auth/steam", handleSteamLogin);
  const handleSteamCallback = async (req, res) => {
    try {
      const query = req.query;
      const steamId64 = await verifySteamOpenId(query);
      if (!steamId64) {
        console.error("[SteamAuth] Steam OpenID verification failed");
        return res.redirect("/?auth_error=steam_failed");
      }
      const steamAccountId = `steam_${steamId64}`;
      const [steamAccount, linkedAccount] = await Promise.all([
        storage.getUser(steamAccountId).catch(() => void 0),
        storage.getUserBySteamId(steamId64).catch(() => void 0)
      ]);
      let user;
      if (steamAccount && linkedAccount && steamAccount.id !== linkedAccount.id) {
        console.log(`[SteamAuth] Merging ${steamAccount.id} (CSV) \u2192 ${linkedAccount.id} (linked). SteamID: ${steamId64}`);
        const merged = await storage.mergeUsers(steamAccount.id, linkedAccount.id).catch(() => null);
        if (merged) {
          await storage.recalculateUserStats(linkedAccount.id).catch(() => {
          });
          user = await storage.getUser(linkedAccount.id) || linkedAccount;
        } else {
          user = linkedAccount;
        }
      } else if (linkedAccount) {
        user = linkedAccount;
      } else if (steamAccount) {
        user = steamAccount;
      } else {
        const profile2 = await fetchSteamProfile(steamId64);
        const nickname = profile2?.nickname || `Jogador_${steamId64.slice(-6)}`;
        const avatar = profile2?.avatar || null;
        user = await storage.upsertUser({
          id: steamAccountId,
          email: null,
          firstName: nickname,
          lastName: null,
          profileImageUrl: avatar,
          steamId64
        });
      }
      if (!user) {
        console.error("[SteamAuth] Failed to resolve user after Steam login");
        return res.redirect("/?auth_error=steam_failed");
      }
      const profile = await fetchSteamProfile(steamId64);
      if (profile) {
        await storage.upsertUser({
          id: user.id,
          email: user.email,
          firstName: profile.nickname,
          lastName: user.lastName,
          profileImageUrl: profile.avatar || user.profileImageUrl,
          steamId64
        }).catch((err) => console.error("[SteamAuth] Profile refresh error:", err));
        user = await storage.getUser(user.id) || user;
      }
      const expiresAt = Math.floor(Date.now() / 1e3) + 365 * 24 * 60 * 60;
      const sessionUser = {
        claims: { sub: user.id },
        expires_at: expiresAt,
        isSteamAuth: true,
        steamId64
      };
      if (typeof req.login === "function") {
        req.login(sessionUser, (err) => {
          if (err) {
            console.error("[SteamAuth] Session login error:", err);
            return res.redirect("/?auth_error=session_failed");
          }
          res.redirect("/");
        });
      } else {
        if (req.session) {
          req.session.passport = { user: sessionUser };
        }
        res.redirect("/");
      }
    } catch (error) {
      console.error("[SteamAuth] Callback error:", error);
      res.redirect("/?auth_error=steam_failed");
    }
  };
  app2.get("/api/auth/steam/callback", handleSteamCallback);
  app2.get("/auth/steam/callback", handleSteamCallback);
}

// server/routes.ts
init_schema();
var import_zod2 = require("zod");
init_db();
var import_drizzle_orm4 = require("drizzle-orm");

// server/discord.ts
var import_discord = require("discord.js");
var client2 = null;
var ready = false;
var lastError = null;
var botApplicationId = null;
var CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || "";
var NEWS_CHANNEL_ID = process.env.DISCORD_NEWS_CHANNEL_ID || "";
function isDiscordReady() {
  return ready;
}
function getLastError() {
  return lastError;
}
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}
async function sendMixNotification(date, extraMessage) {
  if (!client2 || !ready) {
    return { ok: false, error: lastError || "Bot n\xE3o conectado" };
  }
  if (!CHANNEL_ID) {
    return { ok: false, error: "ID do canal n\xE3o configurado (DISCORD_CHANNEL_ID)" };
  }
  try {
    const channel = await client2.channels.fetch(CHANNEL_ID);
    if (!channel) {
      return { ok: false, error: `Canal ${CHANNEL_ID} n\xE3o encontrado. Adicione o bot ao servidor Discord.` };
    }
    if (!channel.isTextBased()) {
      return { ok: false, error: `Canal ${CHANNEL_ID} n\xE3o \xE9 um canal de texto.` };
    }
    const displayDate = formatDate(date);
    const embed = new import_discord.EmbedBuilder().setColor(16739072).setTitle("\u{1F3AE}  Lista do Mix Aberta!").setDescription(
      extraMessage ? extraMessage : `A lista do Mix de **${displayDate}** est\xE1 aberta!
Clique no bot\xE3o abaixo para reservar sua vaga direto pelo Discord.`
    ).setFooter({ text: "Aliados \u2022 CS2" }).setTimestamp();
    const button = new import_discord.ButtonBuilder().setCustomId(`mix_join_${date}`).setLabel("Entrar no Mix").setStyle(import_discord.ButtonStyle.Success).setEmoji("\u2705");
    const row = new import_discord.ActionRowBuilder().addComponents(button);
    await channel.send({ content: "@everyone", embeds: [embed], components: [row] });
    return { ok: true };
  } catch (err) {
    const msg = err.message || "Erro desconhecido";
    console.error("[Discord] Erro ao enviar notifica\xE7\xE3o do mix:", msg);
    return { ok: false, error: msg };
  }
}
function getNewsChannelId() {
  return NEWS_CHANNEL_ID;
}
async function sendNewsNotification(title, description, mentionEveryone = false, targetChannelId) {
  if (!client2 || !ready) {
    return { ok: false, error: lastError || "Bot n\xE3o conectado" };
  }
  const resolvedChannelId = targetChannelId || CHANNEL_ID;
  if (!resolvedChannelId) {
    return { ok: false, error: "ID do canal n\xE3o configurado" };
  }
  try {
    const channel = await client2.channels.fetch(resolvedChannelId);
    if (!channel) {
      return { ok: false, error: `Canal ${resolvedChannelId} n\xE3o encontrado. Adicione o bot ao servidor Discord.` };
    }
    if (!channel.isTextBased()) {
      return { ok: false, error: `Canal ${resolvedChannelId} n\xE3o \xE9 um canal de texto.` };
    }
    const embed = new import_discord.EmbedBuilder().setColor(16739072).setTitle(`\u{1F4E2}  ${title}`).setDescription(description).setFooter({ text: "Aliados \u2022 CS2" }).setTimestamp();
    const content = mentionEveryone ? "@everyone" : void 0;
    await channel.send({ content, embeds: [embed] });
    return { ok: true };
  } catch (err) {
    const msg = err.message || "Erro desconhecido";
    console.error("[Discord] Erro ao enviar notifica\xE7\xE3o:", msg);
    return { ok: false, error: msg };
  }
}
function getBotInviteUrl() {
  const appId = botApplicationId || client2?.application?.id || client2?.user?.id;
  if (!appId) return "";
  const perms = "277025392640";
  return `https://discord.com/api/oauth2/authorize?client_id=${appId}&permissions=${perms}&scope=bot+applications.commands`;
}

// server/push.ts
var import_web_push = __toESM(require("web-push"), 1);
init_db();
init_schema();
var import_drizzle_orm3 = require("drizzle-orm");
var publicKey = "";
var privateKey = "";
var initialized = false;
var initPromise = null;
var SUBJECT = "mailto:admin@aliados.local";
async function loadOrCreateKeys() {
  const rows = await db.select().from(appSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  let pub = map.get("vapid_public_key");
  let priv = map.get("vapid_private_key");
  if (!pub || !priv) {
    const keys = import_web_push.default.generateVAPIDKeys();
    pub = keys.publicKey;
    priv = keys.privateKey;
    await db.insert(appSettings).values({ key: "vapid_public_key", value: pub }).onConflictDoUpdate({ target: appSettings.key, set: { value: pub, updatedAt: /* @__PURE__ */ new Date() } });
    await db.insert(appSettings).values({ key: "vapid_private_key", value: priv }).onConflictDoUpdate({ target: appSettings.key, set: { value: priv, updatedAt: /* @__PURE__ */ new Date() } });
    console.log("[Push] VAPID keys gerados e salvos no banco.");
  }
  publicKey = pub;
  privateKey = priv;
  import_web_push.default.setVapidDetails(SUBJECT, publicKey, privateKey);
  initialized = true;
}
async function initPush() {
  if (initialized) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await loadOrCreateKeys();
      console.log("[Push] Inicializado (VAPID).");
    } finally {
      initPromise = null;
    }
  })();
  return initPromise;
}
function getPublicKey() {
  return publicKey;
}
async function sendPushToUser(userId, payload) {
  if (!initialized) await initPush();
  const subs = await db.select().from(pushSubscriptions).where((0, import_drizzle_orm3.eq)(pushSubscriptions.userId, userId));
  let sent = 0;
  let failed = 0;
  const stale = [];
  await Promise.all(
    subs.map(async (s) => {
      try {
        await import_web_push.default.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth }
          },
          JSON.stringify(payload),
          { TTL: 60 * 60 * 24 }
        );
        sent++;
      } catch (err) {
        failed++;
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          stale.push(s.id);
        } else {
          console.error("[Push] Falha ao enviar (user):", err?.statusCode, err?.body || err?.message);
        }
      }
    })
  );
  if (stale.length > 0) {
    for (const id of stale) {
      await db.delete(pushSubscriptions).where((0, import_drizzle_orm3.eq)(pushSubscriptions.id, id));
    }
  }
  return { sent, failed, total: subs.length };
}
async function sendPushToAll(payload) {
  if (!initialized) await initPush();
  const subs = await db.select().from(pushSubscriptions);
  let sent = 0;
  let failed = 0;
  const stale = [];
  await Promise.all(
    subs.map(async (s) => {
      try {
        await import_web_push.default.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth }
          },
          JSON.stringify(payload),
          { TTL: 60 * 60 * 6 }
        );
        sent++;
      } catch (err) {
        failed++;
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          stale.push(s.id);
        } else {
          console.error("[Push] Falha ao enviar:", err?.statusCode, err?.body || err?.message);
        }
      }
    })
  );
  if (stale.length > 0) {
    for (const id of stale) {
      await db.delete(pushSubscriptions).where((0, import_drizzle_orm3.eq)(pushSubscriptions.id, id));
    }
    console.log(`[Push] Removidas ${stale.length} inscri\xE7\xF5es inv\xE1lidas.`);
  }
  return { sent, failed, total: subs.length };
}

// server/routes.ts
init_schema();
var import_crypto = require("crypto");
var csvRowSchema = import_zod2.z.object({
  matchid: import_zod2.z.coerce.number(),
  mapnumber: import_zod2.z.coerce.number(),
  steamid64: import_zod2.z.string(),
  team: import_zod2.z.string(),
  name: import_zod2.z.string(),
  kills: import_zod2.z.coerce.number(),
  deaths: import_zod2.z.coerce.number(),
  damage: import_zod2.z.coerce.number(),
  assists: import_zod2.z.coerce.number(),
  enemy5ks: import_zod2.z.coerce.number(),
  enemy4ks: import_zod2.z.coerce.number(),
  enemy3ks: import_zod2.z.coerce.number(),
  enemy2ks: import_zod2.z.coerce.number(),
  utility_count: import_zod2.z.coerce.number(),
  utility_damage: import_zod2.z.coerce.number(),
  utility_successes: import_zod2.z.coerce.number(),
  utility_enemies: import_zod2.z.coerce.number(),
  flash_count: import_zod2.z.coerce.number(),
  flash_successes: import_zod2.z.coerce.number(),
  health_points_removed_total: import_zod2.z.coerce.number(),
  health_points_dealt_total: import_zod2.z.coerce.number(),
  shots_fired_total: import_zod2.z.coerce.number(),
  shots_on_target_total: import_zod2.z.coerce.number(),
  v1_count: import_zod2.z.coerce.number(),
  v1_wins: import_zod2.z.coerce.number(),
  v2_count: import_zod2.z.coerce.number(),
  v2_wins: import_zod2.z.coerce.number(),
  entry_count: import_zod2.z.coerce.number(),
  entry_wins: import_zod2.z.coerce.number(),
  equipment_value: import_zod2.z.coerce.number(),
  money_saved: import_zod2.z.coerce.number(),
  kill_reward: import_zod2.z.coerce.number(),
  live_time: import_zod2.z.coerce.number(),
  head_shot_kills: import_zod2.z.coerce.number(),
  cash_earned: import_zod2.z.coerce.number(),
  enemies_flashed: import_zod2.z.coerce.number()
});
function parseCSV(csvContent) {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const obj = {};
    headers.forEach((header, index2) => {
      obj[header] = values[index2] || "";
    });
    if (obj.team?.toLowerCase() === "spectator" || obj.team?.toLowerCase() === "spectators") {
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
function registerRoutes(httpServer2, app2) {
  setupAuth(app2);
  setupSteamAuth(app2);
  const handleGetUser = async (req, res) => {
    try {
      const isAuth = typeof req.isAuthenticated === "function" ? req.isAuthenticated() : false;
      if (!isAuth || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  };
  app2.get("/api/auth/user", handleGetUser);
  app2.get("/auth/user", handleGetUser);
  app2.get("/api/users", isAuthenticated, async (_req, res) => {
    try {
      const users2 = await storage.getAllUsers(false);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/users", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) return res.status(403).json({ message: "Admin access required" });
      const users2 = await storage.getAllUsers(true);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/cheater-banned", async (_req, res) => {
    try {
      const allUsers = await db.select().from(users).where((0, import_drizzle_orm4.eq)(users.isCheaterBanned, true)).orderBy((0, import_drizzle_orm4.desc)(users.createdAt));
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching cheater-banned users:", error);
      res.status(500).json({ message: "Failed to fetch cheater-banned users" });
    }
  });
  app2.get("/api/users/:id", isAuthenticated, async (req, res) => {
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
  app2.post("/api/admin/recalculate-all-stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const users2 = await storage.getAllUsers();
      const results = [];
      for (const user of users2) {
        try {
          await storage.recalculateUserStats(user.id);
          results.push({ userId: user.id, success: true });
        } catch (err) {
          results.push({ userId: user.id, success: false, error: String(err) });
        }
      }
      const successCount = results.filter((r) => r.success).length;
      res.json({
        message: `Recalculated stats for ${successCount}/${users2.length} users`,
        results
      });
    } catch (error) {
      console.error("Error recalculating stats:", error);
      res.status(500).json({ message: "Failed to recalculate stats" });
    }
  });
  app2.post("/api/admin/recalculate-mvps", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const calculateMVPScore = (stat) => {
        const kd = stat.deaths > 0 ? stat.kills / stat.deaths : stat.kills;
        const hsPercent = stat.kills > 0 ? stat.headshots / stat.kills : 0;
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
      const usersToRecalculate = /* @__PURE__ */ new Set();
      for (const match of allMatches) {
        const stats = await storage.getMatchStats(match.id);
        if (stats.length === 0) continue;
        let mvpStatId = null;
        let highestScore = -1;
        for (const stat of stats) {
          const score = calculateMVPScore(stat);
          if (score > highestScore) {
            highestScore = score;
            mvpStatId = stat.id;
          }
        }
        for (const stat of stats) {
          const isMVP = stat.id === mvpStatId ? 1 : 0;
          await storage.updateMatchStatsMvp(stat.id, isMVP);
          usersToRecalculate.add(stat.userId);
          if (isMVP === 1) mvpsAssigned++;
        }
        matchesProcessed++;
      }
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
  app2.post("/api/admin/grant-desafio-all", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user?.claims?.sub ?? req.user?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });
      const result = await db.update(users).set({ desafioRpCount: import_drizzle_orm4.sql`${users.desafioRpCount} + 1` }).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.eq)(users.isBanned, false), (0, import_drizzle_orm4.eq)(users.isCheaterBanned, false))).returning({ id: users.id });
      res.json({ message: `+1 Desafio LP concedido para ${result.length} jogador(es).`, count: result.length });
    } catch (error) {
      console.error("Error granting desafio to all:", error);
      res.status(500).json({ message: "Erro ao conceder Desafio LP" });
    }
  });
  app2.patch("/api/users/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, nickname, profileImageUrl, steamId64 } = req.body;
      if (steamId64 && steamId64.trim() !== "") {
        const existingUser = await storage.getUserBySteamId(steamId64);
        if (existingUser && existingUser.id !== userId) {
          const mergedUser = await storage.mergeUsers(existingUser.id, userId);
          if (mergedUser) {
            const additionalUpdates = { updatedAt: /* @__PURE__ */ new Date() };
            if (firstName !== void 0) additionalUpdates.firstName = firstName;
            if (lastName !== void 0) additionalUpdates.lastName = lastName;
            if (nickname !== void 0) additionalUpdates.nickname = nickname;
            if (profileImageUrl !== void 0) additionalUpdates.profileImageUrl = profileImageUrl;
            if (Object.keys(additionalUpdates).length > 1) {
              const finalUser = await storage.updateUserStats(userId, additionalUpdates);
              return res.json(finalUser);
            }
            return res.json(mergedUser);
          } else {
            return res.status(400).json({
              message: "N\xE3o foi poss\xEDvel vincular este SteamID64. O usu\xE1rio associado n\xE3o foi encontrado."
            });
          }
        }
      }
      const updates = { updatedAt: /* @__PURE__ */ new Date() };
      if (firstName !== void 0) updates.firstName = firstName;
      if (lastName !== void 0) updates.lastName = lastName;
      if (nickname !== void 0) updates.nickname = nickname;
      if (profileImageUrl !== void 0) updates.profileImageUrl = profileImageUrl;
      if (steamId64 !== void 0) updates.steamId64 = steamId64;
      const user = await storage.updateUserStats(userId, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.patch("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
      if (error instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.post("/api/users/link-steam", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { steamId64 } = req.body;
      if (!steamId64 || typeof steamId64 !== "string") {
        return res.status(400).json({ message: "SteamID64 is required" });
      }
      const existingUser = await storage.getUserBySteamId(steamId64);
      if (existingUser && existingUser.id !== userId) {
        console.log(`Merging user ${existingUser.id} into ${userId} (SteamID: ${steamId64})`);
        const mergedUser = await storage.mergeUsers(existingUser.id, userId);
        if (mergedUser) {
          await storage.recalculateUserStats(userId);
          return res.json({
            ...mergedUser,
            merged: true,
            message: `Dados mesclados com sucesso! ${existingUser.totalMatches || 0} partidas foram transferidas.`
          });
        } else {
          return res.status(400).json({
            message: "N\xE3o foi poss\xEDvel mesclar os dados. Tente novamente."
          });
        }
      }
      const updatedUser = await storage.updateUserStats(userId, { steamId64 });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.recalculateUserStats(userId);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error linking steam:", error);
      res.status(500).json({ message: "Failed to link Steam account" });
    }
  });
  app2.get("/api/me/items", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({
        desafioRpCount: user.desafioRpCount ?? 0,
        freezeRpCount: user.freezeRpCount ?? 0,
        activeModifier: user.activeModifier ?? null,
        itemsUsedToday: user.itemsUsedToday ?? 0,
        winStreak: user.winStreak ?? 0
      });
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar itens" });
    }
  });
  app2.post("/api/me/modifier", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { type } = req.body;
      if (type !== "desafio_rp" && type !== "freeze_rp") {
        return res.status(400).json({ message: "Tipo inv\xE1lido. Use 'desafio_rp' ou 'freeze_rp'" });
      }
      const nowUtc = /* @__PURE__ */ new Date();
      const nowBrt = new Date(nowUtc.getTime() - 3 * 60 * 60 * 1e3);
      const hourBrt = nowBrt.getUTCHours();
      const isBlocked = hourBrt >= 19 || hourBrt < 7;
      if (isBlocked) {
        return res.status(403).json({ message: "Itens s\xF3 podem ser ativados entre 07:00 e 19:00 (BRT)" });
      }
      const todayStr = nowBrt.toISOString().slice(0, 10);
      let usedToday = user.itemsUsedToday ?? 0;
      if ((user.itemsLastUsedDate ?? "") !== todayStr) {
        usedToday = 0;
      }
      if (usedToday >= 2) {
        return res.status(403).json({ message: "Limite de 2 itens por dia atingido" });
      }
      const count = type === "desafio_rp" ? user.desafioRpCount ?? 0 : user.freezeRpCount ?? 0;
      if (count <= 0) {
        return res.status(400).json({ message: "Voc\xEA n\xE3o tem esse item dispon\xEDvel" });
      }
      const updates = {
        activeModifier: type,
        itemsUsedToday: usedToday + 1,
        itemsLastUsedDate: todayStr,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (type === "desafio_rp") updates.desafioRpCount = (user.desafioRpCount ?? 0) - 1;
      else updates.freezeRpCount = (user.freezeRpCount ?? 0) - 1;
      await db.update(users).set(updates).where((0, import_drizzle_orm4.eq)(users.id, userId));
      res.json({ message: "Modificador ativado com sucesso!", activeModifier: type });
    } catch (e) {
      console.error("Error activating modifier:", e);
      res.status(500).json({ message: "Erro ao ativar modificador" });
    }
  });
  app2.delete("/api/me/modifier", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.activeModifier) return res.status(400).json({ message: "Nenhum modificador ativo" });
      const refundField = user.activeModifier === "desafio_rp" ? "desafioRpCount" : "freezeRpCount";
      const refundCount = user.activeModifier === "desafio_rp" ? user.desafioRpCount ?? 0 : user.freezeRpCount ?? 0;
      await db.update(users).set({
        activeModifier: null,
        [refundField]: refundCount + 1,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm4.eq)(users.id, userId));
      res.json({ message: "Modificador cancelado. Item devolvido." });
    } catch (e) {
      res.status(500).json({ message: "Erro ao cancelar modificador" });
    }
  });
  app2.delete("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const targetId = req.params.id;
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
  app2.post("/api/matches/import", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const { csvContent, map, winnerTeam, team1Score, team2Score, matchDate } = req.body;
      if (!csvContent || typeof csvContent !== "string") {
        return res.status(400).json({ message: "CSV content is required" });
      }
      if (!map || typeof map !== "string") {
        return res.status(400).json({ message: "Map name is required" });
      }
      const rows = parseCSV(csvContent);
      if (rows.length === 0) {
        return res.status(400).json({ message: "No valid data found in CSV" });
      }
      const matchId = rows[0].matchid;
      const mapNumber = rows[0].mapnumber;
      const existingMatch = await storage.getMatchByExternalId(matchId, mapNumber);
      if (existingMatch) {
        return res.status(409).json({
          message: "Esta partida j\xE1 foi importada anteriormente.",
          matchId: existingMatch.id,
          map: existingMatch.map,
          date: existingMatch.date
        });
      }
      const teams = Array.from(new Set(rows.map((r) => r.team)));
      const team1Name = teams[0] || "Time 1";
      const team2Name = teams[1] || "Time 2";
      let finalTeam1Score = team1Score;
      let finalTeam2Score = team2Score;
      if (finalTeam1Score === void 0 || finalTeam2Score === void 0) {
        const team1Players = rows.filter((r) => r.team === team1Name);
        const team2Players = rows.filter((r) => r.team === team2Name);
        const t1Kills = team1Players.reduce((sum, p) => sum + p.kills, 0);
        const t2Kills = team2Players.reduce((sum, p) => sum + p.kills, 0);
        finalTeam1Score = Math.round(t1Kills / 5);
        finalTeam2Score = Math.round(t2Kills / 5);
      }
      let finalWinnerTeam = null;
      if (finalTeam1Score !== void 0 && finalTeam2Score !== void 0) {
        if (finalTeam1Score > finalTeam2Score) {
          finalWinnerTeam = team1Name;
        } else if (finalTeam2Score > finalTeam1Score) {
          finalWinnerTeam = team2Name;
        }
      }
      const resolvedDate = matchDate ? /* @__PURE__ */ new Date(matchDate + "T12:00:00") : /* @__PURE__ */ new Date();
      const match = await storage.createMatch({
        externalMatchId: matchId,
        mapNumber,
        map,
        team1Name,
        team2Name,
        team1Score: finalTeam1Score,
        team2Score: finalTeam2Score,
        winnerTeam: finalWinnerTeam,
        date: resolvedDate
      });
      const calculateMVPScore = (row) => {
        const kd = row.deaths > 0 ? row.kills / row.deaths : row.kills;
        const hsPercent = row.kills > 0 ? row.head_shot_kills / row.kills : 0;
        let score = 0;
        score += row.kills * 2;
        score += row.assists * 0.5;
        score += kd * 5;
        score += hsPercent * 10;
        score += row.damage * 0.01;
        score += row.enemy5ks * 15;
        score += row.enemy4ks * 10;
        score += row.enemy3ks * 5;
        score += row.enemy2ks * 2;
        score += row.v1_wins * 8;
        score += row.v2_wins * 12;
        score += row.entry_wins * 3;
        score += row.utility_damage * 0.02;
        score += row.enemies_flashed * 0.5;
        return score;
      };
      let mvpSteamId = null;
      let highestScore = -1;
      for (const row of rows) {
        const score = calculateMVPScore(row);
        if (score > highestScore) {
          highestScore = score;
          mvpSteamId = row.steamid64;
        }
      }
      const usersToRecalculate = [];
      const preStateMap = {};
      for (const row of rows) {
        const user = await storage.createPlayerFromSteam(row.steamid64, row.name);
        usersToRecalculate.push(user.id);
        preStateMap[row.steamid64] = {
          userId: user.id,
          activeModifier: user.activeModifier ?? null,
          winStreak: user.winStreak ?? 0,
          desafioRpCount: user.desafioRpCount ?? 0,
          freezeRpCount: user.freezeRpCount ?? 0
        };
        const isMVP = row.steamid64 === mvpSteamId ? 1 : 0;
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
          score: row.damage
        });
      }
      const uniqueUserIds = Array.from(new Set(usersToRecalculate));
      for (const id of uniqueUserIds) {
        await storage.recalculateUserStats(id);
      }
      const matchRoundsTotal = (finalTeam1Score || 0) + (finalTeam2Score || 0) || 24;
      for (const row of rows) {
        const pre = preStateMap[row.steamid64];
        if (!pre) continue;
        const freshUser = await storage.getUser(pre.userId);
        if (!freshUser) continue;
        const wonMatch = !!finalWinnerTeam && finalWinnerTeam === row.team;
        const isMvpInt = row.steamid64 === mvpSteamId ? 1 : 0;
        const baseLp = calcMatchLP(
          wonMatch,
          Number(row.kills),
          Number(row.damage),
          matchRoundsTotal,
          Number(row.entry_wins),
          Number(row.entry_count),
          Number(row.utility_damage),
          Number(row.enemies_flashed),
          Number(row.v1_wins),
          Number(row.v2_wins),
          isMvpInt,
          Number(row.enemy5ks),
          Number(row.enemy4ks)
        );
        const newStreak = wonMatch ? pre.winStreak + 1 : 0;
        let streakBonus = 0;
        if (wonMatch && newStreak >= 3) {
          if (newStreak >= 10) streakBonus = 12;
          else if (newStreak >= 7) streakBonus = 8;
          else if (newStreak >= 5) streakBonus = 5;
          else streakBonus = 3;
        }
        let modifierCorrection = 0;
        let modifierConsumed = false;
        if (pre.activeModifier === "desafio_rp") {
          modifierCorrection = baseLp;
          modifierConsumed = true;
        } else if (pre.activeModifier === "freeze_rp") {
          modifierCorrection = -baseLp;
          modifierConsumed = true;
        }
        const totalCorrection = modifierCorrection + streakBonus;
        const newLP = Math.max(0, Math.min(2100, (freshUser.levelPoints ?? 0) + totalCorrection));
        let desafioGrant = 0;
        let freezeGrant = 0;
        if (row.enemy5ks > 0) {
          desafioGrant++;
          freezeGrant++;
        }
        if (isMvpInt > 0) {
          desafioGrant++;
          freezeGrant++;
        }
        const daysRes = await db.execute(
          import_drizzle_orm4.sql`SELECT COUNT(DISTINCT DATE(m.date)) AS cnt
              FROM match_stats ms
              JOIN matches m ON ms.match_id = m.id
              WHERE ms.user_id = ${pre.userId}`
        );
        const distinctDays = Number(daysRes.rows[0]?.cnt ?? 0);
        if (distinctDays === 5) {
          desafioGrant++;
          freezeGrant++;
        }
        const now = /* @__PURE__ */ new Date();
        const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const trophyRes = await db.execute(
          import_drizzle_orm4.sql`SELECT id FROM trophies
              WHERE user_id = ${pre.userId}
                AND month = ${prevMonth} AND year = ${prevYear}
              LIMIT 1`
        );
        if (trophyRes.rows.length > 0) {
          desafioGrant++;
          freezeGrant++;
        }
        const updates = {
          winStreak: newStreak,
          levelPoints: newLP,
          desafioRpCount: (freshUser.desafioRpCount ?? 0) + desafioGrant,
          freezeRpCount: (freshUser.freezeRpCount ?? 0) + freezeGrant,
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (modifierConsumed) updates.activeModifier = null;
        await db.update(users).set(updates).where((0, import_drizzle_orm4.eq)(users.id, pre.userId));
      }
      let betsResolved = 0;
      const matchStats2 = await storage.getMatchStats(match.id);
      for (const stat of matchStats2) {
        const pendingBets = await storage.getPendingBetsForPlayer(stat.userId);
        for (const bet of pendingBets) {
          await storage.resolveBet(bet.id, stat, finalWinnerTeam);
          betsResolved++;
        }
      }
      try {
        const matchDateStr = match.date instanceof Date ? match.date.toISOString() : String(match.date);
        const activeRounds = await db.execute(
          import_drizzle_orm4.sql`SELECT * FROM fantasy_rounds
              WHERE status IN ('open', 'active')
                AND start_date <= ${matchDateStr}::timestamptz
                AND end_date   >= ${matchDateStr}::timestamptz`
        );
        for (const round of activeRounds.rows) {
          const roundStats = await db.execute(
            import_drizzle_orm4.sql`SELECT ms.*, m.winner_team, (ms.team_name = m.winner_team) AS won_match
                FROM match_stats ms
                JOIN matches m ON ms.match_id = m.id
                WHERE m.date >= ${round.start_date} AND m.date <= ${round.end_date}`
          );
          const ptMap = {};
          for (const st of roundStats.rows) {
            if (!st.user_id) continue;
            const fp = calcFantasyPoints({
              kills: st.kills,
              deaths: st.deaths,
              assists: st.assists,
              headshots: st.headshots,
              fiveK: st.enemy_5ks,
              fourK: st.enemy_4ks,
              threeK: st.enemy_3ks,
              twoK: st.enemy_2ks,
              damage: st.damage,
              clutch1v1: st.v1_wins,
              clutch1v2: st.v2_wins,
              firstKills: st.entry_wins,
              isMvp: st.mvps > 0,
              wonMatch: st.won_match === true || st.won_match === "true"
            });
            ptMap[st.user_id] = (ptMap[st.user_id] || 0) + fp;
          }
          const roundTeams = await db.execute(import_drizzle_orm4.sql`SELECT id FROM fantasy_teams WHERE round_id = ${round.id}`);
          for (const ft of roundTeams.rows) {
            const picks = await db.execute(import_drizzle_orm4.sql`SELECT * FROM fantasy_picks WHERE team_id = ${ft.id}`);
            let total = 0;
            for (const pick of picks.rows) {
              const pts = ptMap[pick.picked_user_id] || 0;
              await db.execute(import_drizzle_orm4.sql`UPDATE fantasy_picks SET points = ${pts} WHERE id = ${pick.id}`);
              total += pts;
            }
            await db.execute(import_drizzle_orm4.sql`UPDATE fantasy_teams SET total_points = ${Math.round(total * 100) / 100} WHERE id = ${ft.id}`);
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
  app2.get("/api/matches", isAuthenticated, async (req, res) => {
    try {
      const matches2 = await storage.getAllMatches();
      res.json(matches2);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });
  app2.get("/api/matches/with-stats", isAuthenticated, async (req, res) => {
    try {
      const matches2 = await storage.getAllMatches();
      const matchesWithStats = await Promise.all(
        matches2.map(async (match) => {
          const stats = await storage.getMatchStats(match.id);
          const aggregated = {
            totalKills: stats.reduce((sum, s) => sum + s.kills, 0),
            totalDeaths: stats.reduce((sum, s) => sum + s.deaths, 0),
            totalDamage: stats.reduce((sum, s) => sum + s.damage, 0),
            totalHeadshots: stats.reduce((sum, s) => sum + s.headshots, 0),
            playerCount: stats.length,
            topKiller: stats.length > 0 ? stats.reduce((top, s) => s.kills > top.kills ? s : top) : null,
            mvpPlayer: stats.find((s) => s.mvps > 0) || null
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
  app2.get("/api/matches/latest-mvp", isAuthenticated, async (req, res) => {
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
  app2.get("/api/matches/latest-ace", isAuthenticated, async (req, res) => {
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
  app2.get("/api/matches/:id", isAuthenticated, async (req, res) => {
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
  app2.get("/api/users/:id/matches", isAuthenticated, async (req, res) => {
    try {
      const targetId = req.params.id;
      const matchStatsWithMatches = await storage.getUserMatchStatsWithMatches(targetId);
      res.json(matchStatsWithMatches);
    } catch (error) {
      console.error("Error fetching user match stats:", error);
      res.status(500).json({ message: "Failed to fetch user match stats" });
    }
  });
  app2.get("/api/stats/monthly", isAuthenticated, async (req, res) => {
    try {
      const now = /* @__PURE__ */ new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const allMatches = await storage.getAllMatches();
      const monthlyMatches = allMatches.filter((m) => {
        const matchDate = new Date(m.date);
        return matchDate >= firstDayOfMonth && matchDate <= lastDayOfMonth;
      });
      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map((u) => [u.id, u]));
      const playerStats = {};
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
              seenMatches: /* @__PURE__ */ new Set()
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
      const result = Object.values(playerStats).map((ps) => {
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
            levelPoints: user.levelPoints
          } : null
        };
      }).filter((p) => p.user !== null);
      res.json({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        monthName: now.toLocaleString("pt-BR", { month: "long" }),
        players: result
      });
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });
  app2.post("/api/users/merge", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { sourceUserId, targetUserId } = req.body;
      if (!sourceUserId || !targetUserId) {
        return res.status(400).json({ message: "sourceUserId e targetUserId s\xE3o obrigat\xF3rios" });
      }
      if (sourceUserId === targetUserId) {
        return res.status(400).json({ message: "N\xE3o \xE9 poss\xEDvel mesclar um usu\xE1rio consigo mesmo" });
      }
      const mergedUser = await storage.mergeUsers(sourceUserId, targetUserId);
      if (!mergedUser) {
        return res.status(404).json({ message: "Um ou ambos os usu\xE1rios n\xE3o foram encontrados" });
      }
      res.json({
        message: "Usu\xE1rios mesclados com sucesso!",
        user: mergedUser
      });
    } catch (error) {
      console.error("Error merging users:", error);
      res.status(500).json({ message: "Erro ao mesclar usu\xE1rios" });
    }
  });
  app2.post("/api/users/:id/ban", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user?.claims?.sub ?? req.user?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });
      const target = await storage.getUser(req.params.id);
      if (!target) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      if (target.isCheaterBanned) return res.status(400).json({ message: "Usu\xE1rio com ban permanente (cheater) n\xE3o pode ser banido novamente" });
      if (adminId === req.params.id) return res.status(400).json({ message: "Voc\xEA n\xE3o pode banir a si mesmo" });
      const banned = await storage.banUser(req.params.id);
      res.json({ message: "Usu\xE1rio banido com sucesso", user: banned });
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ message: "Erro ao banir usu\xE1rio" });
    }
  });
  app2.post("/api/users/:id/unban", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user?.claims?.sub ?? req.user?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });
      const target = await storage.getUser(req.params.id);
      if (!target) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      if (target.isCheaterBanned) return res.status(400).json({ message: "Ban de cheater \xE9 permanente e n\xE3o pode ser revertido" });
      const unbanned = await storage.unbanUser(req.params.id);
      res.json({ message: "Usu\xE1rio desbanido com sucesso", user: unbanned });
    } catch (error) {
      console.error("Error unbanning user:", error);
      res.status(500).json({ message: "Erro ao desbanir usu\xE1rio" });
    }
  });
  app2.post("/api/users/:id/cheater-ban", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user?.claims?.sub ?? req.user?.id;
      const admin = await storage.getUser(adminId);
      if (!admin?.isAdmin) return res.status(403).json({ message: "Admin access required" });
      const target = await storage.getUser(req.params.id);
      if (!target) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      if (adminId === req.params.id) return res.status(400).json({ message: "Voc\xEA n\xE3o pode banir a si mesmo" });
      const banned = await storage.cheaterBanUser(req.params.id);
      res.json({ message: "Ban permanente aplicado com sucesso", user: banned });
    } catch (error) {
      console.error("Error cheater-banning user:", error);
      res.status(500).json({ message: "Erro ao aplicar ban de cheater" });
    }
  });
  app2.get("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const payments2 = await storage.getAllPayments();
      res.json(payments2);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  app2.get("/api/users/:id/payments", isAuthenticated, async (req, res) => {
    try {
      const payments2 = await storage.getPaymentsByUser(req.params.id);
      res.json(payments2);
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ message: "Failed to fetch user payments" });
    }
  });
  app2.post("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const { userId: paymentUserId, amount, description, paymentDate } = req.body;
      if (!paymentUserId || typeof amount !== "number") {
        return res.status(400).json({ message: "User ID and amount are required" });
      }
      const payment = await storage.createPayment({
        userId: paymentUserId,
        amount,
        description: description || "",
        paymentDate: paymentDate ? new Date(paymentDate) : /* @__PURE__ */ new Date(),
        createdBy: userId
      });
      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });
  app2.delete("/api/payments/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.get("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const reports2 = await storage.getAllReports();
      res.json(reports2);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });
  app2.post("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { description, attachmentUrl, attachmentType, isAnonymous } = req.body;
      if (!description || typeof description !== "string" || description.length < 10) {
        return res.status(400).json({ message: "A descri\xE7\xE3o deve ter pelo menos 10 caracteres" });
      }
      if (description.length > 2e3) {
        return res.status(400).json({ message: "A descri\xE7\xE3o n\xE3o pode exceder 2000 caracteres" });
      }
      let validatedAttachmentUrl = null;
      let validatedAttachmentType = null;
      if (attachmentUrl && typeof attachmentUrl === "string") {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!attachmentType || !allowedTypes.includes(attachmentType)) {
          return res.status(400).json({ message: "Tipo de arquivo n\xE3o permitido. Use JPG, PNG, GIF ou WebP." });
        }
        if (!attachmentUrl.startsWith("data:image/")) {
          return res.status(400).json({ message: "Formato de anexo inv\xE1lido." });
        }
        const maxSizeBytes = 2 * 1024 * 1024;
        const base64Data = attachmentUrl.split(",")[1];
        if (base64Data) {
          const sizeBytes = base64Data.length * 3 / 4;
          if (sizeBytes > maxSizeBytes) {
            return res.status(400).json({ message: "O anexo deve ter no m\xE1ximo 2MB." });
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
        status: "pending"
      });
      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });
  app2.patch("/api/reports/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const reportId = req.params.id;
      const { status, adminNotes } = req.body;
      const updatedReport = await storage.updateReport(reportId, {
        status,
        adminNotes,
        reviewedBy: userId
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
  app2.delete("/api/reports/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.get("/api/championship-registrations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.get("/api/championship-registrations/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const registration = await storage.getChampionshipRegistrationByUser(userId);
      res.json({ registered: !!registration, registration });
    } catch (error) {
      console.error("Error checking registration:", error);
      res.status(500).json({ message: "Failed to check registration" });
    }
  });
  app2.post("/api/championship-registrations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const existing = await storage.getChampionshipRegistrationByUser(userId);
      if (existing) {
        return res.status(400).json({ message: "Already registered" });
      }
      const registration = await storage.createChampionshipRegistration({
        userId,
        status: "interested"
      });
      res.json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      res.status(500).json({ message: "Failed to create registration" });
    }
  });
  app2.delete("/api/championship-registrations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.get("/api/monthly-rankings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.post("/api/monthly-rankings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      const { month, year, rankings } = req.body;
      if (!month || !year || !rankings) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const existing = await storage.getMonthlyRankingByMonthYear(month, year);
      if (existing) {
        return res.status(400).json({ message: "Ranking para este m\xEAs j\xE1 existe" });
      }
      const newRanking = await storage.createMonthlyRanking({
        month,
        year,
        rankings
      });
      try {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0, 23, 59, 59);
        const allMatches = await storage.getAllMatches();
        const monthlyMatches = allMatches.filter((m) => {
          const matchDate = new Date(m.date);
          return matchDate >= firstDay && matchDate <= lastDay;
        });
        if (monthlyMatches.length > 0) {
          const allUsers = await storage.getAllUsers();
          const userMap = new Map(allUsers.map((u) => [u.id, u]));
          const playerStatsForTrophies = {};
          for (const match of monthlyMatches) {
            const stats = await storage.getMatchStats(match.id);
            for (const stat of stats) {
              if (!playerStatsForTrophies[stat.userId]) {
                playerStatsForTrophies[stat.userId] = {
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
                  seenMatches: /* @__PURE__ */ new Set()
                };
              }
              const ps = playerStatsForTrophies[stat.userId];
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
                if (match.winnerTeam && stat.team === match.winnerTeam) ps.matchesWon += 1;
              }
            }
          }
          const qualified = Object.values(playerStatsForTrophies).filter((s) => {
            if (s.matchesPlayed < 3) return false;
            const u = userMap.get(s.userId);
            return !!u && !u.isBanned && !u.isCheaterBanned;
          });
          if (qualified.length > 0) {
            await storage.deleteTrophiesByMonthYear(month, year);
            const monthNames = ["Janeiro", "Fevereiro", "Mar\xE7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
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
                    userId: winner.userId,
                    type: def.type,
                    month,
                    year,
                    title: `${def.title} - ${monthNames[month - 1]}/${year}`,
                    description: def.description,
                    value: winner.value
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
  app2.delete("/api/monthly-rankings/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.get("/api/trophies/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const userTrophies = await storage.getUserTrophies(req.params.userId);
      res.json(userTrophies);
    } catch (error) {
      console.error("Error fetching user trophies:", error);
      res.status(500).json({ message: "Failed to fetch trophies" });
    }
  });
  app2.get("/api/trophies", isAuthenticated, async (req, res) => {
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
      title: "Craque do M\xEAs",
      description: "O cara \xE9 brabo demais! Melhor jogador do m\xEAs, carregou o time nas costas.",
      getWinner: (stats) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => calculateSkillRating(b) - calculateSkillRating(a));
        return { ...sorted[0], value: `SR: ${calculateSkillRating(sorted[0])}` };
      }
    },
    {
      type: "best_kd",
      title: "Matador Nato",
      description: "Esse a\xED n\xE3o morre de gra\xE7a! Maior K/D do m\xEAs, os inimigos que se escondam.",
      getWinner: (stats) => {
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
      title: "Amig\xE3o do Server",
      description: "N\xE3o mata, mas ajuda! Maior m\xE9dia de assist\xEAncias do m\xEAs. O verdadeiro team player.",
      getWinner: (stats) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const avgA = a.matchesPlayed > 0 ? a.assists / a.matchesPlayed : 0;
          const avgB = b.matchesPlayed > 0 ? b.assists / b.matchesPlayed : 0;
          return avgB - avgA;
        });
        const avg = sorted[0].matchesPlayed > 0 ? (sorted[0].assists / sorted[0].matchesPlayed).toFixed(1) : "0";
        return { ...sorted[0], value: `M\xE9dia: ${avg} assists/partida` };
      }
    },
    {
      type: "best_hs",
      title: "Mira de Aimbot",
      description: "S\xF3 na cabe\xE7a! Melhor percentual de headshot. Se n\xE3o fosse amigo, j\xE1 tinha sido reportado.",
      getWinner: (stats) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const hsA = a.kills > 0 ? a.headshots / a.kills * 100 : 0;
          const hsB = b.kills > 0 ? b.headshots / b.kills * 100 : 0;
          return hsB - hsA;
        });
        const hs = sorted[0].kills > 0 ? (sorted[0].headshots / sorted[0].kills * 100).toFixed(1) : "0";
        return { ...sorted[0], value: `HS: ${hs}%` };
      }
    },
    {
      type: "most_matches",
      title: "Viciado Oficial",
      description: "Esse a\xED n\xE3o larga o PC! Jogou mais partidas que todo mundo. Precisa de uma interven\xE7\xE3o.",
      getWinner: (stats) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => b.matchesPlayed - a.matchesPlayed);
        return { ...sorted[0], value: `${sorted[0].matchesPlayed} partidas` };
      }
    },
    {
      type: "worst_player",
      title: "Trof\xE9u Abacaxi",
      description: "Algu\xE9m tem que ser o \xFAltimo... Pior skill rating do m\xEAs. Mas pelo menos jogou, n\xE9?",
      getWinner: (stats) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => calculateSkillRating(a) - calculateSkillRating(b));
        return { ...sorted[0], value: `SR: ${calculateSkillRating(sorted[0])}` };
      }
    },
    {
      type: "worst_kd",
      title: "\xCDm\xE3 de Bala",
      description: "Esse a\xED morre mais que personagem de novela! Menor K/D do m\xEAs. Os inimigos agradecem.",
      getWinner: (stats) => {
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
      description: "Esse a\xED n\xE3o veio pra brincar! Maior m\xE9dia de kills por partida. Linha de frente sempre.",
      getWinner: (stats) => {
        if (stats.length === 0) return null;
        const sorted = [...stats].sort((a, b) => {
          const avgA = a.matchesPlayed > 0 ? a.kills / a.matchesPlayed : 0;
          const avgB = b.matchesPlayed > 0 ? b.kills / b.matchesPlayed : 0;
          return avgB - avgA;
        });
        const avg = sorted[0].matchesPlayed > 0 ? (sorted[0].kills / sorted[0].matchesPlayed).toFixed(1) : "0";
        return { ...sorted[0], value: `M\xE9dia: ${avg} kills/partida` };
      }
    }
  ];
  function calculateSkillRating(stats) {
    const kd = stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills;
    const hsPercent = stats.kills > 0 ? stats.headshots / stats.kills * 100 : 0;
    const winRate = stats.matchesPlayed > 0 ? stats.matchesWon / stats.matchesPlayed * 100 : 0;
    const estimatedRounds = stats.matchesPlayed * 24;
    const adr = estimatedRounds > 0 ? stats.damage / estimatedRounds : 0;
    let sr = 1e3;
    sr += (kd - 1) * 150;
    sr += (hsPercent - 30) * 2;
    sr += (adr - 70) * 1.5;
    sr += (winRate - 50) * 3;
    sr += (stats.mvps || 0) * 2;
    sr += (stats.total5ks || 0) * 30;
    sr += (stats.total4ks || 0) * 15;
    sr += (stats.total3ks || 0) * 5;
    return Math.max(100, Math.min(3e3, Math.round(sr)));
  }
  app2.post("/api/trophies/generate/:year/:month", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const monthlyMatches = allMatches.filter((m) => {
        const matchDate = new Date(m.date);
        return matchDate >= firstDay && matchDate <= lastDay;
      });
      if (monthlyMatches.length === 0) {
        return res.status(400).json({ message: "Nenhuma partida encontrada neste m\xEAs" });
      }
      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map((u) => [u.id, u]));
      const playerStats = {};
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
              seenMatches: /* @__PURE__ */ new Set()
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
      const qualifiedStats = Object.values(playerStats).filter((s) => {
        if (s.matchesPlayed < 3) return false;
        const u = userMap.get(s.userId);
        return !!u && !u.isBanned && !u.isCheaterBanned;
      });
      if (qualifiedStats.length === 0) {
        return res.status(400).json({ message: "Nenhum jogador com 3+ partidas neste m\xEAs" });
      }
      await storage.deleteTrophiesByMonthYear(month, year);
      const createdTrophies = [];
      const monthNames = ["Janeiro", "Fevereiro", "Mar\xE7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
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
              value: winner.value
            });
            createdTrophies.push(trophy);
          }
        } catch (defError) {
          console.error(`[Trophy Manual] Error creating ${def.type}:`, defError);
        }
      }
      res.json({
        message: `${createdTrophies.length} trof\xE9us gerados para ${monthName}/${year}`,
        trophies: createdTrophies
      });
    } catch (error) {
      console.error("Error generating trophies:", error);
      res.status(500).json({ message: "Failed to generate trophies" });
    }
  });
  async function generateTrophiesForMonth(month, year) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);
    const allMatches = await storage.getAllMatches();
    const monthlyMatches = allMatches.filter((m) => {
      const matchDate = new Date(m.date);
      return matchDate >= firstDay && matchDate <= lastDay;
    });
    if (monthlyMatches.length === 0) return [];
    const allUsers = await storage.getAllUsers();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));
    const playerStats = {};
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
            seenMatches: /* @__PURE__ */ new Set()
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
    const qualifiedStats = Object.values(playerStats).filter((s) => {
      if (s.matchesPlayed < 3) return false;
      const u = userMap.get(s.userId);
      return !!u && !u.isBanned && !u.isCheaterBanned;
    });
    if (qualifiedStats.length === 0) return [];
    await storage.deleteTrophiesByMonthYear(month, year);
    const createdTrophies = [];
    const monthNames = ["Janeiro", "Fevereiro", "Mar\xE7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthName = monthNames[month - 1];
    for (const def of TROPHY_DEFINITIONS) {
      try {
        const winner = def.getWinner(qualifiedStats);
        if (winner) {
          const userExists = await storage.getUser(winner.userId);
          if (!userExists) {
            console.warn(`[Auto Trophy] Skipping ${def.type}: userId ${winner.userId} not found in users table, picking next qualified player...`);
            const remaining = qualifiedStats.filter((s) => s.userId !== winner.userId);
            const nextWinner = remaining.length > 0 ? def.getWinner(remaining) : null;
            if (nextWinner) {
              const nextUserExists = await storage.getUser(nextWinner.userId);
              if (nextUserExists) {
                const trophy2 = await storage.createTrophy({
                  userId: nextWinner.userId,
                  type: def.type,
                  month,
                  year,
                  title: `${def.title} - ${monthName}/${year}`,
                  description: def.description,
                  value: nextWinner.value
                });
                createdTrophies.push(trophy2);
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
            value: winner.value
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
      const now = /* @__PURE__ */ new Date();
      const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const existingTrophies = await storage.getAllTrophies();
      const hasPrevMonthTrophies = existingTrophies.some(
        (t) => t.month === prevMonth && t.year === prevYear
      );
      if (!hasPrevMonthTrophies) {
        console.log(`[Auto Trophy] No trophies found for ${prevMonth}/${prevYear}, generating...`);
        const trophies2 = await generateTrophiesForMonth(prevMonth, prevYear);
        if (trophies2.length > 0) {
          console.log(`[Auto Trophy] Generated ${trophies2.length} trophies for ${prevMonth}/${prevYear}`);
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
    setTimeout(() => checkAndGenerateMonthlyTrophies(), 5e3);
    setInterval(() => checkAndGenerateMonthlyTrophies(), 24 * 60 * 60 * 1e3);
  }
  app2.get("/api/casino/balance", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getOrCreateCasinoBalance(userId);
      res.json(balance);
    } catch (error) {
      console.error("Error getting casino balance:", error);
      res.status(500).json({ message: "Failed to get balance" });
    }
  });
  app2.get("/api/casino/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getCasinoTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error getting transactions:", error);
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });
  app2.get("/api/casino/bets", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBets = await storage.getUserBets(userId);
      res.json(userBets);
    } catch (error) {
      console.error("Error getting bets:", error);
      res.status(500).json({ message: "Failed to get bets" });
    }
  });
  app2.post("/api/casino/calculate-odds", isAuthenticated, async (req, res) => {
    try {
      const { targetPlayerId, items } = req.body;
      const targetPlayer = await storage.getUser(targetPlayerId);
      if (!targetPlayer) {
        return res.status(404).json({ message: "Jogador n\xE3o encontrado" });
      }
      const totalMatches = targetPlayer.totalMatches || 1;
      const avgKills = (targetPlayer.totalKills || 0) / totalMatches;
      const avgDeaths = (targetPlayer.totalDeaths || 0) / totalMatches;
      const avgKD = avgDeaths > 0 ? avgKills / avgDeaths : avgKills;
      const avgHeadshots = (targetPlayer.totalHeadshots || 0) / totalMatches;
      const avgMvps = (targetPlayer.totalMvps || 0) / totalMatches;
      const avgDamage = (targetPlayer.totalDamage || 0) / totalMatches;
      const winRate = totalMatches > 0 ? (targetPlayer.matchesWon || 0) / totalMatches * 100 : 50;
      const calculatedItems = items.map((item) => {
        let odds = 1.5;
        switch (item.betType) {
          case "kills_over":
            const killsDiff = item.targetValue - avgKills;
            odds = Math.max(1.1, 1.5 + killsDiff * 0.15);
            break;
          case "kills_under":
            const killsUnderDiff = avgKills - item.targetValue;
            odds = Math.max(1.1, 1.5 + killsUnderDiff * 0.15);
            break;
          case "deaths_under":
            const deathsDiff = avgDeaths - item.targetValue;
            odds = Math.max(1.1, 1.5 + deathsDiff * 0.2);
            break;
          case "kd_over":
            const kdDiff = item.targetValue - avgKD;
            odds = Math.max(1.1, 1.5 + kdDiff * 0.5);
            break;
          case "headshots_over":
            const hsDiff = item.targetValue - avgHeadshots;
            odds = Math.max(1.1, 1.5 + hsDiff * 0.1);
            break;
          case "mvps_over":
            const mvpDiff = item.targetValue - avgMvps;
            odds = Math.max(1.1, 2 + mvpDiff * 0.8);
            break;
          case "damage_over":
            const dmgDiff = (item.targetValue - avgDamage) / 100;
            odds = Math.max(1.1, 1.5 + dmgDiff * 0.3);
            break;
          case "win":
            odds = winRate > 50 ? Math.max(1.1, 1.5 + (100 - winRate) / 50) : Math.max(1.1, 1.5 + winRate / 50);
            break;
        }
        return {
          ...item,
          odds: Math.round(odds * 100) / 100
          // Round to 2 decimal places
        };
      });
      res.json({
        player: {
          id: targetPlayer.id,
          nickname: targetPlayer.nickname || targetPlayer.firstName,
          avgKills: Math.round(avgKills * 10) / 10,
          avgKD: Math.round(avgKD * 100) / 100,
          avgHeadshots: Math.round(avgHeadshots * 10) / 10,
          winRate: Math.round(winRate)
        },
        items: calculatedItems,
        totalOdds: Math.round(calculatedItems.reduce((acc, item) => acc * item.odds, 1) * 100) / 100
      });
    } catch (error) {
      console.error("Error calculating odds:", error);
      res.status(500).json({ message: "Failed to calculate odds" });
    }
  });
  app2.post("/api/casino/bets", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { targetPlayerId, amount, items } = req.body;
      if (amount < 10) {
        return res.status(400).json({ message: "Aposta m\xEDnima \xE9 R$10" });
      }
      if (targetPlayerId === userId) {
        return res.status(400).json({ message: "Voc\xEA n\xE3o pode apostar em voc\xEA mesmo!" });
      }
      const targetPlayer = await storage.getUser(targetPlayerId);
      if (!targetPlayer) {
        return res.status(404).json({ message: "Jogador n\xE3o encontrado" });
      }
      const totalMatches = targetPlayer.totalMatches || 1;
      const avgKills = (targetPlayer.totalKills || 0) / totalMatches;
      const avgDeaths = (targetPlayer.totalDeaths || 0) / totalMatches;
      const avgKD = avgDeaths > 0 ? avgKills / avgDeaths : avgKills;
      const avgHeadshots = (targetPlayer.totalHeadshots || 0) / totalMatches;
      const avgMvps = (targetPlayer.totalMvps || 0) / totalMatches;
      const avgDamage = (targetPlayer.totalDamage || 0) / totalMatches;
      const winRate = totalMatches > 0 ? (targetPlayer.matchesWon || 0) / totalMatches * 100 : 50;
      const itemsWithOdds = items.map((item) => {
        let odds = 1.5;
        switch (item.betType) {
          case "kills_over":
            odds = Math.max(1.1, 1.5 + (item.targetValue - avgKills) * 0.15);
            break;
          case "kills_under":
            odds = Math.max(1.1, 1.5 + (avgKills - item.targetValue) * 0.15);
            break;
          case "deaths_under":
            odds = Math.max(1.1, 1.5 + (avgDeaths - item.targetValue) * 0.2);
            break;
          case "kd_over":
            odds = Math.max(1.1, 1.5 + (item.targetValue - avgKD) * 0.5);
            break;
          case "headshots_over":
            odds = Math.max(1.1, 1.5 + (item.targetValue - avgHeadshots) * 0.1);
            break;
          case "mvps_over":
            odds = Math.max(1.1, 2 + (item.targetValue - avgMvps) * 0.8);
            break;
          case "damage_over":
            odds = Math.max(1.1, 1.5 + (item.targetValue - avgDamage) / 100 * 0.3);
            break;
          case "win":
            odds = winRate > 50 ? Math.max(1.1, 1.5 + (100 - winRate) / 50) : Math.max(1.1, 1.5 + winRate / 50);
            break;
        }
        return {
          ...item,
          odds: Math.round(odds * 100) / 100
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
  app2.delete("/api/casino/bets/:betId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { betId } = req.params;
      const result = await storage.deleteBet(betId, userId);
      if (!result.success) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel cancelar a aposta. Apenas apostas pendentes podem ser canceladas." });
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
  app2.post("/api/casino/slot", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;
      if (amount < 10) {
        return res.status(400).json({ message: "Aposta m\xEDnima \xE9 R$10" });
      }
      const balance = await storage.getOrCreateCasinoBalance(userId);
      if (balance.balance < amount) {
        return res.status(400).json({ message: "Saldo insuficiente" });
      }
      const won = Math.random() < 0.1;
      let multiplier = 0;
      let result = "lost";
      if (won) {
        multiplier = Math.random() < 0.8 ? 2 + Math.random() * 8 : 10 + Math.random() * 40;
        multiplier = Math.round(multiplier * 10) / 10;
        result = "won";
      }
      const winnings = won ? amount * multiplier : 0;
      const netResult = winnings - amount;
      await storage.updateCasinoBalance(
        userId,
        netResult,
        won ? "slot_win" : "slot_loss",
        won ? `Tigrinho: Ganhou ${multiplier}x! (R$${winnings.toLocaleString("pt-BR")})` : `Tigrinho: Perdeu R$${amount.toLocaleString("pt-BR")}`
      );
      const newBalance = await storage.getCasinoBalance(userId);
      res.json({
        won,
        multiplier,
        betAmount: amount,
        winnings,
        newBalance: newBalance?.balance || 0,
        symbols: generateSlotSymbols(won)
        // Visual symbols for frontend
      });
    } catch (error) {
      console.error("Error playing slot:", error);
      res.status(500).json({ message: "Erro no jogo" });
    }
  });
  app2.post("/api/casino/case", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { caseType } = req.body;
      const casePrices = {
        "basic": 5e3,
        "premium": 25e3,
        "elite": 1e5,
        "legendary": 5e5
      };
      const price = casePrices[caseType] || casePrices.basic;
      const balance = await storage.getOrCreateCasinoBalance(userId);
      if (balance.balance < price) {
        return res.status(400).json({ message: "Saldo insuficiente para abrir essa caixa" });
      }
      const roll = Math.random() * 100;
      let rarity;
      let multiplier;
      if (roll < 40) {
        rarity = "Consumidor";
        multiplier = 0.1 + Math.random() * 0.8;
      } else if (roll < 70) {
        rarity = "Industrial";
        multiplier = 2 + Math.random() * 3;
      } else if (roll < 88) {
        rarity = "Militar";
        multiplier = 5 + Math.random() * 10;
      } else if (roll < 96) {
        rarity = "Restrito";
        multiplier = 15 + Math.random() * 15;
      } else if (roll < 99.5) {
        rarity = "Secreto";
        multiplier = 30 + Math.random() * 20;
      } else {
        rarity = "Faca/Luva";
        multiplier = 50;
      }
      multiplier = Math.round(multiplier * 100) / 100;
      const value = Math.round(price * multiplier);
      const netResult = value - price;
      const skins = generateRandomSkin(rarity);
      await storage.updateCasinoBalance(
        userId,
        netResult,
        "case_opening",
        `Caixa ${caseType}: ${skins.name} (${rarity}) - R$${value.toLocaleString("pt-BR")}`
      );
      const newBalance = await storage.getCasinoBalance(userId);
      res.json({
        item: {
          name: skins.name,
          rarity,
          value,
          multiplier,
          weapon: skins.weapon,
          skin: skins.skin
        },
        casePrice: price,
        profit: netResult,
        newBalance: newBalance?.balance || 0
      });
    } catch (error) {
      console.error("Error opening case:", error);
      res.status(500).json({ message: "Erro ao abrir caixa" });
    }
  });
  app2.get("/api/mix/availability/:date", isAuthenticated, async (req, res) => {
    try {
      const { date } = req.params;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Data inv\xE1lida. Use o formato YYYY-MM-DD" });
      }
      const list = await storage.getMixList(date);
      res.json(list);
    } catch (error) {
      console.error("Error fetching mix list:", error);
      res.status(500).json({ message: "Erro ao buscar lista do mix" });
    }
  });
  app2.post("/api/mix/availability/join", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const joinSchema = import_zod2.z.object({
        listDate: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        isSub: import_zod2.z.boolean().optional().default(false)
      });
      const parsed = joinSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      let { listDate, isSub } = parsed.data;
      const penaltyCount = await storage.getActivePenaltyCount(userId);
      if (penaltyCount >= 3) {
        return res.status(403).json({
          message: "Voc\xEA est\xE1 suspenso por 1 lista devido a faltas repetidas. Aguarde a pr\xF3xima lista.",
          penaltyCount,
          suspended: true
        });
      }
      if (penaltyCount >= 1 && !isSub) {
        isSub = true;
      }
      const entry = await storage.joinMixList(userId, listDate, isSub);
      if (!entry) {
        return res.status(400).json({ message: "Voc\xEA j\xE1 est\xE1 na lista deste dia" });
      }
      res.json({ ...entry, forcedSub: penaltyCount >= 1 && !parsed.data.isSub });
    } catch (error) {
      console.error("Error joining mix list:", error);
      res.status(500).json({ message: "Erro ao entrar na lista" });
    }
  });
  app2.post("/api/mix/availability/leave", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const leaveSchema = import_zod2.z.object({
        listDate: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
      });
      const parsed = leaveSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      const { listDate } = parsed.data;
      const success = await storage.leaveMixList(userId, listDate);
      if (!success) {
        return res.status(400).json({ message: "Voc\xEA n\xE3o est\xE1 na lista deste dia" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error leaving mix list:", error);
      res.status(500).json({ message: "Erro ao sair da lista" });
    }
  });
  app2.post("/api/mix/availability/admin-add", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user.claims.sub;
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem adicionar jogadores na lista" });
      }
      const addSchema = import_zod2.z.object({
        listDate: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        userId: import_zod2.z.string().min(1),
        isSub: import_zod2.z.boolean().optional().default(false)
      });
      const parsed = addSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      const { listDate, userId, isSub } = parsed.data;
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const entry = await storage.joinMixList(userId, listDate, isSub);
      if (!entry) {
        return res.status(400).json({ message: "Jogador j\xE1 est\xE1 na lista deste dia" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error admin adding to mix list:", error);
      res.status(500).json({ message: "Erro ao adicionar jogador na lista" });
    }
  });
  app2.post("/api/mix/availability/admin-remove", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user.claims.sub;
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem remover jogadores da lista" });
      }
      const removeSchema = import_zod2.z.object({
        listDate: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        userId: import_zod2.z.string().min(1)
      });
      const parsed = removeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      const success = await storage.leaveMixList(parsed.data.userId, parsed.data.listDate);
      if (!success) {
        return res.status(400).json({ message: "Jogador n\xE3o est\xE1 na lista deste dia" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error admin removing from mix list:", error);
      res.status(500).json({ message: "Erro ao remover jogador da lista" });
    }
  });
  app2.get("/api/mix/penalties", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.post("/api/mix/penalties", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user.claims.sub;
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem aplicar penalidades" });
      }
      const penaltySchema = import_zod2.z.object({
        userId: import_zod2.z.string(),
        listDate: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
      });
      const parsed = penaltySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      const penalty = await storage.addPenalty(parsed.data.userId, parsed.data.listDate);
      res.json(penalty);
    } catch (error) {
      console.error("Error adding penalty:", error);
      res.status(500).json({ message: "Erro ao aplicar penalidade" });
    }
  });
  app2.get("/api/mix/penalties/:userId", isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const penalties = await storage.getUserPenalties(userId);
      const count = penalties.length;
      res.json({
        penalties,
        count,
        forcedSub: count >= 1 && count < 3,
        suspended: count >= 3
      });
    } catch (error) {
      console.error("Error fetching penalties:", error);
      res.status(500).json({ message: "Erro ao buscar penalidades" });
    }
  });
  app2.post("/api/mix/confirm-played", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem confirmar a lista" });
      }
      const confirmSchema = import_zod2.z.object({
        listDate: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        playedUserIds: import_zod2.z.array(import_zod2.z.string())
      });
      const parsed = confirmSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      const { listDate, playedUserIds } = parsed.data;
      const listUserIds = await storage.getMixListUserIds(listDate);
      const playedSet = new Set(playedUserIds);
      const noShowUsers = [];
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
        noShowUserIds: noShowUsers
      });
    } catch (error) {
      console.error("Error confirming mix list:", error);
      res.status(500).json({ message: "Erro ao confirmar lista" });
    }
  });
  app2.delete("/api/mix/penalties/:userId", isAuthenticated, async (req, res) => {
    try {
      const adminId = req.user.claims.sub;
      const currentUser = await storage.getUser(adminId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem limpar penalidades" });
      }
      const { userId } = req.params;
      await db.delete(mixPenalties).where((0, import_drizzle_orm4.eq)(mixPenalties.userId, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing penalties:", error);
      res.status(500).json({ message: "Erro ao limpar penalidades" });
    }
  });
  app2.get("/api/stats/monthly/:year/:month", isAuthenticated, async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "M\xEAs ou ano inv\xE1lido" });
      }
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59);
      const allMatches = await storage.getAllMatches();
      const monthlyMatches = allMatches.filter((m) => {
        const matchDate = new Date(m.date);
        return matchDate >= firstDayOfMonth && matchDate <= lastDayOfMonth;
      });
      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map((u) => [u.id, u]));
      const playerStats = {};
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
              seenMatches: /* @__PURE__ */ new Set()
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
      const playerMonthlyLP = {};
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
          const kills = Number(stat.kills) || 0;
          const damage = Number(stat.damage) || 0;
          const rounds = matchRounds || 24;
          const entryWins = Number(stat.entryWins) || 0;
          const entryCount = Number(stat.entryCount) || 0;
          const utilityDamage = Number(stat.utilityDamage) || 0;
          const enemiesFlashed = Number(stat.enemiesFlashed) || 0;
          const v1Wins = Number(stat.v1Wins) || 0;
          const v2Wins = Number(stat.v2Wins) || 0;
          const lp = calcMatchLP(wonMatch, kills, damage, rounds, entryWins, entryCount, utilityDamage, enemiesFlashed, v1Wins, v2Wins);
          playerMonthlyLP[stat.userId] = (playerMonthlyLP[stat.userId] ?? 0) + lp;
        }
      }
      const result = Object.values(playerStats).map((ps) => {
        const user = userMap.get(ps.userId);
        const { seenMatches, ...statsWithoutSet } = ps;
        return {
          ...statsWithoutSet,
          monthlyLevelPoints: playerMonthlyLP[ps.userId] ?? 0,
          user: user ? {
            id: user.id,
            nickname: user.nickname,
            firstName: user.firstName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            steamId64: user.steamId64,
            levelPoints: user.levelPoints
          } : null
        };
      }).filter((p) => p.user !== null);
      const monthDate = new Date(year, month - 1, 1);
      res.json({
        month,
        year,
        monthName: monthDate.toLocaleString("pt-BR", { month: "long" }),
        players: result
      });
    } catch (error) {
      console.error("Error fetching monthly stats by date:", error);
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });
  app2.get("/api/news", isAuthenticated, async (req, res) => {
    try {
      const allNews = await storage.getAllNews();
      res.json(allNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Erro ao buscar not\xEDcias" });
    }
  });
  app2.post("/api/news", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem publicar not\xEDcias" });
      }
      const newsSchema = import_zod2.z.object({
        title: import_zod2.z.string().min(1, "T\xEDtulo obrigat\xF3rio").max(200),
        content: import_zod2.z.string().min(1, "Conte\xFAdo obrigat\xF3rio").max(2e3),
        notifyDiscord: import_zod2.z.boolean().optional().default(true),
        mentionEveryone: import_zod2.z.boolean().optional().default(false)
      });
      const parsed = newsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Dados inv\xE1lidos" });
      }
      const item = await storage.createNews(userId, parsed.data.title, parsed.data.content);
      if (parsed.data.notifyDiscord) {
        const newsChannelId = getNewsChannelId();
        sendNewsNotification(parsed.data.title, parsed.data.content, parsed.data.mentionEveryone, newsChannelId || void 0).then((r) => {
          if (!r.ok) console.warn("[Discord] Notifica\xE7\xE3o autom\xE1tica falhou:", r.error);
        }).catch(() => {
        });
      }
      res.json(item);
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(500).json({ message: "Erro ao criar not\xEDcia" });
    }
  });
  app2.delete("/api/news/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Apenas admins podem deletar not\xEDcias" });
      }
      const success = await storage.deleteNews(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Not\xEDcia n\xE3o encontrada" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Erro ao deletar not\xEDcia" });
    }
  });
  let registrationClosed = false;
  app2.get("/api/copa/registration-status", isAuthenticated, (_req, res) => {
    res.json({ closed: registrationClosed });
  });
  app2.post("/api/copa/close-registration", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      registrationClosed = !registrationClosed;
      res.json({ closed: registrationClosed });
    } catch (e) {
      res.status(500).json({ message: "Erro ao atualizar status" });
    }
  });
  app2.post("/api/copa/draw", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const teams = await storage.getAllCopaTeams();
      const confirmed = teams.filter((t) => t.status === "confirmed");
      if (confirmed.length < 2) {
        return res.status(400).json({ message: "Necess\xE1rio ao menos 2 times confirmados para o sorteio" });
      }
      const count = confirmed.length;
      let roundName = "Round 1";
      if (count >= 16) roundName = "Oitavas de Final";
      else if (count >= 8) roundName = "Quartas de Final";
      else if (count >= 4) roundName = "Semifinal";
      else roundName = "Final";
      const shuffled = [...confirmed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const scheduledAt = req.body.scheduledAt ? new Date(req.body.scheduledAt) : /* @__PURE__ */ new Date("2026-04-18T14:00:00-03:00");
      const created = [];
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        const match = await storage.createCopaMatch({
          round: roundName,
          roundNumber: Math.floor(i / 2) + 1,
          team1Id: shuffled[i].id,
          team2Id: shuffled[i + 1].id,
          scheduledAt
        });
        created.push(match);
      }
      res.json({ matches: created, round: roundName });
    } catch (e) {
      console.error("Draw error:", e);
      res.status(500).json({ message: "Erro ao realizar sorteio" });
    }
  });
  app2.get("/api/copa/teams", async (req, res) => {
    try {
      const teams = await storage.getAllCopaTeams();
      res.json(teams);
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar times" });
    }
  });
  app2.get("/api/copa/matches", async (req, res) => {
    try {
      const matches2 = await storage.getCopaMatches();
      res.json(matches2);
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar partidas" });
    }
  });
  app2.get("/api/copa/stats", async (req, res) => {
    try {
      const stats = await storage.getAllCopaStats();
      const teams = await storage.getAllCopaTeams();
      res.json({ stats, teams });
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar estat\xEDsticas" });
    }
  });
  app2.post("/api/copa/teams", isAuthenticated, async (req, res) => {
    try {
      const { teamName, leaderName, leaderContact, paymentProof, players } = req.body;
      if (!teamName?.trim() || !leaderName?.trim() || !leaderContact?.trim()) {
        return res.status(400).json({ message: "Nome do time, l\xEDder e contato s\xE3o obrigat\xF3rios" });
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
  app2.patch("/api/copa/teams/:id/status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const { status, adminNotes } = req.body;
      const team = await storage.updateCopaTeamStatus(Number(req.params.id), status, adminNotes);
      res.json(team);
    } catch (e) {
      res.status(500).json({ message: "Erro ao atualizar status" });
    }
  });
  app2.patch("/api/copa/teams/:id/edit", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims?.sub ?? req.user?.id;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const teamId = Number(req.params.id);
      const { teamName, leaderName, leaderContact, paymentProof, players } = req.body;
      const team = await storage.updateCopaTeam(teamId, {
        teamName,
        leaderName,
        leaderContact,
        ...paymentProof !== void 0 ? { paymentProof } : {}
      });
      let updatedPlayers = [];
      if (Array.isArray(players)) {
        updatedPlayers = await storage.updateCopaPlayers(teamId, players.map((p, i) => ({
          playerName: p.playerName,
          steamProfile: p.steamProfile ?? "",
          age: Number(p.age) || 0,
          position: p.position ?? "Rifler",
          gcLevel: p.gcLevel ? Number(p.gcLevel) : null,
          faceitLevel: p.faceitLevel ? Number(p.faceitLevel) : null,
          isLeader: i === 0,
          playerOrder: i
        })));
      }
      res.json({ ...team, players: updatedPlayers });
    } catch (e) {
      console.error("Erro ao editar time:", e);
      res.status(500).json({ message: "Erro ao editar time" });
    }
  });
  app2.post("/api/copa/matches", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const { round, roundNumber, team1Id, team2Id, scheduledAt, streamUrl, notes } = req.body;
      const match = await storage.createCopaMatch({
        round,
        roundNumber,
        team1Id: team1Id || void 0,
        team2Id: team2Id || void 0,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : void 0,
        streamUrl,
        notes
      });
      res.json(match);
    } catch (e) {
      res.status(500).json({ message: "Erro ao criar partida" });
    }
  });
  app2.patch("/api/copa/matches/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      const { team1Score, team2Score, winnerId, mapName, streamUrl, notes, isFinished, scheduledAt, stats } = req.body;
      const match = await storage.updateCopaMatch(Number(req.params.id), {
        team1Score,
        team2Score,
        winnerId,
        mapName,
        streamUrl,
        notes,
        isFinished,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : void 0
      });
      if (stats && Array.isArray(stats)) {
        await storage.setCopaMatchStats(match.id, stats);
      }
      res.json(match);
    } catch (e) {
      res.status(500).json({ message: "Erro ao atualizar partida" });
    }
  });
  app2.get("/api/copa/matches/:id/stats", async (req, res) => {
    try {
      const stats = await storage.getCopaMatchStats(Number(req.params.id));
      res.json(stats);
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar stats" });
    }
  });
  app2.delete("/api/copa/teams/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Apenas admins" });
      await storage.updateCopaTeamStatus(Number(req.params.id), "rejected", "Removido pelo admin");
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Erro ao remover time" });
    }
  });
  app2.get("/api/survey", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const survey = await storage.getSurveyByUserId(userId);
      res.json(survey || null);
    } catch (error) {
      console.error("Error fetching survey:", error);
      res.status(500).json({ message: "Erro ao buscar pesquisa" });
    }
  });
  app2.post("/api/survey", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        bestPlayTimes,
        faceitLevel,
        gcLevel,
        valveLevel,
        improvementSuggestions,
        reasonNotPlaying,
        attractMorePlayers,
        playMoreWays,
        generalOpinions,
        levelUpInfluenced,
        levelUpInfluencedComment
      } = req.body;
      if (!bestPlayTimes || bestPlayTimes.length === 0) {
        return res.status(400).json({ message: "Selecione pelo menos um hor\xE1rio dispon\xEDvel" });
      }
      if (faceitLevel === void 0 || faceitLevel === null) {
        return res.status(400).json({ message: "Informe seu n\xEDvel FACEIT" });
      }
      if (gcLevel === void 0 || gcLevel === null) {
        return res.status(400).json({ message: "Informe seu n\xEDvel Gamers Club" });
      }
      if (!valveLevel?.trim()) {
        return res.status(400).json({ message: "Informe seu n\xEDvel Valve" });
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
        return res.status(400).json({ message: "Responda sobre suas opini\xF5es gerais" });
      }
      if (!levelUpInfluenced) {
        return res.status(400).json({ message: "Responda se a subida de n\xEDvel dos jogadores influenciou a galera a parar de jogar" });
      }
      if (levelUpInfluenced === "yes" && !levelUpInfluencedComment?.trim()) {
        return res.status(400).json({ message: "Explique como a subida de n\xEDvel influenciou" });
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
        levelUpInfluencedComment: levelUpInfluencedComment || null
      });
      res.json(survey);
    } catch (error) {
      console.error("Error saving survey:", error);
      res.status(500).json({ message: "Erro ao salvar pesquisa" });
    }
  });
  app2.get("/api/admin/surveys", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app2.get("/api/discord/status", isAuthenticated, async (req, res) => {
    res.json({
      connected: isDiscordReady(),
      error: getLastError(),
      inviteUrl: getBotInviteUrl()
    });
  });
  app2.post("/api/discord/link", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "N\xE3o autenticado" });
    const schema = import_zod2.z.object({ discordUserId: import_zod2.z.string().min(15).max(32) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "ID do Discord inv\xE1lido" });
    const { discordUserId } = parsed.data;
    const existing = await storage.getUserByDiscordId(discordUserId);
    if (existing && existing.id !== userId) {
      return res.status(409).json({ message: "Este ID do Discord j\xE1 est\xE1 vinculado a outra conta" });
    }
    await db.update(users).set({ discordUserId }).where((0, import_drizzle_orm4.eq)(users.id, userId));
    const updated = await storage.getUser(userId);
    res.json(updated);
  });
  app2.delete("/api/discord/link", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "N\xE3o autenticado" });
    await db.update(users).set({ discordUserId: null }).where((0, import_drizzle_orm4.eq)(users.id, userId));
    res.json({ success: true });
  });
  app2.get("/api/push/vapid-public-key", async (_req, res) => {
    let key = getPublicKey();
    if (!key) {
      await initPush();
      key = getPublicKey();
    }
    res.json({ publicKey: key });
  });
  app2.post("/api/push/subscribe", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: "N\xE3o autenticado" });
    const schema = import_zod2.z.object({
      endpoint: import_zod2.z.string().url(),
      p256dh: import_zod2.z.string().min(1),
      auth: import_zod2.z.string().min(1),
      userAgent: import_zod2.z.string().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inv\xE1lidos" });
    const { endpoint, p256dh, auth, userAgent } = parsed.data;
    await db.insert(pushSubscriptions).values({ userId, endpoint, p256dh, auth, userAgent: userAgent ?? null }).onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId, p256dh, auth, userAgent: userAgent ?? null }
    });
    res.json({ success: true });
  });
  app2.post("/api/push/unsubscribe", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: "N\xE3o autenticado" });
    const schema = import_zod2.z.object({ endpoint: import_zod2.z.string().url() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inv\xE1lidos" });
    await db.delete(pushSubscriptions).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.eq)(pushSubscriptions.endpoint, parsed.data.endpoint), (0, import_drizzle_orm4.eq)(pushSubscriptions.userId, userId)));
    res.json({ success: true });
  });
  app2.post("/api/mix/push-notify", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub ?? req.user?.id;
    const currentUser = await storage.getUser(userId);
    if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });
    const schema = import_zod2.z.object({
      title: import_zod2.z.string().min(1).max(120).optional(),
      body: import_zod2.z.string().min(1).max(300).optional(),
      url: import_zod2.z.string().optional()
    });
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ message: "Dados inv\xE1lidos" });
    const result = await sendPushToAll({
      title: parsed.data.title ?? "Lista do Mix aberta!",
      body: parsed.data.body ?? "A lista de hoje est\xE1 aberta. Garanta sua vaga agora!",
      url: parsed.data.url ?? "/mix/disponibilidade",
      tag: "mix-list-open"
    });
    res.json({ success: true, ...result });
  });
  app2.get("/api/admin/report", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const currentUser = await storage.getUser(userId);
      if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });
      const all = await storage.getAllUsers(true);
      const subs = await db.select().from(pushSubscriptions);
      const pushUserIds = new Set(subs.map((s) => s.userId).filter(Boolean));
      const slim = (u) => ({
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
        hasDiscord: !!u.discordUserId
      });
      const enriched = all.map(slim);
      const mostActive = [...enriched].filter((u) => u.totalMatches > 0).sort((a, b) => b.totalMatches - a.totalMatches).slice(0, 50);
      const neverPlayed = enriched.filter((u) => u.totalMatches === 0).sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));
      const discordEnabled = enriched.filter((u) => u.hasDiscord).sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));
      const pushEnabled = enriched.filter((u) => u.hasPush).sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));
      const inactive = [...enriched].filter((u) => !u.isBanned).sort((a, b) => {
        const ta = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const tb = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        return ta - tb;
      }).slice(0, 50);
      const now = /* @__PURE__ */ new Date();
      const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startCurr = new Date(now.getFullYear(), now.getMonth(), 1);
      const prevMonthLabel = startPrev.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const daysRows = await db.select({
        userId: matchStats.userId,
        daysPlayed: import_drizzle_orm4.sql`count(distinct date_trunc('day', ${matches.date}))`,
        matchesPlayed: import_drizzle_orm4.sql`count(distinct ${matches.id})`
      }).from(matchStats).innerJoin(matches, (0, import_drizzle_orm4.eq)(matchStats.matchId, matches.id)).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.gte)(matches.date, startPrev), (0, import_drizzle_orm4.lt)(matches.date, startCurr))).groupBy(matchStats.userId);
      const userById = new Map(enriched.map((u) => [u.id, u]));
      const daysPlayedPrevMonth = daysRows.map((r) => {
        const u = userById.get(r.userId);
        if (!u) return null;
        return { ...u, daysPlayed: Number(r.daysPlayed), matchesPlayed: Number(r.matchesPlayed) };
      }).filter((x) => x !== null).sort((a, b) => b.daysPlayed - a.daysPlayed || b.matchesPlayed - a.matchesPlayed);
      res.json({
        totals: {
          totalUsers: enriched.length,
          neverPlayed: neverPlayed.length,
          discordEnabled: discordEnabled.length,
          pushEnabled: pushEnabled.length,
          pushSubscriptions: subs.length
        },
        mostActive,
        neverPlayed,
        discordEnabled,
        pushEnabled,
        inactive,
        prevMonthLabel,
        daysPlayedPrevMonth
      });
    } catch (err) {
      console.error("[admin/report] erro:", err);
      res.status(500).json({ message: err.message || "Erro ao gerar relat\xF3rio" });
    }
  });
  app2.post("/api/discord/mix-notify", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    const currentUser = await storage.getUser(userId);
    if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });
    const schema = import_zod2.z.object({
      date: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      message: import_zod2.z.string().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inv\xE1lidos" });
    const result = await sendMixNotification(parsed.data.date, parsed.data.message);
    if (result.ok) {
      res.json({ success: true, message: "Notifica\xE7\xE3o enviada ao Discord!" });
    } else {
      res.status(503).json({ message: result.error || "Falha ao enviar notifica\xE7\xE3o" });
    }
  });
  app2.post("/api/discord/notify", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    const currentUser = await storage.getUser(userId);
    if (!currentUser?.isAdmin) return res.status(403).json({ message: "Acesso negado" });
    const schema = import_zod2.z.object({
      title: import_zod2.z.string().min(1).max(200),
      description: import_zod2.z.string().min(1).max(2e3),
      mentionEveryone: import_zod2.z.boolean().optional().default(false)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Dados inv\xE1lidos" });
    const result = await sendNewsNotification(parsed.data.title, parsed.data.description, parsed.data.mentionEveryone);
    if (result.ok) {
      res.json({ success: true, message: "Notifica\xE7\xE3o enviada ao Discord!" });
    } else {
      res.status(503).json({ message: result.error || "Falha ao enviar notifica\xE7\xE3o" });
    }
  });
  function calcPlayerPrice(levelPoints) {
    const level = Math.max(1, Math.min(21, Math.floor(Math.max(0, levelPoints) / 100) + 1));
    return Math.max(5, Math.min(40, Math.round(5 + (level - 1) / 20 * 35)));
  }
  function calcMatchLP(won, kills, damage, rounds, entryWins, entryCount, utilityDamage, enemiesFlashed, v1Wins, v2Wins, mvps = 0, enemy5ks = 0, enemy4ks = 0) {
    const r = Math.max(rounds, 1);
    const kpr = kills / r;
    const adr = damage / r;
    const entrySuccess = entryCount > 0 ? entryWins / entryCount : 0;
    const utility = (utilityDamage + enemiesFlashed * 7.5) / r;
    const ri = kpr * 0.35 + adr / 100 * 0.35 + entrySuccess * 0.15 + utility * 0.15;
    let lp = 0;
    if (won) {
      if (ri > 1.3) lp = 25;
      else if (ri >= 1) lp = 18;
      else lp = 10;
    } else {
      if (ri > 1.3) lp = -2;
      else if (ri >= 1) lp = -10;
      else lp = -20;
    }
    lp += v1Wins * 2;
    lp += v2Wins * 3;
    lp += mvps * 5;
    lp += enemy5ks * 5;
    lp += enemy4ks * 3;
    return Math.max(-20, Math.min(40, lp));
  }
  function isMarketOpen(roundStartDate) {
    const now = /* @__PURE__ */ new Date();
    const start = new Date(roundStartDate);
    const monday = new Date(start);
    monday.setUTCHours(0, 0, 0, 0);
    const dow = monday.getUTCDay();
    const daysToMonday = dow === 0 ? -6 : 1 - dow;
    monday.setUTCDate(monday.getUTCDate() + daysToMonday);
    const marketClose = new Date(monday);
    marketClose.setUTCHours(19, 0, 0, 0);
    if (start > marketClose) {
      marketClose.setUTCDate(marketClose.getUTCDate() + 7);
    }
    return now < marketClose;
  }
  function calcFantasyPoints(stat) {
    let pts = 0;
    const kills = stat.kills || 0;
    const deaths = stat.deaths || 0;
    const assists = stat.assists || 0;
    const fiveK = stat.fiveK || 0;
    const fourK = stat.fourK || 0;
    const threeK = stat.threeK || 0;
    const twoK = stat.twoK || 0;
    const damage = stat.damage || 0;
    const headshots = stat.headshots || 0;
    const clutch1v1 = stat.clutch1v1 || 0;
    const clutch1v2 = stat.clutch1v2 || 0;
    const firstKills = stat.firstKills || 0;
    const isMvp = stat.isMvp ? 1 : 0;
    const wonMatch = stat.wonMatch;
    pts += kills * 1;
    pts -= deaths * 1;
    pts += assists * 1;
    pts += fiveK * 8;
    pts += fourK * 5;
    pts += threeK * 3;
    pts += twoK * 1;
    pts += clutch1v1 * 5;
    pts += clutch1v2 * 8;
    pts += firstKills * 1.5;
    pts += isMvp * 4;
    if (wonMatch === true) pts += 3;
    else if (wonMatch === false) pts -= 5;
    const kd = deaths > 0 ? kills / deaths : kills;
    if (kd >= 1.2) {
      const kdBonus = 5 + Math.min(1, (kd - 1.2) / (2.5 - 1.2)) * 5;
      pts += Math.min(10, kdBonus);
    } else if (kd >= 0.9) {
      pts += 2;
    } else {
      const kdPenalty = -1 - Math.min(1, (0.9 - kd) / 0.9) * 5;
      pts += Math.max(-6, kdPenalty);
    }
    const hsPct = kills > 0 ? headshots / kills * 100 : 0;
    if (hsPct > 50) {
      const hsBonus = 2 + Math.min(1, (hsPct - 50) / 50) * 8;
      pts += Math.min(10, hsBonus);
    } else {
      const hsPenalty = -1 - Math.min(1, (50 - hsPct) / 50) * 5;
      pts += Math.max(-6, hsPenalty);
    }
    if (damage > 1e3) {
      const dmgBonus = 2 + Math.min(1, (damage - 1e3) / 1e3) * 8;
      pts += Math.min(10, dmgBonus);
    } else {
      const dmgPenalty = -1 - Math.min(1, (1e3 - damage) / 1e3) * 5;
      pts += Math.max(-6, dmgPenalty);
    }
    return Math.round(pts * 100) / 100;
  }
  app2.get("/api/fantasy/players", isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(
        import_drizzle_orm4.sql`SELECT id, nickname, first_name, last_name, profile_image_url, steam_id_64,
                   skill_rating, level_points, total_kills, total_deaths, total_assists,
                   total_headshots, total_matches, total_damage
            FROM users
            ORDER BY level_points DESC`
      );
      const players = result.rows.map((u) => {
        const matches2 = u.total_matches || 1;
        const kills = u.total_kills || 0;
        const deaths = u.total_deaths || 0;
        const lp = u.level_points ?? 0;
        const level = Math.max(1, Math.min(21, Math.floor(lp / 30) + 1));
        const avgKills = kills / matches2;
        const avgDeaths = deaths / matches2;
        const avgAssists = (u.total_assists || 0) / matches2;
        const avgDamage = (u.total_damage || 0) / matches2;
        const avgHeadshots = (u.total_headshots || 0) / matches2;
        const projectedPts = u.total_matches > 0 ? calcFantasyPoints({
          kills: avgKills,
          deaths: avgDeaths,
          assists: avgAssists,
          headshots: avgHeadshots,
          fiveK: 0,
          fourK: 0,
          damage: avgDamage
        }) : 0;
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
          kd_ratio: deaths > 0 ? Math.round(kills / deaths * 100) / 100 : kills,
          hs_pct: kills > 0 ? Math.round((u.total_headshots || 0) / kills * 1e3) / 10 : 0
        };
      });
      res.json({ players, budget: FANTASY_BUDGET });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.get("/api/fantasy/rounds", isAuthenticated, async (req, res) => {
    try {
      const rounds = await db.execute(
        import_drizzle_orm4.sql`SELECT * FROM fantasy_rounds ORDER BY created_at DESC`
      );
      res.json(rounds.rows);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.get("/api/fantasy/rounds/active", isAuthenticated, async (req, res) => {
    try {
      const round = await db.execute(
        import_drizzle_orm4.sql`SELECT * FROM fantasy_rounds WHERE status = 'open' ORDER BY created_at DESC LIMIT 1`
      );
      const r = round.rows[0];
      if (!r) return res.json(null);
      const marketOpen = isMarketOpen(new Date(r.start_date));
      res.json({ ...r, marketOpen });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.get("/api/fantasy/my-team/:roundId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const roundId = parseInt(req.params.roundId);
      const team = await db.execute(
        import_drizzle_orm4.sql`SELECT * FROM fantasy_teams WHERE user_id = ${userId} AND round_id = ${roundId} LIMIT 1`
      );
      if (!team.rows[0]) return res.json(null);
      const teamId = team.rows[0].id;
      const picks = await db.execute(
        import_drizzle_orm4.sql`SELECT fp.*, u.nickname, u.first_name, u.last_name, u.profile_image_url, u.steam_id_64
            FROM fantasy_picks fp
            JOIN users u ON fp.picked_user_id = u.id
            WHERE fp.team_id = ${teamId}
            ORDER BY fp.points DESC`
      );
      res.json({ team: team.rows[0], picks: picks.rows });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.post("/api/fantasy/teams", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id;
      const { roundId, playerIds } = req.body;
      if (!roundId || !Array.isArray(playerIds) || playerIds.length === 0 || playerIds.length > 5) {
        return res.status(400).json({ message: "Selecione entre 1 e 5 jogadores." });
      }
      const round = await db.execute(
        import_drizzle_orm4.sql`SELECT * FROM fantasy_rounds WHERE id = ${roundId} AND status = 'open' LIMIT 1`
      );
      if (!round.rows[0]) return res.status(400).json({ message: "Rodada n\xE3o est\xE1 aberta para escala\xE7\xF5es." });
      const roundData = round.rows[0];
      if (!isMarketOpen(new Date(roundData.start_date))) {
        return res.status(400).json({ message: "Mercado fechado! Escala\xE7\xF5es encerram \xE0s segundas-feiras \xE0s 16h (hor\xE1rio de Bras\xEDlia)." });
      }
      const playerRows = await db.execute(
        import_drizzle_orm4.sql`SELECT id, level_points FROM users WHERE id IN (${import_drizzle_orm4.sql.join(playerIds.map((id) => import_drizzle_orm4.sql`${id}`), import_drizzle_orm4.sql`, `)})`
      );
      const lpMap = {};
      for (const row of playerRows.rows) {
        lpMap[row.id] = row.level_points ?? 0;
      }
      const prices = {};
      let totalCost = 0;
      for (const pid of playerIds) {
        const price = calcPlayerPrice(lpMap[pid] ?? 500);
        prices[pid] = price;
        totalCost += price;
      }
      if (totalCost > FANTASY_BUDGET) {
        return res.status(400).json({
          message: `Or\xE7amento excedido! Total: R$${totalCost} / Limite: R$${FANTASY_BUDGET}`,
          totalCost,
          budget: FANTASY_BUDGET
        });
      }
      const existing = await db.execute(
        import_drizzle_orm4.sql`SELECT id FROM fantasy_teams WHERE user_id = ${userId} AND round_id = ${roundId} LIMIT 1`
      );
      let teamId;
      if (existing.rows[0]) {
        teamId = existing.rows[0].id;
        await db.execute(import_drizzle_orm4.sql`DELETE FROM fantasy_picks WHERE team_id = ${teamId}`);
        await db.execute(
          import_drizzle_orm4.sql`UPDATE fantasy_teams SET budget_used = ${totalCost} WHERE id = ${teamId}`
        );
      } else {
        const ins = await db.execute(
          import_drizzle_orm4.sql`INSERT INTO fantasy_teams (user_id, round_id, total_points, budget_used) VALUES (${userId}, ${roundId}, 0, ${totalCost}) RETURNING id`
        );
        teamId = ins.rows[0].id;
      }
      for (const pid of playerIds) {
        const price = prices[pid];
        await db.execute(
          import_drizzle_orm4.sql`INSERT INTO fantasy_picks (team_id, picked_user_id, points, price) VALUES (${teamId}, ${pid}, 0, ${price})`
        );
      }
      res.json({ success: true, teamId, totalCost, budget: FANTASY_BUDGET });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.get("/api/fantasy/ranking/:roundId", isAuthenticated, async (req, res) => {
    try {
      const roundId = parseInt(req.params.roundId);
      const teams = await db.execute(
        import_drizzle_orm4.sql`SELECT ft.id, ft.total_points, ft.user_id,
                   u.nickname, u.first_name, u.last_name, u.profile_image_url
            FROM fantasy_teams ft
            JOIN users u ON ft.user_id = u.id
            WHERE ft.round_id = ${roundId}
            ORDER BY ft.total_points DESC`
      );
      const result = [];
      for (const t of teams.rows) {
        const picks = await db.execute(
          import_drizzle_orm4.sql`SELECT COUNT(*) as cnt FROM fantasy_picks WHERE team_id = ${t.id}`
        );
        result.push({ ...t, playerCount: parseInt(picks.rows[0].cnt) });
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.post("/api/fantasy/rounds", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub ?? req.user?.id ?? null;
      const adminUser = userId ? await storage.getUser(userId) : null;
      if (!adminUser?.isAdmin) return res.status(403).json({ message: "Acesso negado." });
      const { name, startDate, endDate } = req.body;
      if (!name || !startDate || !endDate) return res.status(400).json({ message: "Dados incompletos." });
      const r = await db.execute(
        import_drizzle_orm4.sql`INSERT INTO fantasy_rounds (name, status, start_date, end_date)
            VALUES (${name}, 'open', ${new Date(startDate).toISOString()}, ${new Date(endDate).toISOString()})
            RETURNING *`
      );
      res.json(r.rows[0]);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.post("/api/fantasy/rounds/:id/calculate", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const adminUser = await storage.getUser(userId);
      if (!adminUser?.isAdmin) return res.status(403).json({ message: "Acesso negado." });
      const roundId = parseInt(req.params.id);
      const round = await db.execute(
        import_drizzle_orm4.sql`SELECT * FROM fantasy_rounds WHERE id = ${roundId} LIMIT 1`
      );
      if (!round.rows[0]) return res.status(404).json({ message: "Rodada n\xE3o encontrada." });
      const r = round.rows[0];
      await db.execute(import_drizzle_orm4.sql`UPDATE fantasy_rounds SET status = 'calculating' WHERE id = ${roundId}`);
      const stats = await db.execute(
        import_drizzle_orm4.sql`SELECT ms.*, m.winner_team, (ms.team_name = m.winner_team) AS won_match
            FROM match_stats ms
            JOIN matches m ON ms.match_id = m.id
            WHERE m.date >= ${r.start_date} AND m.date <= ${r.end_date}`
      );
      const pointMap = {};
      for (const stat of stats.rows) {
        const pid = stat.user_id;
        if (!pid) continue;
        const pts = calcFantasyPoints({
          kills: stat.kills,
          deaths: stat.deaths,
          assists: stat.assists,
          headshots: stat.headshots,
          fiveK: stat.enemy_5ks,
          fourK: stat.enemy_4ks,
          threeK: stat.enemy_3ks,
          twoK: stat.enemy_2ks,
          damage: stat.damage,
          clutch1v1: stat.v1_wins,
          clutch1v2: stat.v2_wins,
          firstKills: stat.entry_wins,
          isMvp: stat.mvps > 0,
          wonMatch: stat.won_match === true || stat.won_match === "true"
        });
        pointMap[pid] = (pointMap[pid] || 0) + pts;
      }
      const teams = await db.execute(import_drizzle_orm4.sql`SELECT id FROM fantasy_teams WHERE round_id = ${roundId}`);
      for (const team of teams.rows) {
        const picks = await db.execute(import_drizzle_orm4.sql`SELECT * FROM fantasy_picks WHERE team_id = ${team.id}`);
        let teamTotal = 0;
        for (const pick of picks.rows) {
          const pts = pointMap[pick.picked_user_id] || 0;
          await db.execute(import_drizzle_orm4.sql`UPDATE fantasy_picks SET points = ${pts} WHERE id = ${pick.id}`);
          teamTotal += pts;
        }
        await db.execute(import_drizzle_orm4.sql`UPDATE fantasy_teams SET total_points = ${Math.round(teamTotal * 100) / 100} WHERE id = ${team.id}`);
      }
      await db.execute(import_drizzle_orm4.sql`UPDATE fantasy_rounds SET status = 'finished' WHERE id = ${roundId}`);
      res.json({ success: true, message: "Pontua\xE7\xE3o calculada com sucesso!" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  app2.delete("/api/fantasy/rounds/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const adminUser = await storage.getUser(userId);
      if (!adminUser?.isAdmin) return res.status(403).json({ message: "Acesso negado." });
      await db.execute(import_drizzle_orm4.sql`DELETE FROM fantasy_rounds WHERE id = ${parseInt(req.params.id)}`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  async function getMonthlyMatchCounts(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);
    const allMatches = await storage.getAllMatches();
    const monthMatches = allMatches.filter((m) => {
      const d = new Date(m.date);
      return d >= firstDay && d <= lastDay;
    });
    const counts = /* @__PURE__ */ new Map();
    for (const match of monthMatches) {
      const stats = await storage.getMatchStats(match.id);
      for (const s of stats) {
        if (!counts.has(s.userId)) counts.set(s.userId, /* @__PURE__ */ new Set());
        counts.get(s.userId).add(match.id);
      }
    }
    const map = /* @__PURE__ */ new Map();
    Array.from(counts.entries()).forEach(([uid, set]) => map.set(uid, set.size));
    return map;
  }
  async function buildEligibleList(year, month, minMatches) {
    const counts = await getMonthlyMatchCounts(year, month);
    const allUsers = await storage.getAllUsers();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));
    const list = [];
    for (const [userId, matchesPlayed] of Array.from(counts.entries())) {
      if (matchesPlayed < minMatches) continue;
      const u = userMap.get(userId);
      if (!u) continue;
      if (u.isBanned || u.isCheaterBanned) continue;
      list.push({
        userId,
        nickname: u.nickname || u.firstName || u.email || u.id,
        matchesPlayed,
        profileImageUrl: u.profileImageUrl ?? null
      });
    }
    list.sort((a, b) => a.userId.localeCompare(b.userId));
    return list;
  }
  function deriveRandom(seed) {
    const hash = (0, import_crypto.createHash)("sha256").update(seed).digest();
    let intVal = 0;
    for (let i = 0; i < 6; i++) {
      intVal = intVal * 256 + hash[i];
    }
    const denom = Math.pow(2, 48);
    const num = intVal / denom;
    return { value: num.toFixed(18), valueNumber: num };
  }
  async function ensureAdmin(req, res) {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      res.status(401).json({ message: "N\xE3o autenticado" });
      return null;
    }
    const u = await storage.getUser(userId);
    if (!u?.isAdmin) {
      res.status(403).json({ message: "Acesso restrito a administradores" });
      return null;
    }
    return u;
  }
  app2.get("/api/admin/raffles/eligible", isAuthenticated, async (req, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const now = /* @__PURE__ */ new Date();
      const year = Number(req.query.year) || now.getFullYear();
      const month = Number(req.query.month) || now.getMonth() + 1;
      const minMatches = Math.max(1, Number(req.query.minMatches) || 3);
      const list = await buildEligibleList(year, month, minMatches);
      res.json({ year, month, minMatches, eligible: list });
    } catch (err) {
      console.error("[Raffles] eligible error:", err);
      res.status(500).json({ message: "Erro ao listar eleg\xEDveis" });
    }
  });
  const createRaffleSchema = import_zod2.z.object({
    title: import_zod2.z.string().min(1).max(120),
    year: import_zod2.z.number().int().min(2020).max(2100),
    month: import_zod2.z.number().int().min(1).max(12),
    minMatches: import_zod2.z.number().int().min(1).max(50)
  });
  app2.post("/api/admin/raffles", isAuthenticated, async (req, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const parsed = createRaffleSchema.parse(req.body);
      const eligible = await buildEligibleList(parsed.year, parsed.month, parsed.minMatches);
      if (eligible.length === 0) {
        return res.status(400).json({ message: "N\xE3o h\xE1 jogadores eleg\xEDveis para o sorteio." });
      }
      const seed = (0, import_crypto.randomBytes)(32).toString("hex");
      const { value, valueNumber } = deriveRandom(seed);
      const winnerIndex = Math.floor(valueNumber * eligible.length);
      const winner = eligible[winnerIndex];
      const [created] = await db.insert(raffles).values({
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
        createdById: admin.id
      }).returning();
      res.json(created);
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) return res.status(400).json({ message: "Dados inv\xE1lidos", errors: err.errors });
      console.error("[Raffles] create error:", err);
      res.status(500).json({ message: "Erro ao criar sorteio" });
    }
  });
  app2.get("/api/admin/raffles", isAuthenticated, async (req, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const list = await db.select().from(raffles).orderBy((0, import_drizzle_orm4.desc)(raffles.createdAt));
      res.json(list);
    } catch (err) {
      console.error("[Raffles] list error:", err);
      res.status(500).json({ message: "Erro ao listar sorteios" });
    }
  });
  app2.get("/api/admin/raffles/:id", isAuthenticated, async (req, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const [r] = await db.select().from(raffles).where((0, import_drizzle_orm4.eq)(raffles.id, req.params.id));
      if (!r) return res.status(404).json({ message: "Sorteio n\xE3o encontrado" });
      res.json(r);
    } catch (err) {
      console.error("[Raffles] get error:", err);
      res.status(500).json({ message: "Erro ao buscar sorteio" });
    }
  });
  app2.post("/api/admin/raffles/:id/notify", isAuthenticated, async (req, res) => {
    try {
      const admin = await ensureAdmin(req, res);
      if (!admin) return;
      const [r] = await db.select().from(raffles).where((0, import_drizzle_orm4.eq)(raffles.id, req.params.id));
      if (!r) return res.status(404).json({ message: "Sorteio n\xE3o encontrado" });
      if (!r.winnerUserId) return res.status(400).json({ message: "Sorteio sem vencedor" });
      const pushResult = await sendPushToUser(r.winnerUserId, {
        title: "Voc\xEA ganhou um sorteio!",
        body: `Parab\xE9ns! Voc\xEA foi sorteado em: ${r.title}`,
        url: "/",
        tag: `raffle-${r.id}`
      }).catch((e) => {
        console.error("[Raffles] push error:", e);
        return { sent: 0, failed: 0, total: 0 };
      });
      const [updated] = await db.update(raffles).set({ notifiedAt: /* @__PURE__ */ new Date(), winnerSeenAt: null }).where((0, import_drizzle_orm4.eq)(raffles.id, r.id)).returning();
      res.json({ raffle: updated, push: pushResult });
    } catch (err) {
      console.error("[Raffles] notify error:", err);
      res.status(500).json({ message: "Erro ao notificar vencedor" });
    }
  });
  app2.get("/api/raffles/my-unseen-wins", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "N\xE3o autenticado" });
      const rows = await db.select().from(raffles).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.eq)(raffles.winnerUserId, userId), import_drizzle_orm4.sql`${raffles.notifiedAt} is not null`, import_drizzle_orm4.sql`${raffles.winnerSeenAt} is null`)).orderBy((0, import_drizzle_orm4.desc)(raffles.notifiedAt));
      res.json(rows);
    } catch (err) {
      console.error("[Raffles] my-unseen error:", err);
      res.status(500).json({ message: "Erro ao buscar sorteios" });
    }
  });
  app2.post("/api/raffles/:id/mark-seen", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "N\xE3o autenticado" });
      const [r] = await db.select().from(raffles).where((0, import_drizzle_orm4.eq)(raffles.id, req.params.id));
      if (!r || r.winnerUserId !== userId) return res.status(404).json({ message: "Sorteio n\xE3o encontrado" });
      const [updated] = await db.update(raffles).set({ winnerSeenAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm4.eq)(raffles.id, r.id)).returning();
      res.json(updated);
    } catch (err) {
      console.error("[Raffles] mark-seen error:", err);
      res.status(500).json({ message: "Erro ao confirmar" });
    }
  });
  registerTournament2x2Routes(app2, isAuthenticated);
  return httpServer2;
}
function generateSlotSymbols(won) {
  const symbols = ["\u{1F42F}", "\u{1F48E}", "7\uFE0F\u20E3", "\u{1F340}", "\u2B50", "\u{1F514}", "\u{1F352}", "\u{1F34B}"];
  if (won) {
    const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const winRow = Math.floor(Math.random() * 3);
    return Array(3).fill(null).map((_, row) => {
      if (row === winRow) {
        return [winSymbol, winSymbol, winSymbol];
      }
      return Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    });
  } else {
    return Array(3).fill(null).map(() => {
      const row = Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      if (row[0] === row[1] && row[1] === row[2]) {
        row[2] = symbols[(symbols.indexOf(row[2]) + 1) % symbols.length];
      }
      return row;
    });
  }
}
function generateRandomSkin(rarity) {
  const weapons = {
    "Consumidor": ["P250", "MAG-7", "PP-Bizon", "Sawed-Off", "Nova"],
    "Industrial": ["Galil AR", "FAMAS", "MAC-10", "MP7", "UMP-45"],
    "Militar": ["M4A4", "AK-47", "AWP", "Desert Eagle", "USP-S"],
    "Restrito": ["M4A1-S", "AK-47", "AWP", "Glock-18", "Five-SeveN"],
    "Secreto": ["AK-47", "M4A4", "AWP", "Desert Eagle", "USP-S"],
    "Faca/Luva": ["Karambit", "Butterfly Knife", "M9 Bayonet", "Skeleton Knife", "Talon Knife"]
  };
  const skins = {
    "Consumidor": ["Sand Dune", "Safari Mesh", "Groundwater", "Forest DDPAT", "Urban DDPAT"],
    "Industrial": ["Blue Steel", "Stainless", "Urban Masked", "Jungle Tiger", "Predator"],
    "Militar": ["Redline", "Asiimov", "Hyper Beast", "Vulcan", "Kill Confirmed"],
    "Restrito": ["Neo-Noir", "Printstream", "The Prince", "Fade", "Fire Serpent"],
    "Secreto": ["Dragon Lore", "Howl", "Medusa", "Gungnir", "The Empress"],
    "Faca/Luva": ["Doppler", "Fade", "Marble Fade", "Tiger Tooth", "Crimson Web"]
  };
  const weaponList = weapons[rarity] || weapons["Consumidor"];
  const skinList = skins[rarity] || skins["Consumidor"];
  const weapon = weaponList[Math.floor(Math.random() * weaponList.length)];
  const skin = skinList[Math.floor(Math.random() * skinList.length)];
  return {
    name: `${weapon} | ${skin}`,
    weapon,
    skin
  };
}
function sanitizeTournament2x2Team(team, isAdmin) {
  if (isAdmin) return team;
  const { contactPhone, paymentMethod, paymentProof, notes, ...rest } = team;
  return rest;
}
function registerTournament2x2Routes(app2, isAuthenticated2) {
  app2.get("/api/tournament-2x2/teams", async (req, res) => {
    try {
      const teams = await storage.listTournament2x2Teams();
      const isAuth = typeof req.isAuthenticated === "function" ? req.isAuthenticated() : false;
      let isAdmin = false;
      if (isAuth && req.user?.claims?.sub) {
        const u = await storage.getUser(req.user.claims.sub);
        isAdmin = !!u?.isAdmin;
      }
      res.json(teams.map((t) => sanitizeTournament2x2Team(t, isAdmin)));
    } catch (e) {
      console.error("[t2x2] list teams", e);
      res.status(500).json({ message: "Erro ao listar times" });
    }
  });
  app2.post("/api/tournament-2x2/teams", async (req, res) => {
    try {
      const parsed = insertTournament2x2TeamSchema.parse(req.body);
      const all = await storage.listTournament2x2Teams();
      if (all.length >= 32) {
        return res.status(400).json({ message: "Limite de 32 duplas atingido" });
      }
      const created = await storage.createTournament2x2Team(parsed);
      res.json({ id: created.id, teamName: created.teamName });
    } catch (e) {
      if (e?.name === "ZodError") return res.status(400).json({ message: "Dados inv\xE1lidos", errors: e.errors });
      console.error("[t2x2] create team", e);
      res.status(500).json({ message: "Erro ao cadastrar dupla" });
    }
  });
  app2.patch("/api/tournament-2x2/teams/:id", isAuthenticated2, async (req, res) => {
    try {
      const u = await storage.getUser(req.user.claims.sub);
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const parsed = updateTournament2x2TeamSchema.parse(req.body);
      const updated = await storage.updateTournament2x2Team(Number(req.params.id), parsed);
      if (!updated) return res.status(404).json({ message: "N\xE3o encontrado" });
      res.json(updated);
    } catch (e) {
      if (e?.name === "ZodError") return res.status(400).json({ message: "Dados inv\xE1lidos", errors: e.errors });
      console.error("[t2x2] update team", e);
      res.status(500).json({ message: "Erro ao atualizar" });
    }
  });
  app2.post("/api/tournament-2x2/teams/:id/confirm", isAuthenticated2, async (req, res) => {
    try {
      const u = await storage.getUser(req.user.claims.sub);
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const { confirmed } = req.body;
      const updated = await storage.updateTournament2x2Team(Number(req.params.id), { isConfirmed: !!confirmed });
      if (!updated) return res.status(404).json({ message: "N\xE3o encontrado" });
      res.json(updated);
    } catch (e) {
      console.error("[t2x2] confirm", e);
      res.status(500).json({ message: "Erro" });
    }
  });
  app2.delete("/api/tournament-2x2/teams/:id", isAuthenticated2, async (req, res) => {
    try {
      const u = await storage.getUser(req.user.claims.sub);
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const ok = await storage.deleteTournament2x2Team(Number(req.params.id));
      res.json({ ok });
    } catch (e) {
      console.error("[t2x2] delete", e);
      res.status(500).json({ message: "Erro" });
    }
  });
  app2.get("/api/tournament-2x2/bracket", async (_req, res) => {
    try {
      const matches2 = await storage.listTournament2x2Matches();
      const teams = await storage.listTournament2x2Teams();
      const byId = new Map(teams.map((t) => [t.id, t.teamName]));
      res.json(matches2.map((m) => ({
        ...m,
        team1Name: m.team1Id ? byId.get(m.team1Id) ?? null : null,
        team2Name: m.team2Id ? byId.get(m.team2Id) ?? null : null
      })));
    } catch (e) {
      console.error("[t2x2] bracket", e);
      res.status(500).json({ message: "Erro" });
    }
  });
  app2.post("/api/tournament-2x2/bracket/draw", isAuthenticated2, async (req, res) => {
    try {
      const u = await storage.getUser(req.user.claims.sub);
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const all = await storage.listTournament2x2Teams();
      const confirmed = all.filter((t) => t.isConfirmed);
      if (confirmed.length < 2) return res.status(400).json({ message: "Pelo menos 2 duplas confirmadas" });
      const shuffled = [...confirmed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      let bracketSize = 2;
      while (bracketSize < shuffled.length) bracketSize *= 2;
      if (bracketSize > 32) bracketSize = 32;
      const matches2 = [];
      const firstRoundMatches = bracketSize / 2;
      for (let i = 0; i < firstRoundMatches; i++) {
        const t1 = shuffled[i * 2] ?? null;
        const t2 = shuffled[i * 2 + 1] ?? null;
        matches2.push({
          round: 1,
          position: i + 1,
          team1Id: t1?.id ?? null,
          team2Id: t2?.id ?? null
        });
      }
      let cur = firstRoundMatches / 2;
      let round = 2;
      while (cur >= 1) {
        for (let i = 0; i < cur; i++) {
          matches2.push({ round, position: i + 1, team1Id: null, team2Id: null });
        }
        cur = Math.floor(cur / 2);
        round++;
      }
      const created = await storage.replaceTournament2x2Bracket(matches2);
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
  app2.patch("/api/tournament-2x2/matches/:id", isAuthenticated2, async (req, res) => {
    try {
      const u = await storage.getUser(req.user.claims.sub);
      if (!u?.isAdmin) return res.status(403).json({ message: "Apenas admin" });
      const matchId = Number(req.params.id);
      const all = await storage.listTournament2x2Matches();
      const current = all.find((m) => m.id === matchId);
      if (!current) return res.status(404).json({ message: "Partida n\xE3o encontrada" });
      const { score1, score2, winnerId } = req.body;
      const newWinnerId = winnerId != null ? Number(winnerId) : null;
      if (newWinnerId !== null && newWinnerId !== current.team1Id && newWinnerId !== current.team2Id) {
        return res.status(400).json({ message: "Vencedor inv\xE1lido para esta partida" });
      }
      const updated = await storage.updateTournament2x2Match(matchId, {
        score1: score1 != null ? Number(score1) : null,
        score2: score2 != null ? Number(score2) : null,
        winnerId: newWinnerId
      });
      if (!updated) return res.status(404).json({ message: "Partida n\xE3o encontrada" });
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
async function propagateWinner(fromRound, fromPosition, winnerId) {
  const all = await storage.listTournament2x2Matches();
  const next = all.find((m) => m.round === fromRound + 1 && m.position === Math.ceil(fromPosition / 2));
  if (!next) return;
  const isTeam1Slot = fromPosition % 2 === 1;
  await storage.updateTournament2x2Match(next.id, {
    [isTeam1Slot ? "team1Id" : "team2Id"]: winnerId
  });
}
async function clearDownstream(fromRound, fromPosition, oldWinnerId) {
  const all = await storage.listTournament2x2Matches();
  let curRound = fromRound + 1;
  let curPosition = Math.ceil(fromPosition / 2);
  let isTeam1Slot = fromPosition % 2 === 1;
  while (true) {
    const next = all.find((m) => m.round === curRound && m.position === curPosition);
    if (!next) return;
    const fieldHadOld = isTeam1Slot ? next.team1Id === oldWinnerId : next.team2Id === oldWinnerId;
    if (!fieldHadOld) return;
    await storage.updateTournament2x2Match(next.id, {
      [isTeam1Slot ? "team1Id" : "team2Id"]: null,
      score1: null,
      score2: null,
      winnerId: null
    });
    if (next.winnerId == null) return;
    const propagatedWinner = next.winnerId;
    isTeam1Slot = curPosition % 2 === 1;
    curPosition = Math.ceil(curPosition / 2);
    curRound++;
    oldWinnerId = propagatedWinner;
  }
}

// server/vercel.ts
var app = (0, import_express.default)();
var httpServer = (0, import_http.createServer)(app);
app.set("trust proxy", 1);
app.use((req, _res, next) => {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? "" : "/") + req.url;
  }
  next();
});
app.get("/api/ping", (_req, res) => {
  res.status(200).json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/db-test", async (_req, res) => {
  try {
    const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { sql: sql4 } = await import("drizzle-orm");
    const result = await db2.execute(sql4`SELECT NOW()`);
    res.status(200).json({ status: "ok", db: "connected", result: result.rows });
  } catch (err) {
    console.error("[DB Test Error]:", err);
    res.status(500).json({ status: "error", message: err.message || String(err), stack: err.stack });
  }
});
app.use(
  import_express.default.json({
    limit: "15mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(import_express.default.urlencoded({ extended: false, limit: "15mb" }));
registerRoutes(httpServer, app);
app.use((err, _req, res, _next) => {
  console.error("[Express Error]:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});
var vercel_default = app;
