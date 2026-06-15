/*
  Warnings:

  - You are about to drop the `Inn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Inn";

-- CreateTable
CREATE TABLE "Benefit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT,
    "image" TEXT,
    "icon" TEXT,
    "location" TEXT,
    "amenities" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);
