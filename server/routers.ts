import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createVehicle,
  getUserVehicles,
  getVehicleById,
  createOccurrence,
  getUserOccurrences,
  getOccurrenceById,
  createReport,
  getUserReports,
  getReportById,
  getDashboardStats,
} from "./db";
import { syncVehicleToSheets, syncOccurrenceToSheets } from "./googleSheets";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vehicles: router({
    create: protectedProcedure
      .input(z.object({
        agentName: z.string().min(1, "Nome do agente é obrigatório"),
        vehicleId: z.string().min(1, "ID da viatura é obrigatório"),
        openingKm: z.number().int().positive("KM deve ser um número positivo"),
        registeredAt: z.date(),
        observations: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const vehicle = await createVehicle({
          userId: ctx.user.id,
          agentName: input.agentName,
          vehicleId: input.vehicleId,
          openingKm: input.openingKm,
          registeredAt: input.registeredAt,
          observations: input.observations || null,
          syncedToSheets: 0,
          sheetsRowId: null,
        });

        // Sincronizar com Google Sheets
        try {
          const date = input.registeredAt.toLocaleDateString('pt-BR');
          const time = input.registeredAt.toLocaleTimeString('pt-BR');
          await syncVehicleToSheets({
            date,
            horaInicial: time,
            viatura: input.vehicleId,
            condutor: input.agentName,
            apoio: "",
            kmInicial: input.openingKm,
            observacoes: input.observations,
          });
          console.log(`[tRPC] Vehicle synced to Google Sheets: ${input.vehicleId}`);
        } catch (error) {
          console.error("[tRPC] Error syncing vehicle to Google Sheets:", error);
          // Não falhar a operação se a sincronização falhar
        }

        return vehicle;
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserVehicles(ctx.user.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getVehicleById(input.id);
      }),
  }),

  occurrences: router({
    create: protectedProcedure
      .input(z.object({
        occurrenceType: z.string().min(1, "Tipo de ocorrência é obrigatório"),
        location: z.string().min(1, "Local é obrigatório"),
        description: z.string().min(1, "Descrição é obrigatória"),
        agentName: z.string().min(1, "Nome do agente é obrigatório"),
        registeredAt: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        const occurrence = await createOccurrence({
          userId: ctx.user.id,
          occurrenceType: input.occurrenceType,
          location: input.location,
          description: input.description,
          agentName: input.agentName,
          registeredAt: input.registeredAt,
          syncedToSheets: 0,
          sheetsRowId: null,
        });

        // Sincronizar com Google Sheets
        try {
          const date = input.registeredAt.toLocaleDateString('pt-BR');
          const time = input.registeredAt.toLocaleTimeString('pt-BR');
          await syncOccurrenceToSheets({
            date,
            horaInicial: time,
            viatura: "",
            condutor: input.agentName,
            apoio: "",
            local: input.location,
            codigo: input.occurrenceType,
            observacao: input.description,
          });
          console.log(`[tRPC] Occurrence synced to Google Sheets: ${input.location}`);
        } catch (error) {
          console.error("[tRPC] Error syncing occurrence to Google Sheets:", error);
          // Não falhar a operação se a sincronização falhar
        }

        return occurrence;
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserOccurrences(ctx.user.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getOccurrenceById(input.id);
      }),
  }),

  reports: router({
    create: protectedProcedure
      .input(z.object({
        reportType: z.string().min(1, "Tipo de relatório é obrigatório"),
        periodStart: z.date(),
        periodEnd: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        const stats = await getDashboardStats(ctx.user.id, input.periodStart);

        const report = await createReport({
          userId: ctx.user.id,
          reportType: input.reportType,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          generatedAt: new Date(),
          totalVehicles: stats.totalVehicles,
          totalOccurrences: stats.totalOccurrences,
          activeAgents: stats.activeAgents.size,
          syncedToSheets: 0,
          sheetsRowId: null,
        });
        return report;
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserReports(ctx.user.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getReportById(input.id);
      }),
  }),

  dashboard: router({
    stats: protectedProcedure
      .input(z.object({ date: z.date().optional() }))
      .query(async ({ ctx, input }) => {
        const date = input.date || new Date();
        return await getDashboardStats(ctx.user.id, date);
      }),
  }),
});

export type AppRouter = typeof appRouter;
