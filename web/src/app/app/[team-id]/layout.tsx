"use client";
import React from "react";
import { useUserContext } from "~/hooks/use-user-context";
import {
  Home,
  List,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { Loading } from "~/components/ui/loading";
import { NotFound } from "~/components/ui/not-found";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedTeam, loadingTeams } = useUserContext();

  if (loadingTeams) {
    return <Loading />;
  }

  if (!selectedTeam) {
    return <NotFound label="Time não encontrado" />;
  }

  return (
    <main className="flex h-full flex-1 flex-col gap-6 px-8 py-6">
      <header className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{selectedTeam.name}</h2>
        </div>
      </header>
      <nav className="flex max-w-full items-center gap-2 overflow-x-scroll">
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
    </main>
  );
}

const navItems = (role: "MEMBER" | "ADMIN" | "OWNER") => {
  const routes = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={18} /> },
    {
      label: "Despesas",
      href: "/expenses",
      icon: <TrendingDown size={18} />,
    },
    {
      label: "Receitas",
      href: "/revenues",
      icon: <TrendingUp size={18} />,
    },
    {
      label: "Categorias",
      href: "/categories",
      icon: <List size={18} />,
    },
    {
      label: "Membros",
      href: "/members",
      icon: <Users size={18} />,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: <Settings size={18} />,
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
