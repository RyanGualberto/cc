"use client";
import {
  EditIcon,
  MoreVertical,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Team } from "~/types/team";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EditSpaceDialog from "./edit-space-dialog";
import { Button } from "../ui/button";

export const SpaceCard: React.FC<{
  team: Team;
}> = ({ team }) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="flex h-32 w-64 flex-col gap-2 rounded-xl bg-muted p-4 shadow-md duration-150 hover:scale-105 hover:transform">
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
              <EditSpaceDialog
                team={team}
                trigger={
                  <Button variant="ghost" className="items-center gap-2 justify-start">
                    <EditIcon size={16} />
                    Editar
                  </Button>
                }
              />
              <Button variant="ghost" className="items-center gap-2 justify-start">
                <Trash2 size={16} />
                Excluir
              </Button>
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
