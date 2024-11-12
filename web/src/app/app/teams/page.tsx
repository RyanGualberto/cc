"use client";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddSpaceDialog from "~/components/space/add-space-dialog";
import { SpaceCard } from "~/components/space/space-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { teams, loadingTeams } = useUserContext();
  return (
    <main className="flex h-full flex-1 flex-col gap-6 px-8 py-6">
      <header className="flex justify-between flex-col md:flex-row gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Meus espaços financeiros</h2>
          <p className="font-light opacity-80">
            Veja o resumo de todos os seus espaços financeiros.
          </p>
        </div>
        <AddSpaceDialog />
      </header>
      <section className="flex h-full w-full flex-1 flex-col">
        {teams.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {teams.map((team) => (
              <SpaceCard key={team.id} team={team} />
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
