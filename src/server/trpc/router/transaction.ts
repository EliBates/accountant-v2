import { t } from "../trpc";
import { z } from "zod";

export const transactionRouter = t.router({
  add: t.procedure
    .input(
      z.object({
        type: z.string(),
        date: z.string(),
        description: z.string(),
        amount: z.bigint(),
        category: z.string(),
        reviewed: z.boolean(),
        transactionAccountId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.transaction.create({
        data: {
          type: input.type,
          date: new Date(),
          description: input.description,
          amount: input.amount,
          category: input.category,
          reviewed: input.reviewed,
          transactionAccountId: input.transactionAccountId || null,
        },
      });
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        type: z.string().optional(),
        date: z.string().optional(),
        description: z.string().optional(),
        amount: z.bigint().optional(),
        category: z.string().optional(),
        reviewed: z.boolean().optional(),
        transactionAccountId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          type: input.type,
          date: input.date,
          description: input.description,
          amount: input.amount,
          category: input.category,
          reviewed: input.reviewed,
          transactionAccountId: input.transactionAccountId,
        },
      });
    }),
  remove: t.procedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.transaction.delete({
      where: {
        id: input.id,
      },
    });
  }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany();
  }),
});
