import apiClient from "~/config/api-client";
import { type TeamInvite, type Team } from "~/types/team";

export type ListTeamsResponse = Array<Team>;

async function listTeams(): Promise<ListTeamsResponse | undefined> {
  try {
    const endpoint = "/teams";
    const method = "get";

    const { data: response } =
      await apiClient[method]<ListTeamsResponse>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function findTeam(id?: string): Promise<Team | undefined> {
  try {
    if (!id) {
      return undefined;
    }
    const endpoint = `/teams/${id}`;
    const method = "get";

    const { data: response } = await apiClient[method]<Team>(endpoint);
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
    const method = "patch";
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
    const endpoint = `/team-members/invites`;
    const method = "post";
    await apiClient[method]<void>(endpoint, payload);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function listTeamInvites(
  teamId: string,
): Promise<Array<TeamInvite> | undefined> {
  try {
    const endpoint = `/team-members/${teamId}/invites`;
    const method = "get";
    const { data: response } =
      await apiClient[method]<Array<TeamInvite>>(endpoint);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function findTeamByInviteToken(token: string): Promise<Team | undefined> {
  try {
    const endpoint = `/team-members/invites/${token}`;
    const method = "get";
    const { data: response } = await apiClient[method]<Team>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function acceptTeamInvite(token: string): Promise<void> {
  try {
    const endpoint = `/team-members/invites/accept/${token}`;
    const method = "post";
    await apiClient[method]<void>(endpoint);

    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function removeTeamInvite(
  teamId: string,
  inviteId: string,
): Promise<void> {
  try {
    const endpoint = `/team-members/${teamId}/invites/${inviteId}`;
    const method = "delete";
    await apiClient[method]<void>(endpoint);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function removeTeamMember(
  teamId: string,
  memberId: string,
): Promise<void> {
  try {
    const endpoint = `/team-members/${teamId}/${memberId}`;
    const method = "delete";
    await apiClient[method]<void>(endpoint);
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
  listTeamInvites,
  findTeamByInviteToken,
  acceptTeamInvite,
  removeTeamInvite,
  removeTeamMember,
  findTeam,
};
