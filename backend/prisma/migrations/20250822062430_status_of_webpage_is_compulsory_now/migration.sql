/*
  Warnings:

  - Made the column `Status` on table `Webpage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Webpage" ALTER COLUMN "Status" SET NOT NULL;
