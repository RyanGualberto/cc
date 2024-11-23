"use client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "~/assets/images/logo-with-lateral-text.svg";
import { BellRing, LogOut, Settings, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import { useUserContext } from "~/hooks/use-user-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const { user, selectedTeam, teams } = useUserContext();
  const { push } = useRouter();

  return (
    <header className="flex flex-col gap-4 border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={"/app/teams"}>
            <Image
              src={Logo as StaticImport}
              alt="Logo"
              width={130}
              height={40}
            />
          </Link>
          {selectedTeam && (
            <Select
              value={selectedTeam.id}
              onValueChange={(value) => {
                push(`/app/${value}/dashboard`);
              }}
            >
              <SelectTrigger className="hidden md:flex">
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
                  {user?.first_name[0]}
                  {user?.last_name[0]}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent align="end" className="max-w-48">
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/app/profile" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="text-sm">Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/app/settings"
                    className="flex items-center gap-2"
                  >
                    <Settings size={16} />
                    <span className="text-sm">Configurações</span>
                  </Link>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center gap-2"
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
