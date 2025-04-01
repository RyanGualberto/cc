import apiClient from "~/config/api-client";
import { type User } from "~/types/user";

async function whoami(): Promise<User | undefined> {
  try {
    const endpoint = "/auth/me";
    const method = "get";

    const { data: response } = await apiClient[method]<User>(endpoint);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const userRequest = {
  whoami,
};
