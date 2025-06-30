/*
  Warnings:

  - Added the required column `endDate` to the `TestCycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `TestCycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TestStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "TestStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "TestCycle" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
