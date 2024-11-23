"use client";
import React from "react";
import AddTeamDialog from "~/components/team/add-team-dialog";
import { TeamCard } from "~/components/team/team-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { teams, loadingTeams } = useUserContext();
  return (
    <main className="flex h-full flex-1 flex-col gap-6 px-8 py-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">
            Meus espaços financeiros
          </h2>
          <p className="font-light opacity-80">
            Veja o resumo de todos os seus espaços financeiros.
          </p>
        </div>
        <AddTeamDialog />
      </header>
      <section className="flex h-full w-full flex-1 flex-col">
        {teams.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={{
                  ...team,
                  balance: team.balance ?? 0,
                  qtTransactions: team.qtTransactions ?? 0,
                }}
              />
            ))}
          </div>
        )}
        {teams.length === 0 && !loadingTeams && (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="opacity-70">
              Você ainda não possui nenhum espaço financeiro.
            </p>
          </div>
        )}
        {loadingTeams && (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="opacity-70">Carregando espaços financeiros...</p>
          </div>
        )}
      </section>
    </main>
  );
}
