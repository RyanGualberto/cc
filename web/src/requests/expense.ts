import apiClient from "~/config/api-client";
import { type Expense } from "~/types/expense";

export interface CreateByTeamRequest {
  teamId: string;
  description?: string;
  amountInCents: number;
  date: string;
  recurrence: "MONTHLY" | "WEEKLY" | "DAILY" | "ONCE";
  status: "PENDING" | "PAID" | "OVERDUE";
  title: string;
  category: string | undefined;
  until: string | undefined;
  paymentMethod: string | undefined;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/expenses`;
    const method = "post";

    const { category, paymentMethod, ...rest } = payload;

    const { data: response } = await apiClient[method]<Expense>(endpoint, {
      ...rest,
      categoryId: category,
      paymentMethodId: paymentMethod,
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
  payload: {
    amountInCents: number;
    categoryId: string | null;
    date: string;
    description: string | null;
    status: "PENDING" | "PAID" | "OVERDUE";
    title: string;
    includeFuture?: boolean;
    paymentMethodId: string | null;
  };
  teamId: string;
  expenseId: string;
}

async function updateByTeamAndId(params: UpdateExpenseRequest) {
  try {
    const endpoint = `/expenses/${params.teamId}/${params.expenseId}`;
    const method = "patch";

    const { data: response } = await apiClient[method]<Expense>(
      endpoint,
      params.payload,
    );
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
