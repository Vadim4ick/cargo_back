/*
  Warnings:

  - The `date` column on the `Cargo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `loadUnloadDate` column on the `Cargo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `payoutDate` column on the `Cargo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Cargo" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3),
ALTER COLUMN "payoutAmount" DROP NOT NULL,
ALTER COLUMN "payoutTerms" DROP NOT NULL,
DROP COLUMN "loadUnloadDate",
ADD COLUMN     "loadUnloadDate" TIMESTAMP(3),
DROP COLUMN "payoutDate",
ADD COLUMN     "payoutDate" TIMESTAMP(3);
