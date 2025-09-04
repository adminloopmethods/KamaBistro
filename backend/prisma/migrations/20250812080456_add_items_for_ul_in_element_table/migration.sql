-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "items" TEXT[] DEFAULT ARRAY[]::TEXT[];
