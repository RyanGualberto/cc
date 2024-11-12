import { Plus } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <main className="flex flex-col gap-2 px-8 py-6 flex-1 h-full">
      <header className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Meus espaços financeiros</h2>
          <p className="font-light opacity-80">
            Veja o resumo de todos os seus espaços financeiros.
          </p>
        </div>
        <Button className="items-center gap-2">
          <Plus size={16} />
          Adicionar espaço
        </Button>
      </header>
      <section className="w-full h-full flex-1 flex flex-col">
        <div className="flex justify-center items-center flex-1 h-full">
          <p className="opacity-70">
            Você ainda não possui nenhum espaço financeiro.
          </p>
        </div>
      </section>
    </main>
  );
}
