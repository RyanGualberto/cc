import React from "react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">
              Como Funciona
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simples de usar
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Comece a organizar suas finanças em minutos com o Recebee.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-bold">Crie sua conta</h3>
            <p className="text-muted-foreground">
              Registre-se gratuitamente e configure seu perfil em poucos
              minutos.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-bold">Configure seus espaços</h3>
            <p className="text-muted-foreground">
              Crie espaços separados para suas finanças pessoais e cada negócio
              ou projeto.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-bold">Gerencie suas finanças</h3>
            <p className="text-muted-foreground">
              Comece a registrar transações, gerar relatórios e tomar decisões
              financeiras melhores.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
