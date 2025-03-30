-- DropIndex
DROP INDEX "CargoPhoto_cargoId_key";

-- DropIndex
DROP INDEX "CargoPhoto_url_key";

-- AlterTable
ALTER TABLE "Cargo" ADD COLUMN     "driver" TEXT,
ADD COLUMN     "loadUnloadDate" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "payoutDate" TIMESTAMP(3);
