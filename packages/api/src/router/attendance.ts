import { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { Attendance } from "@mce/db/schema";

export const attendanceRouter = {
    getAttendance: protectedProcedure.query(() => {
        return "you can see this attendance data!";
    }),
    createAttendance: protectedProcedure.input(z.object({
        userId: z.string(),
        date: z.string(),
        class: z.string(),
        period: z.literal(1 | 2 | 3 | 4 | 5 | 6 | 7),
        isPresent: z.boolean(),
        rollNo: z.number(),
    })).mutation(async ({ctx, input}) => {
        await ctx.db.insert(Attendance).values({
            userId: input.userId,
            date: input.date,
            class: input.class,
            period: input.period as 1 | 2 | 3 | 4 | 5 | 6 | 7,
            isPresent: input.isPresent,
            rollNo: input.rollNo,
        })
    }),
    } satisfies TRPCRouterRecord;