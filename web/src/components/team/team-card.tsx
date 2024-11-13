"use client";
import {
  EditIcon,
  MoreVertical,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { type Team } from "~/types/team";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EditTeamDialog from "./edit-team-dialog";
import { Button } from "../ui/button";
import DeleteTeamDialog from "./delete-team-dialog";

export const TeamCard: React.FC<{
  team: Team;
}> = ({ team }) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="flex h-32 w-full flex-col gap-2 rounded-xl bg-muted p-4 shadow-md duration-150 hover:scale-105 hover:transform md:w-64">
      <header className="flex items-center justify-between">
        <Link
          href={`/app/${team.id}/dashboard`}
          className="flex items-center gap-2"
        >
          <h3 className="font-semibold">{team.name}</h3>
          <SquareArrowOutUpRight size={16} />
        </Link>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              event.stopPropagation()
            }
          >
            <Button variant="ghost" size="icon">
              <MoreVertical size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-36">
            <ul className="flex flex-col gap-1">
              <EditTeamDialog
                team={team}
                trigger={
                  <Button
                    variant="ghost"
                    className="items-center justify-start gap-2"
                  >
                    <EditIcon size={16} />
                    Editar
                  </Button>
                }
              />
              <DeleteTeamDialog
                trigger={
                  <Button
                    variant="ghost"
                    className="items-center justify-start gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </Button>
                }
                team={team}
              />
            </ul>
          </PopoverContent>
        </Popover>
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
    </article>
  );
};
