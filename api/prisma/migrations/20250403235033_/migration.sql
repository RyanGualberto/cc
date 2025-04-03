/*
  Warnings:

  - The values [USER] on the enum `TeamMemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TeamMemberRole_new" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
ALTER TABLE "team_members" ALTER COLUMN "role" TYPE "TeamMemberRole_new" USING ("role"::text::"TeamMemberRole_new");
ALTER TYPE "TeamMemberRole" RENAME TO "TeamMemberRole_old";
ALTER TYPE "TeamMemberRole_new" RENAME TO "TeamMemberRole";
DROP TYPE "TeamMemberRole_old";
COMMIT;
