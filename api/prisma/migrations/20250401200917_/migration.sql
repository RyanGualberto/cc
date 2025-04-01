/*
  Warnings:

  - The `status` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `revenues` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `recurrence` on the `expenses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RevenueStatus" AS ENUM ('PENDING', 'RECEIVED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "RevenueRecurrence" AS ENUM ('MONTHLY', 'WEEKLY', 'DAILY', 'ONCE');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ExpenseRecurrence" AS ENUM ('MONTHLY', 'WEEKLY', 'DAILY', 'ONCE');

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "recurrence",
ADD COLUMN     "recurrence" "ExpenseRecurrence" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "revenues" DROP COLUMN "status",
ADD COLUMN     "status" "RevenueStatus" NOT NULL DEFAULT 'PENDING';
