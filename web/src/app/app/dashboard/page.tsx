"use client";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddSpaceDialog from "~/components/space/add-space-dialog";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { teams, loadingTeams } = useUserContext();
  return (
    <main className="flex h-full flex-1 flex-col gap-2 px-8 py-6">
      <header className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Meus espaços financeiros</h2>
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
              <Link
                href={`/app/space/${team.id}`}
                key={team.id}
                className="flex h-32 w-64 flex-col gap-2 rounded-xl bg-muted p-4 shadow-md duration-150 hover:scale-105 hover:transform"
              >
                <header className="flex items-center gap-2">
                  <h3 className="font-semibold">{team.name}</h3>
                  <SquareArrowOutUpRight size={16} />
                </header>
                <p className="text-sm font-light opacity-80"></p>
                <div className="flex flex-1 items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">R$ 0,00</p>
                    <p className="text-sm font-light opacity-80">Saldo</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">0</p>
                    <p className="text-sm font-light opacity-80">Transações</p>
                  </div>
                </div>
              </Link>
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
