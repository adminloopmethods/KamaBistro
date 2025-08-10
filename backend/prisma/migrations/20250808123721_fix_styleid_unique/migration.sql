/*
  Warnings:

  - Added the required column `currentVersion` to the `Webpage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Webpage" ADD COLUMN     "currentVersion" TEXT NOT NULL;
