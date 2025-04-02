/*
  Warnings:

  - Changed the type of `role` on the `team_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "role",
ADD COLUMN     "role" "TeamMemberRole" NOT NULL;
