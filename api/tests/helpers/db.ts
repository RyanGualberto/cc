import prisma from "../../src/clients/prismaClient";
import { runCommand } from "./exec";

const tableNames = [
  "team_invites",
  "expenses",
  "team_members",
  "teams",
  "users",
];

export async function updateSchema() {
  await runCommand("npx prisma db push --accept-data-loss");
}

export async function reset() {
  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
  }

  return true;
}

export const db = {
  reset,
  updateSchema,
};
