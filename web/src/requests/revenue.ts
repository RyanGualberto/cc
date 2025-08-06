import apiClient from "~/config/api-client";
import { type Revenue } from "~/types/revenue";

export interface CreateByTeamRequest {
  teamId: string;
  description?: string;
  amountInCents: number;
  date: string;
  recurrence: "FIFTH_WORKING_DAY" | "MONTHLY" | "WEEKLY" | "DAILY" | "ONCE";
  status: "PENDING" | "RECEIVED" | "OVERDUE";
  title: string;
  category: string | undefined;
  until: string | undefined;
}

async function createByTeam(payload: CreateByTeamRequest) {
  try {
    const endpoint = `/revenues`;
    const method = "post";

    const { category, ...rest } = payload;

    const { data: response } = await apiClient[method]<Revenue>(endpoint, {
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
    const endpoint = `/revenues/${params.teamId}`;
    const method = "get";

    const { data: response } = await apiClient[method]<Array<Revenue>>(
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

export interface UpdateRevenueRequest {
  payload: {
    amountInCents: number;
    categoryId?: string | null;
    date: string;
    description: string | null;
    status: "PENDING" | "RECEIVED" | "OVERDUE";
    title: string;
    includeFuture?: boolean;
    editSelection?: "just-this" | "include-all" | "include-future";
  };
  teamId: string;
  revenueId: string;
}

async function updateByTeamAndId(params: UpdateRevenueRequest) {
  try {
    const endpoint = `/revenues/${params.teamId}/${params.revenueId}`;
    const method = "patch";

    const { data: response } = await apiClient[method]<Revenue>(
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
    const endpoint = `/revenues/${teamId}/${id}`;
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
    const endpoint = `/revenues/${teamId}/batch/${batchId}`;
    const method = "delete";

    await apiClient[method]<void>(endpoint);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const revenueRequest = {
  createByTeam,
  listByTeamAndDate,
  updateByTeamAndId,
  deleteByTeamAndId,
  deleteByTeamAndBatchId,
};
