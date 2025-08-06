"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BellRing, LogOut, Settings, User, Wallet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useUserContext } from "~/hooks/use-user-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const params = useParams();
  const { logout } = useAuth();
  const { user, selectedTeam, teams } = useUserContext();
  const [team, setTeam] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (selectedTeam) {
      setTeam(selectedTeam.id);
    }
  }, [selectedTeam]);
  const { push } = useRouter();

  React.useEffect(() => {
    if (team && !params["team-id"]) {
      push(`/app/${team}/dashboard`);
    }
  }, [team, push, params]);

  return (
    <header className="flex flex-col gap-4 border-b px-4 py-3 md:px-8 md:py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={"/app/teams"} className="mr-4 flex items-center gap-2">
            <Wallet width={28} height={28} />
            <span className="text-xl font-bold">Recebee</span>
          </Link>
          {selectedTeam && (
            <Select value={team ?? undefined} onValueChange={setTeam}>
              <SelectTrigger className="hidden min-w-32 md:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <nav className="flex items-center gap-6">
          <Popover>
            <PopoverTrigger>
              <BellRing size={20} />
            </PopoverTrigger>
            <PopoverContent align="center" className="max-w-56">
              <div className="flex w-full items-center justify-center">
                <span className="w-full text-center text-xs opacity-70">
                  Você não possui nenhuma notificação no momento.
                </span>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Avatar>
                <AvatarImage
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                />
                <AvatarFallback>
                  {user?.firstName[0]}
                  {user?.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent align="end" className="max-w-48">
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/app/profile"
                    className="flex items-center gap-2"
                    passHref
                  >
                    <Button
                      variant="ghost"
                      className="w-full items-center justify-start gap-2 py-0"
                    >
                      <User size={16} />
                      <span className="text-sm">Perfil</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/app/settings"
                    className="flex items-center gap-2"
                    passHref
                  >
                    <Button
                      variant="ghost"
                      className="w-full items-center justify-start gap-2 py-0"
                    >
                      <Settings size={16} />
                      <span className="text-sm">Configurações</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full items-center justify-start gap-2 py-0"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sair</span>
                  </Button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </nav>
      </div>
      {selectedTeam && (
        <Select
          value={selectedTeam.id}
          onValueChange={(value) => {
            push(`/app/${value}/dashboard`);
          }}
        >
          <SelectTrigger className="flex md:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </header>
  );
};

export default Navbar;
