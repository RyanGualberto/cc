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

    const { data: response } = await apiClient[method]<LoginResponse>(
      endpoint,
      data,
    );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
}

export interface UserCreateResponse extends User {
  token: string;
}

async function register(
  data: UserCreateRequest,
): Promise<UserCreateResponse | undefined> {
  try {
    const endpoint = "/auth/register";
    const method = "post";

    const { data: response } = await apiClient[method]<UserCreateResponse>(
      endpoint,
      data,
    );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const authRequest = {
  login,
  register,
};
