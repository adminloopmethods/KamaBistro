/*
  Warnings:

  - You are about to drop the column `url` on the `Element` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "url",
ADD COLUMN     "href" TEXT;
