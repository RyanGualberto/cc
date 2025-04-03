import apiClient from "~/config/api-client";
import { type RevenueCategory } from "~/types/revenue-category";

export interface CreateByTeamRequest {
  name: string;
  teamId: string;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/revenue-categories/teams/${payload.teamId}`;
    const method = "post";

    const { data: response } = await apiClient[method]<RevenueCategory>(
      endpoint,
      {
        name: payload.name,
      },
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface ListByTeamAndDateRequest {
  teamId: string;
}

async function listByTeam(params: ListByTeamAndDateRequest) {
  try {
    const endpoint = `/revenue-categories/teams/${params.teamId}`;
    const method = "get";

    const { data: response } =
      await apiClient[method]<Array<RevenueCategory>>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface RevenueCategoryRequest {
  payload: RevenueCategory;
  teamId: string;
}

async function updateByTeamAndId(params: RevenueCategoryRequest) {
  try {
    const { id, ...payload } = params.payload;
    const endpoint = `/revenue-categories/teams/${params.teamId}/${id}`;
    const method = "patch";

    const { data: response } = await apiClient[method]<RevenueCategory>(
      endpoint,
      payload,
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function deleteByTeamAndId(params: RevenueCategoryRequest) {
  try {
    const endpoint = `/revenue-categories/teams/${params.teamId}/${params.payload.id}`;
    const method = "delete";

    const { data: response } =
      await apiClient[method]<RevenueCategory>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const revenueCategoriesRequest = {
  createByTeam,
  listByTeam,
  updateByTeamAndId,
  deleteByTeamAndId,
};
