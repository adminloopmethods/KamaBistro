/*
  Warnings:

  - A unique constraint covering the columns `[styleId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[styleId]` on the table `Element` will be added. If there are existing duplicate values, this will fail.
  - Made the column `styleId` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "styleId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Content_styleId_key" ON "Content"("styleId");

-- CreateIndex
CREATE UNIQUE INDEX "Element_styleId_key" ON "Element"("styleId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
