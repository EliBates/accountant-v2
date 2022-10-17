import { t } from "../trpc";
import { z } from "zod";

export const transactionAccountRouter = t.router({
  add: t.procedure.input(z.object({ alias: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.transactionAccount.create({
      data: {
        alias: input.alias,
      },
    });
  }),
  remove: t.procedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.transactionAccount.delete({
      where: {
        id: input.id,
      },
    });
  }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.transactionAccount.findMany();
  }),
});
