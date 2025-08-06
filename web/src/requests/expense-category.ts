import apiClient from "~/config/api-client";
import { type ExpenseCategory } from "~/types/expense-category";

export interface CreateByTeamRequest {
  name: string;
  teamId: string;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/expense-categories/teams/${payload.teamId}`;
    const method = "post";

    const { data: response } = await apiClient[method]<ExpenseCategory>(
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
  date?: string;
}

async function listByTeam(params: ListByTeamAndDateRequest) {
  try {
    const endpoint = `/expense-categories/teams/${params.teamId}`;
    const method = "get";

    const { data: response } = await apiClient[method]<Array<ExpenseCategory>>(
      endpoint,
      {
        params: { date: params.date },
      },
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface ExpenseCategoryRequest {
  payload: ExpenseCategory;
  teamId: string;
}

async function updateByTeamAndId(params: ExpenseCategoryRequest) {
  try {
    const { id, ...payload } = params.payload;
    const endpoint = `/expense-categories/teams/${params.teamId}/${id}`;
    const method = "patch";

    const { data: response } = await apiClient[method]<ExpenseCategory>(
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

async function deleteByTeamAndId(params: ExpenseCategoryRequest) {
  try {
    const endpoint = `/expense-categories/teams/${params.teamId}/${params.payload.id}`;
    const method = "delete";

    const { data: response } =
      await apiClient[method]<ExpenseCategory>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const expenseCategoriesRequest = {
  createByTeam,
  listByTeam,
  updateByTeamAndId,
  deleteByTeamAndId,
};
