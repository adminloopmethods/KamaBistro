/*
  Warnings:

  - A unique constraint covering the columns `[route,locationId]` on the table `Webpage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Webpage_route_key";

-- CreateIndex
CREATE UNIQUE INDEX "Webpage_route_locationId_key" ON "Webpage"("route", "locationId");
