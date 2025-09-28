-- CreateTable
CREATE TABLE "ToastToken" (
    "id" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "scope" TEXT,
    "idToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToastToken_pkey" PRIMARY KEY ("id")
);
