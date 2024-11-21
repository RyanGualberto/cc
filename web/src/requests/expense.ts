import apiClient from "~/config/api-client";
import { type Expense } from "~/types/expense";

export interface CreateByTeamRequest {
  teamId: string;
  description?: string;
  amountInCents: number;
  date: string;
  recurrence: string;
  status: string;
  title: string;
  category: string | undefined;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/expenses`;
    const method = "post";

    const { category, ...rest } = payload;

    const { data: response } = await apiClient[method]<Expense>(endpoint, {
      ...rest,
      categoryId: category,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface ListByTeamAndDateRequest {
  teamId: string;
  date: string;
}

async function listByTeamAndDate(params: ListByTeamAndDateRequest) {
  try {
    const endpoint = `/expenses/${params.teamId}`;
    const method = "get";

    const { data: response } = await apiClient[method]<Array<Expense>>(
      endpoint,
      {
        params: {
          date: params.date,
        },
      },
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface UpdateExpenseRequest {
  payload: Expense;
  teamId: string;
}

async function updateByTeamAndId(params: UpdateExpenseRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, user, id, ...payload } = params.payload;
    const endpoint = `/expenses/${params.teamId}/${id}`;
    const method = "put";

    const { data: response } = await apiClient[method]<Expense>(endpoint, {
      ...payload,
      categoryId: params.payload.category.id,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function deleteByTeamAndId({
  teamId,
  id,
}: {
  teamId: string;
  id: string;
}) {
  try {
    const endpoint = `/expenses/${teamId}/${id}`;
    const method = "delete";

    await apiClient[method]<void>(endpoint);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function deleteByTeamAndBatchId({
  teamId,
  batchId,
}: {
  teamId: string;
  batchId: string;
}) {
  try {
    const endpoint = `/expenses/${teamId}/batch/${batchId}`;
    const method = "delete";

    await apiClient[method]<void>(endpoint);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const expenseRequest = {
  createByTeam,
  listByTeamAndDate,
  updateByTeamAndId,
  deleteByTeamAndId,
  deleteByTeamAndBatchId,
};
