import apiClient from "~/config/api-client";
import { type ExpenseCategory } from "~/types/expense-category";

export interface CreateByTeamRequest {
  name: string;
  teamId: string;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/expense-categories`;
    const method = "post";

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

export interface ListByTeamAndDateRequest {
  teamId: string;
}

async function listByTeam(params: ListByTeamAndDateRequest) {
  try {
    const endpoint = `/expense-categories/${params.teamId}`;
    const method = "get";

    const { data: response } =
      await apiClient[method]<Array<ExpenseCategory>>(endpoint);
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
    const endpoint = `/expense-categories/${params.teamId}/${id}`;
    const method = "put";

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

export const expenseCategoriesRequest = {
  createByTeam,
  listByTeam,
  updateByTeamAndId,
};
