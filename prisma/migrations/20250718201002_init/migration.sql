-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fastener" (
    "id" SERIAL NOT NULL,
    "partNumber" TEXT NOT NULL,
    "type" TEXT,
    "locationDesc" TEXT,
    "locationTags" TEXT,
    "attributes" JSONB,
    "imageUrl" TEXT,
    "embedding" JSONB,

    CONSTRAINT "Fastener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fitment" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "fastenerId" INTEGER NOT NULL,

    CONSTRAINT "Fitment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_year_make_model_key" ON "Vehicle"("year", "make", "model");

-- CreateIndex
CREATE UNIQUE INDEX "Fastener_partNumber_key" ON "Fastener"("partNumber");

-- AddForeignKey
ALTER TABLE "Fitment" ADD CONSTRAINT "Fitment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fitment" ADD CONSTRAINT "Fitment_fastenerId_fkey" FOREIGN KEY ("fastenerId") REFERENCES "Fastener"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
