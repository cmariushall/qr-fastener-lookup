/*
  Warnings:

  - A unique constraint covering the columns `[year,make,model]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_year_make_model_key" ON "Vehicle"("year", "make", "model");
