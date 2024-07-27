import { user } from "./user";
import { team } from "./team";
import prisma from "../../src/clients/prismaClient";

export const expense = async (
  data?: Partial<{
    title: string;
    description: string;
    recurrence: string;
    amountInCents: number;
    userId: string;
    teamId: string;
  }>
) => {
  const userId = data?.userId || (await user()).id;
  const teamId = data?.teamId || (await team({ userId })).id;

  const expense = {
    title: data?.title || "Expense Title",
    description: data?.description || "Expense Description",
    recurrence: data?.recurrence || "monthly",
    amountInCents: data?.amountInCents || 1000,
    date: new Date(),
    userId,
    teamId,
  };

  return await prisma.expense.create({
    data: expense,
  });
};
