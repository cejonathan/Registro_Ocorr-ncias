import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("vehicles router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createAuthContext();
  });

  it("should create a vehicle", async () => {
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicles.create({
      agentName: "João Silva",
      vehicleId: "VT-001",
      openingKm: 15000,
      registeredAt: new Date(),
      observations: "Viatura em bom estado",
    });

    expect(result).toBeDefined();
    expect(result?.vehicleId).toBe("VT-001");
    expect(result?.agentName).toBe("João Silva");
    expect(result?.openingKm).toBe(15000);
  });

  it("should list vehicles for user", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create a vehicle first
    await caller.vehicles.create({
      agentName: "João Silva",
      vehicleId: "VT-001",
      openingKm: 15000,
      registeredAt: new Date(),
    });

    // List vehicles
    const vehicles = await caller.vehicles.list();

    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);
  });

  it("should validate required fields", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.vehicles.create({
        agentName: "",
        vehicleId: "VT-001",
        openingKm: 15000,
        registeredAt: new Date(),
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("obrigatório");
    }
  });

  it("should validate positive km value", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.vehicles.create({
        agentName: "João Silva",
        vehicleId: "VT-001",
        openingKm: -100,
        registeredAt: new Date(),
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("positivo");
    }
  });
});

describe("occurrences router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createAuthContext();
  });

  it("should create an occurrence", async () => {
    const caller = appRouter.createCaller(ctx);

    const result = await caller.occurrences.create({
      occurrenceType: "Acidente",
      location: "Av. Paulista, 1000",
      description: "Colisão entre dois veículos",
      agentName: "Maria Santos",
      registeredAt: new Date(),
    });

    expect(result).toBeDefined();
    expect(result?.occurrenceType).toBe("Acidente");
    expect(result?.location).toBe("Av. Paulista, 1000");
  });

  it("should list occurrences for user", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create an occurrence first
    await caller.occurrences.create({
      occurrenceType: "Infração",
      location: "Rua Augusta",
      description: "Estacionamento irregular",
      agentName: "Pedro Costa",
      registeredAt: new Date(),
    });

    // List occurrences
    const occurrences = await caller.occurrences.list();

    expect(Array.isArray(occurrences)).toBe(true);
    expect(occurrences.length).toBeGreaterThan(0);
  });

  it("should validate required fields", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.occurrences.create({
        occurrenceType: "",
        location: "Rua Augusta",
        description: "Teste",
        agentName: "Pedro Costa",
        registeredAt: new Date(),
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("obrigatório");
    }
  });
});

describe("reports router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createAuthContext();
  });

  it("should create a report", async () => {
    const caller = appRouter.createCaller(ctx);

    const today = new Date();
    const result = await caller.reports.create({
      reportType: "Diário",
      periodStart: today,
      periodEnd: today,
    });

    expect(result).toBeDefined();
    expect(result?.reportType).toBe("Diário");
  });

  it("should list reports for user", async () => {
    const caller = appRouter.createCaller(ctx);

    const today = new Date();
    await caller.reports.create({
      reportType: "Semanal",
      periodStart: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      periodEnd: today,
    });

    const reports = await caller.reports.list();

    expect(Array.isArray(reports)).toBe(true);
    expect(reports.length).toBeGreaterThan(0);
  });

  it("should validate date range", async () => {
    const caller = appRouter.createCaller(ctx);

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    try {
      await caller.reports.create({
        reportType: "Customizado",
        periodStart: tomorrow,
        periodEnd: today,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});

describe("dashboard router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createAuthContext();
  });

  it("should get dashboard stats", async () => {
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.stats.query({ date: new Date() });

    expect(stats).toBeDefined();
    expect(typeof stats.totalVehicles).toBe("number");
    expect(typeof stats.totalOccurrences).toBe("number");
    expect(stats.activeAgents).toBeInstanceOf(Set);
  });

  it("should return zero stats for new user", async () => {
    const newCtx = createAuthContext(999);
    const caller = appRouter.createCaller(newCtx);

    const stats = await caller.dashboard.stats.query({ date: new Date() });

    expect(stats.totalVehicles).toBe(0);
    expect(stats.totalOccurrences).toBe(0);
    expect(stats.activeAgents.size).toBe(0);
  });
});
