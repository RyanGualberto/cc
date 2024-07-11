import prisma from "../../src/clients/prismaClient";
import { runCommand } from "./exec";

export async function reset() {
  return await prisma.user.deleteMany();
}

export async function setup() {
  await runCommand("npx prisma db push --accept-data-loss");
}

export const db = {
  setup,
  reset,
};
