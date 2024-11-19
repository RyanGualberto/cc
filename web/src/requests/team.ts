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

export interface UpdateTeamRequest {
  name: string;
  id: string;
}

export type UpdateTeamResponse = Team;

async function updateTeam(team: UpdateTeamRequest): Promise<Team | undefined> {
  try {
    const endpoint = "/teams/" + team.id;
    const method = "put";
    const { data: response } = await apiClient[method]<UpdateTeamResponse>(
      endpoint,
      {
        name: team.name,
      },
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function deleteTeam(id: string): Promise<void> {
  try {
    const endpoint = "/teams/" + id;
    const method = "delete";
    await apiClient[method]<void>(endpoint);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface TeamMemberInviteRequest {
  teamId: string;
  email: string;
}

async function teamMemberInvite(
  payload: TeamMemberInviteRequest,
): Promise<void> {
  try {
    const endpoint = `/teams/invites/create`;
    const method = "post";
    await apiClient[method]<void>(endpoint, payload);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const teamRequests = {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  teamMemberInvite,
};
