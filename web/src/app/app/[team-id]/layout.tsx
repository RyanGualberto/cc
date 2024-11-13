"use client";
import React from "react";
import { useUserContext } from "~/hooks/use-user-context";
import { Home, List, Settings, TrendingDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <main className="flex h-full flex-1 flex-col gap-6 px-8 py-6">
      <header className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{selectedTeam.name}</h2>
        </div>
      </header>
      <nav className="flex items-center gap-2 max-w-full overflow-x-scroll">
        {navItems.map((item) => (
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

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <Home size={18} /> },
  {
    label: "Despesas",
    href: "/expenses",
    icon: <TrendingDown size={18} />,
  },
  {
    label: "Receitas",
    href: "/incomes",
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
