/*
  Warnings:

  - You are about to drop the column `contents` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `elementId` on the `Style` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[styleId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[styleId]` on the table `Element` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `styleId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webpageId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `styleId` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `xl` on the `Style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lg` on the `Style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `md` on the `Style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sm` on the `Style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_elementId_fkey";

-- DropIndex
DROP INDEX "Style_elementId_key";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "styleId" TEXT NOT NULL,
ADD COLUMN     "webpageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "contents",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "styleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "elementId",
DROP COLUMN "xl",
ADD COLUMN     "xl" JSONB NOT NULL,
DROP COLUMN "lg",
ADD COLUMN     "lg" JSONB NOT NULL,
DROP COLUMN "md",
ADD COLUMN     "md" JSONB NOT NULL,
DROP COLUMN "sm",
ADD COLUMN     "sm" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Webpage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Webpage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_styleId_key" ON "Content"("styleId");

-- CreateIndex
CREATE UNIQUE INDEX "Element_styleId_key" ON "Element"("styleId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_webpageId_fkey" FOREIGN KEY ("webpageId") REFERENCES "Webpage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
