/*
  Warnings:

  - Added the required column `route` to the `Webpage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Webpage" ADD COLUMN     "route" TEXT NOT NULL;
