import { user } from "./user";
import { team } from "./team";
import prisma from "../../src/clients/prismaClient";

export const teamMember = async (
  data?: Partial<{
    teamId: string;
    userId: string;
    role: string;
  }>
) => {
  const userId = data?.userId || (await user()).id;
  const teamId = data?.teamId || (await team({ userId })).id;

  const teamMember = {
    userId,
    teamId,
    role: data?.role || "MEMBER",
  };

  return await prisma.teamMember.create({
    data: teamMember,
  });
};
