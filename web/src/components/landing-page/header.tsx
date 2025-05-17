"use client";
import { Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useUserContext } from "~/hooks/use-user-context";

export default function Header() {
  const { user } = useUserContext();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Wallet className="h-6 w-6" />
          <span>Recebee</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Recursos
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Como Funciona
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Preços
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/app/teams" passHref>
              <Button>Ir para o app</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button>Começar Grátis</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
