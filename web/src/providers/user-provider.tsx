"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useState } from "react";
import { teamRequests } from "~/requests/team";
import { userRequest } from "~/requests/user";
import { type Team } from "~/types/team";
import { type User } from "~/types/user";

interface IUserContext {
  user: User | undefined;
  teams: Array<Team>;
  selectedTeam: Team | undefined;
  setSelectedTeam: (team: Team) => void;
  refetchTeams: () => void;
  loadingTeams: boolean;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const { data: user } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      return userRequest.whoami();
    },
  });

  const { data: teams, isPending: loadingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      return teamRequests.listTeams();
    },
  });

  const refetchTeams = useCallback(() => {
    console.log("Refetching teams...");

    queryClient.invalidateQueries({ queryKey: ["teams"] }).catch((error) => {
      console.error("Error invalidating queries:", error);
    });
  }, [queryClient]);

  return (
    <UserContext.Provider
      value={{
        user,
        teams: teams ?? [],
        selectedTeam: selectedTeam,
        setSelectedTeam: setSelectedTeam,
        refetchTeams,
        loadingTeams,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
