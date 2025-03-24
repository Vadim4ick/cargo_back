-- CreateTable
CREATE TABLE "CargoPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cargoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CargoPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CargoPhoto_url_key" ON "CargoPhoto"("url");

-- CreateIndex
CREATE UNIQUE INDEX "CargoPhoto_cargoId_key" ON "CargoPhoto"("cargoId");

-- AddForeignKey
ALTER TABLE "CargoPhoto" ADD CONSTRAINT "CargoPhoto_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
