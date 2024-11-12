import apiClient from "~/config/api-client";
import { type User } from "~/types/user";

export interface LoginRequest {
  cpf?: string;
  phone?: string;
  email?: string;
  password: string;
}

export interface LoginResponse extends User {
  token: string;
}

async function login(data: LoginRequest): Promise<LoginResponse | undefined> {
  try {
    const endpoint = "/auth/login";
    const method = "post";

    const { data: response, headers } = await apiClient[method]<LoginResponse>(
      endpoint,
      data,
    );
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

export const authRequest = {
  login,
};
