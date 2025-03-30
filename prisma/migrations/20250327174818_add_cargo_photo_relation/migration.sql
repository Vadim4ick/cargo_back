/*
  Warnings:

  - Made the column `driver` on table `Cargo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loadUnloadDate` on table `Cargo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payoutDate` on table `Cargo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cargo" ALTER COLUMN "date" SET DATA TYPE TEXT,
ALTER COLUMN "driver" SET NOT NULL,
ALTER COLUMN "loadUnloadDate" SET NOT NULL,
ALTER COLUMN "loadUnloadDate" SET DATA TYPE TEXT,
ALTER COLUMN "payoutDate" SET NOT NULL,
ALTER COLUMN "payoutDate" SET DATA TYPE TEXT;
