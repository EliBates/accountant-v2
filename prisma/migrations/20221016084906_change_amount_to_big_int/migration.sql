/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Float` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "reviewed" BOOLEAN NOT NULL,
    "transactionAccountId" TEXT,
    CONSTRAINT "Transaction_transactionAccountId_fkey" FOREIGN KEY ("transactionAccountId") REFERENCES "TransactionAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "category", "date", "description", "id", "reviewed", "transactionAccountId", "type") SELECT "amount", "category", "date", "description", "id", "reviewed", "transactionAccountId", "type" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
