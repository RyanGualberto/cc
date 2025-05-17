import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export default function Plans() {
  return (
    <section id="pricing" className="bg-muted py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">
              Preços
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Planos para todos
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Escolha o plano que melhor se adapta às suas necessidades.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-background p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Pessoal</h3>
              <p className="text-muted-foreground">
                Ideal para finanças pessoais
              </p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              Grátis
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>1 espaço financeiro</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Relatórios básicos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Até 100 transações/mês</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/register">
                <Button className="w-full">Começar Grátis</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-lg ring-2 ring-primary">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
              <h3 className="text-2xl font-bold">Profissional</h3>
              <p className="text-muted-foreground">
                Para autônomos e pequenas empresas
              </p>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold">R$29</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Até 3 espaços financeiros</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Relatórios avançados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Transações ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>1 usuário adicional</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/register">
                <Button className="w-full">Experimente 14 dias grátis</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Empresarial</h3>
              <p className="text-muted-foreground">
                Para empresas em crescimento
              </p>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold">R$79</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Espaços financeiros ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Relatórios personalizados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Transações ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Até 5 usuários adicionais</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/register" passHref>
                <Button variant="outline" className="w-full">
                  Fale com Vendas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
