"use client";
import React from "react";
import { useUserContext } from "~/hooks/use-user-context";
import {
  Home,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { NotFound } from "~/components/ui/not-found";
import { Loading } from "~/components/ui/loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedTeam, loadingTeams, teams } = useUserContext();

  if (loadingTeams) {
    return <Loading label="Carregando times..." />;
  }

  if (!selectedTeam) {
    console.log(selectedTeam, "selectedTeam", loadingTeams, teams);
    
    return <NotFound label="Time não encontrado" />;
  }

  return (
    <main className="flex h-full flex-1 flex-col gap-4 px-4 md:px-8 py-3 md:py-6 pb-20 ">
      <header className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{selectedTeam.name}</h2>
        </div>
      </header>
      <nav className="hidden max-w-full items-center gap-2 overflow-x-scroll md:flex">
        {navItems(selectedTeam.role).map((item) => (
          <Link
            key={item.href}
            href={`/app/${selectedTeam.id}${item.href}`}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 duration-200",
              {
                "bg-accent": pathname.startsWith(
                  `/app/${selectedTeam.id}${item.href}`,
                ),
                "hover:bg-accent": !pathname.startsWith(
                  `/app/${selectedTeam.id}${item.href}`,
                ),
              },
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {children}
      <nav className="fixed bottom-0 left-0 right-0 flex bg-background/35 backdrop-blur-md md:hidden border-t">
        <div className="flex w-full justify-between">
          {navItems(selectedTeam.role).map((item) => (
            <Link
              className={cn("flex flex-1 flex-col w-full h-16 justify-center items-center gap-2 py-2", {
                "bg-accent": pathname.startsWith(
                  `/app/${selectedTeam.id}${item.href}`,
                ),
                "hover:bg-accent": !pathname.startsWith(
                  `/app/${selectedTeam.id}${item.href}`,
                ),
              })}
              key={item.href}
              href={`/app/${selectedTeam.id}${item.href}`}
            >
              {item.icon}
              <span className="text-xs">
                { item.label }
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

const navItems = (role: "MEMBER" | "ADMIN" | "OWNER") => {
  const routes = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-6 w-6 md:h-4 md:w-4" />,
    },
    {
      label: "Despesas",
      href: "/expenses",
      icon: <TrendingDown className="h-6 w-6 md:h-4 md:w-4" />,
    },
    {
      label: "Receitas",
      href: "/revenues",
      icon: <TrendingUp className="h-6 w-6 md:h-4 md:w-4" />,
    },
    {
      label: "Membros",
      href: "/members",
      icon: <Users className="h-6 w-6 md:h-4 md:w-4" />,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: <Settings className="h-6 w-6 md:h-4 md:w-4" />,
    },
  ];

  const routesByRole = {
    OWNER: [
      "Dashboard",
      "Despesas",
      "Receitas",
      "Categorias",
      "Membros",
      "Configurações",
    ],
    ADMIN: [
      "Dashboard",
      "Despesas",
      "Receitas",
      "Categorias",
      "Membros",
      "Configurações",
    ],
    MEMBER: ["Dashboard", "Despesas", "Receitas", "Categorias"],
  };

  return routes.filter((route) => routesByRole[role].includes(route.label));
};
