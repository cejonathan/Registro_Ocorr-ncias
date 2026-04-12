import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Vehicle registration table - tracks vehicle opening km and agent assignments
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  agentName: varchar("agentName", { length: 255 }).notNull(),
  vehicleId: varchar("vehicleId", { length: 100 }).notNull(),
  openingKm: int("openingKm").notNull(),
  registeredAt: timestamp("registeredAt").notNull(),
  observations: text("observations"),
  syncedToSheets: int("syncedToSheets").default(0).notNull(),
  sheetsRowId: varchar("sheetsRowId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

/**
 * Occurrences table - tracks traffic incidents and events
 */
export const occurrences = mysqlTable("occurrences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  occurrenceType: varchar("occurrenceType", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  description: text("description").notNull(),
  agentName: varchar("agentName", { length: 255 }).notNull(),
  registeredAt: timestamp("registeredAt").notNull(),
  syncedToSheets: int("syncedToSheets").default(0).notNull(),
  sheetsRowId: varchar("sheetsRowId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Occurrence = typeof occurrences.$inferSelect;
export type InsertOccurrence = typeof occurrences.$inferInsert;

/**
 * Reports table - tracks generated reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  reportType: varchar("reportType", { length: 100 }).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  generatedAt: timestamp("generatedAt").notNull(),
  totalVehicles: int("totalVehicles").default(0),
  totalOccurrences: int("totalOccurrences").default(0),
  activeAgents: int("activeAgents").default(0),
  syncedToSheets: int("syncedToSheets").default(0).notNull(),
  sheetsRowId: varchar("sheetsRowId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Google Sheets sync tracking table
 */
export const googleSheetsSync = mysqlTable("googleSheetsSync", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  recordType: varchar("recordType", { length: 50 }).notNull(), // 'vehicle', 'occurrence', 'report'
  recordId: int("recordId").notNull(),
  spreadsheetId: varchar("spreadsheetId", { length: 255 }).notNull(),
  sheetName: varchar("sheetName", { length: 255 }).notNull(),
  rowNumber: int("rowNumber"),
  synced: int("synced").default(0).notNull(),
  lastSyncAttempt: timestamp("lastSyncAttempt"),
  syncError: text("syncError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GoogleSheetsSync = typeof googleSheetsSync.$inferSelect;
export type InsertGoogleSheetsSync = typeof googleSheetsSync.$inferInsert;