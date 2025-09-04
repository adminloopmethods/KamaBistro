-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('PUBLISHED', 'ARCHIVED', 'TRASHED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'TRASHED');

-- CreateEnum
CREATE TYPE "otpOrigin" AS ENUM ('MFA_Login', 'forgot_Pass', 'NULL');

-- CreateEnum
CREATE TYPE "logOutcome" AS ENUM ('Success', 'Failure', 'Unknown');

-- CreateEnum
CREATE TYPE "logAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'NULL');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('MAIN_PAGE', 'SUB_PAGE', 'SUB_PAGE_ITEM', 'FORM', 'HEADER', 'FOOTER', 'NULL');

-- CreateEnum
CREATE TYPE "ResourceTag" AS ENUM ('HOME', 'ABOUT', 'SOLUTION', 'SERVICE', 'MARKET', 'PROJECT', 'CAREER', 'NEWS', 'TESTIMONIAL', 'CONTACT', 'HEADER', 'FOOTER', 'HISTORY', 'SAFETY_RESPONSIBILITY', 'VISION', 'HSE', 'AFFILIATES', 'ORGANIZATION_CHART', 'TEMPLATE_ONE', 'TEMPLATE_TWO', 'TEMPLATE_THREE', 'TEMPLATE_FOUR', 'BOXES', 'NULL');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('PARENT', 'CHILD', 'NULL');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('EDITING', 'DRAFT', 'VERIFICATION_PENDING', 'REJECTED', 'PUBLISH_PENDING', 'SCHEDULED', 'PUBLISHED', 'LIVE', 'NULL');

-- CreateEnum
CREATE TYPE "ResourceRoleType" AS ENUM ('MANAGER', 'EDITOR', 'PUBLISHER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('VERIFICATION_PENDING', 'PUBLISH_PENDING', 'PUBLISHED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SCHEDULED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('VERIFICATION', 'PUBLICATION');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action_performed" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "browserInfo" TEXT,
    "outcome" "logOutcome" NOT NULL DEFAULT 'Unknown',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "otpCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "otpOrigin" "otpOrigin" NOT NULL DEFAULT 'NULL',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockUntil" TIMESTAMP(3),

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuditLog" (
    "auditLogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("auditLogId","userId")
);

-- CreateTable
CREATE TABLE "ResourceVersionSection" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "resourceVersionId" TEXT NOT NULL,
    "sectionVersionId" TEXT NOT NULL,

    CONSTRAINT "ResourceVersionSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVersioningRequest" (
    "id" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'VERIFICATION_PENDING',
    "flowStatus" "FlowStatus" NOT NULL DEFAULT 'PENDING',
    "type" "RequestType" NOT NULL,
    "editorComments" TEXT,
    "resourceVersionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceVersioningRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestApproval" (
    "id" TEXT NOT NULL,
    "stage" INTEGER,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "requestId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "approverStatus" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowState" (
    "id" TEXT NOT NULL,
    "fromState" "VersionStatus" NOT NULL,
    "toState" "VersionStatus" NOT NULL,
    "allowedRole" "ResourceRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "response" TEXT,
    "sendOnEmail" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "phone" TEXT NOT NULL DEFAULT '',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_id_idx" ON "AuditLog"("id");

-- CreateIndex
CREATE INDEX "Media_resourceId_idx" ON "Media"("resourceId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "user_device_origin_idx" ON "Otp"("userId", "deviceId", "otpOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_deviceId_otpOrigin_key" ON "Otp"("userId", "deviceId", "otpOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_userId_key" ON "RateLimit"("userId");

-- CreateIndex
CREATE INDEX "RateLimit_userId_idx" ON "RateLimit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuditLog_auditLogId_key" ON "UserAuditLog"("auditLogId");

-- CreateIndex
CREATE INDEX "UserAuditLog_auditLogId_idx" ON "UserAuditLog"("auditLogId");

-- CreateIndex
CREATE INDEX "UserAuditLog_userId_idx" ON "UserAuditLog"("userId");

-- CreateIndex
CREATE INDEX "ResourceVersionSection_resourceVersionId_order_idx" ON "ResourceVersionSection"("resourceVersionId", "order");

-- CreateIndex
CREATE INDEX "ResourceVersionSection_resourceVersionId_idx" ON "ResourceVersionSection"("resourceVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersionSection_sectionVersionId_idx" ON "ResourceVersionSection"("sectionVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionSection_resourceVersionId_sectionVersionId_key" ON "ResourceVersionSection"("resourceVersionId", "sectionVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_resourceVersionId_idx" ON "ResourceVersioningRequest"("resourceVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_senderId_idx" ON "ResourceVersioningRequest"("senderId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_resourceVersionId_status_idx" ON "ResourceVersioningRequest"("resourceVersionId", "status");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_status_type_idx" ON "ResourceVersioningRequest"("status", "type");

-- CreateIndex
CREATE INDEX "RequestApproval_requestId_status_idx" ON "RequestApproval"("requestId", "status");

-- CreateIndex
CREATE INDEX "RequestApproval_approverId_idx" ON "RequestApproval"("approverId");

-- CreateIndex
CREATE INDEX "RequestApproval_requestId_idx" ON "RequestApproval"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestApproval_requestId_approverId_stage_key" ON "RequestApproval"("requestId", "approverId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "RequestApproval_requestId_approverId_approverStatus_stage_key" ON "RequestApproval"("requestId", "approverId", "approverStatus", "stage");

-- CreateIndex
CREATE INDEX "WorkflowState_fromState_idx" ON "WorkflowState"("fromState");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowState_fromState_toState_allowedRole_key" ON "WorkflowState"("fromState", "toState", "allowedRole");

-- CreateIndex
CREATE INDEX "Reminder_senderId_idx" ON "Reminder"("senderId");

-- CreateIndex
CREATE INDEX "Reminder_receiverId_idx" ON "Reminder"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_locationId_idx" ON "User"("locationId");
