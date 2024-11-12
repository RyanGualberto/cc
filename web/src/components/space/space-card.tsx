import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Team } from "~/types/team";

export const SpaceCard: React.FC<{
  team: Team;
}> = ({ team }) => {
  return (
    <Link
      href={`/app/${team.id}/dashboard`}
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
  );
};
