import apiClient from "~/config/api-client";
import { type User } from "~/types/user";

export interface UserCreateRequest {
  first_name: string;
  last_name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
}

export interface UserCreateResponse extends User {
  token: string;
}

async function createUser(
  data: UserCreateRequest,
): Promise<UserCreateResponse | undefined> {
  try {
    const endpoint = "/users";
    const method = "post";

    const { data: response, headers } = await apiClient[
      method
    ]<UserCreateResponse>(endpoint, data);
    const token = (headers.authorization as string).split(" ")[1];

    if (!token) {
      throw new Error("Token not found");
    }

    return {
      ...response,
      token,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function whoami(): Promise<User | undefined> {
  try {
    const endpoint = "/users/me";
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
  createUser,
  whoami,
};
