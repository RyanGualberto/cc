import { faker } from "@faker-js/faker";
import { TeamInviteInput, TeamModel } from "../../src/model/team";
import { user } from "./user";
import { team } from "./team";

export const teamInvite = async (data?: Partial<TeamInviteInput>) => {
  const userId = data?.userId || (await user()).id;
  const teamId = data?.teamId || (await team({ userId })).id;

  const teamInvite = {
    email: data?.email || faker.internet.email(),
    userId,
    teamId,
  };

  return await TeamModel.inviteTeamMembers(teamInvite);
};
