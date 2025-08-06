-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_teamId_fkey";

-- DropForeignKey
ALTER TABLE "revenues" DROP CONSTRAINT "revenues_teamId_fkey";

-- DropForeignKey
ALTER TABLE "team_invites" DROP CONSTRAINT "team_invites_teamId_fkey";

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
