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
      void queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["whoami"],
      });

      const pathname = getCookie("callback_pathname");

      console.log("pathname", pathname);
      if (pathname) {
        router.push(pathname + "?" + searchParams.toString());

        deleteCookie("callback_pathname");
        return;
      }

      router.push(INITIAL_ROUTE);
      return;
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
