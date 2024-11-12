"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useCallback } from "react";
import { authRequest, type LoginRequest } from "~/requests/auth";
import { type UserCreateRequest, userRequest } from "~/requests/user";

const INITIAL_ROUTE = "/app/teams";

export const useAuth = () => {
  const router = useRouter();
  const { mutateAsync: login } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: LoginRequest) => {
      return await authRequest.login(values);
    },
    onSuccess: (data) => {
      afterLogin(data);
    },
  });

  const { mutateAsync: register } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (values: UserCreateRequest) => {
      return await userRequest.createUser(values);
    },
    onSuccess: (data) => {
      afterLogin(data);
    },
  });

  const afterLogin = useCallback(
    (data: { token: string } | undefined) => {
      if (!data) return;

      setCookie(null, "token", data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      router.push(INITIAL_ROUTE);
    },
    [router],
  );

  return {
    login,
    register,
  };
};
