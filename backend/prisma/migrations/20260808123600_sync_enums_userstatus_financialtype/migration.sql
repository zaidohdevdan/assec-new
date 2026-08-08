-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "public"."UserStatus" AS ENUM ('Ativo', 'Inativo', 'Suspenso');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."FinancialType" AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "public"."FinancialRecord" 
  ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
  ALTER COLUMN "type" TYPE "public"."FinancialType" USING "type"::text::"public"."FinancialType";

-- AlterTable
ALTER TABLE "public"."User" 
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "public"."UserStatus" USING "status"::text::"public"."UserStatus",
  ALTER COLUMN "status" SET DEFAULT 'Ativo'::"public"."UserStatus";
