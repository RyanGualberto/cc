import React from "react";
import {
  BarChart3,
  PieChart,
  Wallet,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function eatures() {
  return (
    <section id="features" className="bg-muted py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">
              Recursos
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Tudo que você precisa
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Recebee oferece ferramentas poderosas para gerenciar todos os seus
              espaços financeiros com facilidade.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Múltiplos Espaços"
            description="Gerencie finanças pessoais, empresariais e projetos em espaços separados mas integrados."
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
          />
          <FeatureCard
            title="Relatórios Detalhados"
            description="Visualize seus dados financeiros com gráficos e relatórios personalizáveis."
            icon={<PieChart className="h-6 w-6 text-primary" />}
          />
          <FeatureCard
            title="Controle de Despesas"
            description="Acompanhe todas as suas despesas e receitas em tempo real."
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <FeatureCard
            title="Acesso Compartilhado"
            description="Compartilhe o acesso com sua equipe ou contador com diferentes níveis de permissão."
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <FeatureCard
            title="Conciliação Bancária"
            description="Integre suas contas bancárias para importação automática de transações."
            icon={<CheckCircle className="h-6 w-6 text-primary" />}
          />
          <FeatureCard
            title="Automação"
            description="Automatize tarefas repetitivas como categorização de transações e lembretes de pagamento."
            icon={<ArrowRight className="h-6 w-6 text-primary" />}
          />
        </div>
      </div>
    </section>
  );
}

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="rounded-full bg-primary/10 p-3">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
