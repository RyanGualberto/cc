-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "expensePaymentMethodId" TEXT;

-- CreateTable
CREATE TABLE "expense_payment_methods" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "expense_payment_methods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expensePaymentMethodId_fkey" FOREIGN KEY ("expensePaymentMethodId") REFERENCES "expense_payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_payment_methods" ADD CONSTRAINT "expense_payment_methods_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
