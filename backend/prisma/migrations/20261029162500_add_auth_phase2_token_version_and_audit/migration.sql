-- AlterTable
ALTER TABLE "public"."User"
ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."AuthEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "email" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthEvent_userId_idx" ON "public"."AuthEvent"("userId");

-- CreateIndex
CREATE INDEX "AuthEvent_action_idx" ON "public"."AuthEvent"("action");

-- CreateIndex
CREATE INDEX "AuthEvent_createdAt_idx" ON "public"."AuthEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."AuthEvent" ADD CONSTRAINT "AuthEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
