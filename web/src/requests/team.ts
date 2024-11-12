import apiClient from "~/config/api-client";
import { type Team } from "~/types/team";

export type ListTeamsResponse = Array<Team>;

async function listTeams(): Promise<ListTeamsResponse | undefined> {
  try {
    const endpoint = "/teams";
    const method = "get";
    console.log("listTeams");

    const { data: response } =
      await apiClient[method]<ListTeamsResponse>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface CreateTeamRequest {
  name: string;
}

export type CreateTeamResponse = Team;

async function createTeam(team: CreateTeamRequest): Promise<Team | undefined> {
  try {
    const endpoint = "/teams";
    const method = "post";
    const { data: response } = await apiClient[method]<CreateTeamResponse>(
      endpoint,
      team,
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const teamRequests = {
  createTeam,
  listTeams,
};
