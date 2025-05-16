import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  ChevronRight,
  BarChart3,
  PieChart,
  Wallet,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
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
            <Link href="/auth/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Gerencie todas as suas finanças em um só lugar
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Recebee é a plataforma que simplifica o gerenciamento
                    financeiro para quem possui múltiplos espaços financeiros -
                    pessoal, empresarial ou projetos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button size="lg" className="gap-1">
                      Comece agora
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Saiba mais
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-2 ring-background"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mais de{" "}
                    <span className="font-medium text-foreground">2,000+</span>{" "}
                    usuários satisfeitos
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full md:h-[420px] lg:h-[450px]">
                  <Image
                    src="/placeholder.svg?height=450&width=550"
                    alt="Dashboard Recebee"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  Recebee oferece ferramentas poderosas para gerenciar todos os
                  seus espaços financeiros com facilidade.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Múltiplos Espaços</h3>
                <p className="text-muted-foreground">
                  Gerencie finanças pessoais, empresariais e projetos em espaços
                  separados mas integrados.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Relatórios Detalhados</h3>
                <p className="text-muted-foreground">
                  Visualize seus dados financeiros com gráficos e relatórios
                  personalizáveis.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Controle de Despesas</h3>
                <p className="text-muted-foreground">
                  Acompanhe todas as suas despesas e receitas em tempo real.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Acesso Compartilhado</h3>
                <p className="text-muted-foreground">
                  Compartilhe o acesso com sua equipe ou contador com diferentes
                  níveis de permissão.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Automação</h3>
                <p className="text-muted-foreground">
                  Automatize tarefas repetitivas como categorização de
                  transações e lembretes de pagamento.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Conciliação Bancária</h3>
                <p className="text-muted-foreground">
                  Integre suas contas bancárias para importação automática de
                  transações.
                </p>
              </div>
            </div>
          </div>
        </section>

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
                  Crie espaços separados para suas finanças pessoais e cada
                  negócio ou projeto.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Gerencie suas finanças</h3>
                <p className="text-muted-foreground">
                  Comece a registrar transações, gerar relatórios e tomar
                  decisões financeiras melhores.
                </p>
              </div>
            </div>
          </div>
        </section>

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
                    <Button className="w-full">
                      Experimente 14 dias grátis
                    </Button>
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
                  <Link href="/auth/register">
                    <Button variant="outline" className="w-full">
                      Fale com Vendas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Perguntas Frequentes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Respostas para as perguntas mais comuns sobre o Recebee.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  O que é um &ldquo;espaço financeiro&ldquo;?
                </h3>
                <p className="text-muted-foreground">
                  Um espaço financeiro é um ambiente separado dentro do Recebee
                  onde você pode gerenciar um conjunto específico de finanças,
                  como suas finanças pessoais ou as de uma empresa específica.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Posso migrar meus dados de outro sistema?
                </h3>
                <p className="text-muted-foreground">
                  Sim, o Recebee oferece ferramentas de importação para migrar
                  seus dados de planilhas e outros sistemas financeiros
                  populares.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Meus dados estão seguros?</h3>
                <p className="text-muted-foreground">
                  Absolutamente. Utilizamos criptografia de ponta a ponta e
                  seguimos as melhores práticas de segurança para proteger seus
                  dados financeiros.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-muted-foreground">
                  Sim, você pode cancelar sua assinatura a qualquer momento. Não
                  há contratos de longo prazo ou taxas de cancelamento.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Como funciona o suporte ao cliente?
                </h3>
                <p className="text-muted-foreground">
                  Oferecemos suporte por e-mail para todos os planos, com tempo
                  de resposta de até 24h. Clientes dos planos Profissional e
                  Empresarial têm acesso a suporte prioritário via chat.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Posso exportar meus dados do Recebee?
                </h3>
                <p className="text-muted-foreground">
                  Sim, o Recebee permite exportar seus dados financeiros em
                  formatos CSV e Excel, facilitando a integração com outros
                  sistemas ou para backup.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Pronto para organizar suas finanças?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Junte-se a milhares de usuários que já estão gerenciando suas
                  finanças de forma mais eficiente com o Recebee.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="gap-1">
                    Comece agora gratuitamente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Fale com nossa equipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Wallet className="h-5 w-5" />
            <span>Recebee</span>
          </div>
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline">
              Termos de Serviço
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Suporte
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground md:text-right">
            &copy; {new Date().getFullYear()} Recebee. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
