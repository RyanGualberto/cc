import apiClient from "~/config/api-client";
import { type ExpensePaymentMethod } from "~/types/expense-payment-method";

export interface CreateByTeamRequest {
  name: string;
  teamId: string;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/expense-payment-methods/teams/${payload.teamId}`;
    const method = "post";

    const { data: response } = await apiClient[method]<ExpensePaymentMethod>(
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
    const endpoint = `/expense-payment-methods/teams/${params.teamId}`;
    const method = "get";

    const { data: response } =
      await apiClient[method]<Array<ExpensePaymentMethod>>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface ExpensePaymentMethodRequest {
  payload: ExpensePaymentMethod;
  teamId: string;
}

async function updateByTeamAndId(params: ExpensePaymentMethodRequest) {
  try {
    const { id, ...payload } = params.payload;
    const endpoint = `/expense-payment-methods/teams/${params.teamId}/${id}`;
    const method = "patch";

    const { data: response } = await apiClient[method]<ExpensePaymentMethod>(
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

async function deleteByTeamAndId(params: ExpensePaymentMethodRequest) {
  try {
    const endpoint = `/expense-payment-methods/teams/${params.teamId}/${params.payload.id}`;
    const method = "delete";

    const { data: response } =
      await apiClient[method]<ExpensePaymentMethod>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const expensePaymentMethodsRequest = {
  createByTeam,
  listByTeam,
  updateByTeamAndId,
  deleteByTeamAndId,
};
