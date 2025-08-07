-- CreateTable
CREATE TABLE "version" (
    "id" TEXT NOT NULL,
    "version" JSONB NOT NULL,
    "webpageId" TEXT NOT NULL,

    CONSTRAINT "version_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_webpageId_fkey" FOREIGN KEY ("webpageId") REFERENCES "Webpage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
