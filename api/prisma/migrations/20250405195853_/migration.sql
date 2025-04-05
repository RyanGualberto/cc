/*
  Warnings:

  - Changed the type of `recurrence` on the `revenues` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "revenues" DROP COLUMN "recurrence",
ADD COLUMN     "recurrence" "RevenueRecurrence" NOT NULL;
