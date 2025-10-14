import { Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2 font-bold">
          <Wallet className="h-5 w-5" />
          <span>Recebee</span>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6">
          <Link href="/terms-of-service" className="text-sm font-medium hover:underline">
            Termos de Serviço
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium hover:underline">
            Política de Privacidade
          </Link>
          <Link href="/support" className="text-sm font-medium hover:underline">
            Suporte
          </Link>
        </div>
        <div className="text-center text-sm text-muted-foreground md:text-right">
          &copy; {new Date().getFullYear()} Recebee. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
