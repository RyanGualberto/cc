"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { hasCookie } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import { createContext, useCallback, useEffect } from "react";
import { teamRequests } from "~/requests/team";
import { userRequest } from "~/requests/user";
import { type Team } from "~/types/team";
import { type User } from "~/types/user";

interface IUserContext {
  user: User | undefined;
  teams: Array<Team>;
  selectedTeam: Team | undefined;
  refetchTeams: () => void;
  loadingTeams: boolean;
  loadingUser?: boolean;
  setTeam: (teamId: string) => Promise<void>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { ["team-id"]: teamId } = useParams<{ "team-id": string }>();
  const { data: selectedTeam } = useQuery({
    queryKey: ["selectedTeam"],
    queryFn: async () => {
      return teamRequests.findTeam(teamId);
    },
    enabled: hasCookie("token") && Boolean(teamId),
  });
  const { data: user, isLoading } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      return userRequest.whoami();
    },
    enabled: hasCookie("token"),
  });

  const { data: teams, isPending: loadingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      return teamRequests.listTeams();
    },
    enabled: hasCookie("token"),
  });

  const setTeam = useCallback(
    async (teamId: string) => {
      router.push(`/app/${teamId}/dashboard`);
      await queryClient.invalidateQueries({ queryKey: ["selectedTeam"] });
    },
    [queryClient, router],
  );

  const refetchTeams = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["teams"] }).catch((error) => {
      console.error("Error invalidating queries:", error);
    });
  }, [queryClient]);

  useEffect(() => {
    if (teamId) {
      queryClient
        .invalidateQueries({
          queryKey: ["selectedTeam"],
        })
        .catch((error) => {
          console.error("Error invalidating queries:", error);
        });
    }
  }, [teamId, queryClient]);

  return (
    <UserContext.Provider
      value={{
        user,
        teams: teams ?? [],
        selectedTeam,
        refetchTeams,
        loadingTeams,
        loadingUser: isLoading,
        setTeam,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
