"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { authRequest, type LoginRequest } from "~/requests/auth";
import { type UserCreateRequest, userRequest } from "~/requests/user";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
const INITIAL_ROUTE = "/app/teams";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
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
      setCookie("token", data.token);
      const pathname = getCookie("callback_pathname");
      const url = pathname
        ? `${pathname}?${searchParams.toString()}`
        : INITIAL_ROUTE;
      console.log("url", url);

      router.push(url);
      void queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["whoami"],
      });

      deleteCookie("callback_pathname");
    },
    [router, queryClient, searchParams],
  );

  const logout = useCallback(() => {
    deleteCookie("token");
    router.push("/auth/login");
  }, [router]);

  return {
    login,
    register,
    logout,
  };
};
