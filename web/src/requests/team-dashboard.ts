import apiClient from "~/config/api-client";
import { type Expense } from "~/types/expense";
import { type Revenue } from "~/types/revenue";

export interface GetTimeLineRequest {
  teamId: string;
  date: string;
}

export interface GetTimeLineResponse {
  expenses: {
    date: string;
    expenses: Expense[];
  }[];
  revenues: {
    date: string;
    revenues: Revenue[];
  }[];
}

async function getTimeline(params: GetTimeLineRequest) {
  try {
    const endpoint = `/teams-dashboard/${params.teamId}/timeline`;
    const method = "get";

    const { data: response } = await apiClient[method]<GetTimeLineResponse>(
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

export const teamDashboardRequest = {
  getTimeline,
};
