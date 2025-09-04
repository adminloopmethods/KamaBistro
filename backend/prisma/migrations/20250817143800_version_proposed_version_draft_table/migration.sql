-- CreateTable
CREATE TABLE "proposedVersion" (
    "id" TEXT NOT NULL,
    "version" JSONB NOT NULL,
    "webpageId" TEXT NOT NULL,
    "editorId" TEXT NOT NULL,
    "verifierId" TEXT NOT NULL,

    CONSTRAINT "proposedVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft" (
    "id" TEXT NOT NULL,
    "version" JSONB NOT NULL,
    "webpageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "draft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proposedVersion_webpageId_idx" ON "proposedVersion"("webpageId");

-- CreateIndex
CREATE INDEX "proposedVersion_editorId_idx" ON "proposedVersion"("editorId");

-- CreateIndex
CREATE INDEX "proposedVersion_verifierId_idx" ON "proposedVersion"("verifierId");

-- CreateIndex
CREATE INDEX "draft_webpageId_idx" ON "draft"("webpageId");

-- CreateIndex
CREATE INDEX "draft_userId_idx" ON "draft"("userId");
