// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { transactionAccountRouter } from "./transactionAccount";
import { transactionRouter } from "./transaction";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  transactionAccount: transactionAccountRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
