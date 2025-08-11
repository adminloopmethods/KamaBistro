/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `Webpage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Webpage_route_key" ON "Webpage"("route");
