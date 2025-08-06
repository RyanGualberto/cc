-- DropForeignKey
ALTER TABLE "expense_categories" DROP CONSTRAINT "expense_categories_teamId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_categories" DROP CONSTRAINT "revenue_categories_teamId_fkey";

-- AlterTable
ALTER TABLE "expense_categories" ALTER COLUMN "teamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "revenue_categories" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_categories" ADD CONSTRAINT "revenue_categories_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
