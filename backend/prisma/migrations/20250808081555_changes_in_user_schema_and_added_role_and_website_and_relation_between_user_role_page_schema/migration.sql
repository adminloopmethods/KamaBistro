/*
  Warnings:

  - You are about to drop the column `deleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RequestApproval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceVersioningRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_locationId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deleted";

-- DropTable
DROP TABLE "RequestApproval";

-- DropTable
DROP TABLE "ResourceVersioningRequest";

-- DropTable
DROP TABLE "WorkflowState";

-- CreateTable
CREATE TABLE "PageUserRole" (
    "userId" TEXT NOT NULL,
    "webpageId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageUserRole_pkey" PRIMARY KEY ("userId","webpageId","roleId")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webpage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webpage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "webpageId" TEXT,
    "parentId" TEXT,
    "styleId" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Element" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "contentId" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL,
    "xl" JSONB,
    "lg" JSONB,
    "md" JSONB,
    "sm" JSONB,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "version" (
    "id" TEXT NOT NULL,
    "version" JSONB NOT NULL,
    "webpageId" TEXT NOT NULL,

    CONSTRAINT "version_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageUserRole_userId_idx" ON "PageUserRole"("userId");

-- CreateIndex
CREATE INDEX "PageUserRole_webpageId_idx" ON "PageUserRole"("webpageId");

-- CreateIndex
CREATE INDEX "PageUserRole_roleId_idx" ON "PageUserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "PageUserRole_webpageId_roleId_key" ON "PageUserRole"("webpageId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Webpage_locationId_idx" ON "Webpage"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_styleId_key" ON "Content"("styleId");

-- CreateIndex
CREATE INDEX "Content_webpageId_idx" ON "Content"("webpageId");

-- CreateIndex
CREATE INDEX "Content_parentId_idx" ON "Content"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Element_styleId_key" ON "Element"("styleId");

-- CreateIndex
CREATE INDEX "Element_contentId_idx" ON "Element"("contentId");

-- CreateIndex
CREATE INDEX "version_webpageId_idx" ON "version"("webpageId");
