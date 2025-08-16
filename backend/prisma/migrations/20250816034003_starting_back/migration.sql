-- AlterTable
ALTER TABLE "Webpage" ADD COLUMN     "editorId" TEXT,
ADD COLUMN     "verifierId" TEXT;

-- CreateIndex
CREATE INDEX "User_locationId_idx" ON "User"("locationId");

-- CreateIndex
CREATE INDEX "Webpage_editorId_idx" ON "Webpage"("editorId");

-- CreateIndex
CREATE INDEX "Webpage_verifierId_idx" ON "Webpage"("verifierId");
