"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <main className="flex h-full flex-1 flex-col gap-2 px-8 py-6">
      <header className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{selectedTeam.name}</h2>
          <p className="font-light opacity-80">
            Veja o resumo de todos os seus espaços financeiros.
          </p>
        </div>
      </header>
      <nav></nav>
    </main>
  );
}
