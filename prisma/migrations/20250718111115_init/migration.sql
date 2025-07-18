-- CreateTable
CREATE TABLE "Vehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Fastener" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partNumber" TEXT NOT NULL,
    "type" TEXT,
    "locationDesc" TEXT,
    "locationTags" TEXT,
    "attributes" JSONB,
    "imageUrl" TEXT,
    "embedding" JSONB
);

-- CreateTable
CREATE TABLE "Fitment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vehicleId" INTEGER NOT NULL,
    "fastenerId" INTEGER NOT NULL,
    CONSTRAINT "Fitment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fitment_fastenerId_fkey" FOREIGN KEY ("fastenerId") REFERENCES "Fastener" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Fastener_partNumber_key" ON "Fastener"("partNumber");
