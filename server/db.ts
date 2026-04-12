import { eq, desc, gte, lte, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vehicles, occurrences, reports, googleSheetsSync, Vehicle, InsertVehicle, Occurrence, InsertOccurrence, Report, InsertReport, InsertGoogleSheetsSync } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Vehicle queries
export async function createVehicle(vehicle: InsertVehicle): Promise<Vehicle | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(vehicles).values(vehicle);
  return getUserVehicles(vehicle.userId).then(v => v[0] || null);
}

export async function getUserVehicles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vehicles).where(eq(vehicles.userId, userId)).orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result[0] || null;
}

// Occurrence queries
export async function createOccurrence(occurrence: InsertOccurrence): Promise<Occurrence | null> {
  const db = await getDb();
  if (!db) return null;
  await db.insert(occurrences).values(occurrence);
  return getUserOccurrences(occurrence.userId).then(o => o[0] || null);
}

export async function getUserOccurrences(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(occurrences).where(eq(occurrences.userId, userId)).orderBy(desc(occurrences.createdAt));
}

export async function getOccurrenceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(occurrences).where(eq(occurrences.id, id)).limit(1);
  return result[0] || null;
}

// Report queries
export async function createReport(report: InsertReport): Promise<Report | null> {
  const db = await getDb();
  if (!db) return null;
  await db.insert(reports).values(report);
  return getUserReports(report.userId).then(r => r[0] || null);
}

export async function getUserReports(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt));
}

export async function getReportById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  return result[0] || null;
}

// Google Sheets Sync queries
export async function createGoogleSheetsSync(sync: InsertGoogleSheetsSync) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(googleSheetsSync).values(sync);
  return sync;
}

export async function updateGoogleSheetsSyncStatus(id: number, synced: number, error?: string) {
  const db = await getDb();
  if (!db) return null;
  const updateData: any = { synced, lastSyncAttempt: new Date() };
  if (error) updateData.syncError = error;
  return db.update(googleSheetsSync).set(updateData).where(eq(googleSheetsSync.id, id));
}

export async function getUnsyncedRecords(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(googleSheetsSync).where(and(eq(googleSheetsSync.userId, userId), eq(googleSheetsSync.synced, 0)));
}

// Dashboard queries
export async function getDashboardStats(userId: number, date: Date) {
  const db = await getDb();
  if (!db) return { totalVehicles: 0, totalOccurrences: 0, activeAgents: new Set<string>() };
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const vehicleCount = await db.select({ count: sql<number>`COUNT(*)` }).from(vehicles).where(
    and(eq(vehicles.userId, userId), gte(vehicles.registeredAt, startOfDay), lte(vehicles.registeredAt, endOfDay))
  );
  
  const occurrenceCount = await db.select({ count: sql<number>`COUNT(*)` }).from(occurrences).where(
    and(eq(occurrences.userId, userId), gte(occurrences.registeredAt, startOfDay), lte(occurrences.registeredAt, endOfDay))
  );
  
  const agents = await db.select({ agentName: occurrences.agentName }).from(occurrences).where(
    and(eq(occurrences.userId, userId), gte(occurrences.registeredAt, startOfDay), lte(occurrences.registeredAt, endOfDay))
  );
  
  const uniqueAgents = new Set(agents.map((a: any) => a.agentName));
  
  return {
    totalVehicles: Number(vehicleCount[0]?.count || 0),
    totalOccurrences: Number(occurrenceCount[0]?.count || 0),
    activeAgents: uniqueAgents
  };
}
