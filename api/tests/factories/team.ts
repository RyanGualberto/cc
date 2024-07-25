import { faker } from "@faker-js/faker";
import { TeamCreateInput, TeamModel } from "../../src/model/team";
import { user } from "./user";

export const team = async (data?: Partial<TeamCreateInput>) => {
  const team = {
    name: data?.name || faker.company.name(),
    userId: data?.userId || (await user()).id,
  };

  return await TeamModel.create(team);
};
