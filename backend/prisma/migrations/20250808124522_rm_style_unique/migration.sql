-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_styleId_fkey";

-- DropIndex
DROP INDEX "Content_styleId_key";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "styleId" DROP NOT NULL;
