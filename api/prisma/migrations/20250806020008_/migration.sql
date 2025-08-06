-- DropForeignKey
ALTER TABLE "expense_payment_methods" DROP CONSTRAINT "expense_payment_methods_teamId_fkey";

-- AlterTable
ALTER TABLE "expense_payment_methods" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "expense_payment_methods" ADD CONSTRAINT "expense_payment_methods_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
