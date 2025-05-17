import React from "react";

export default function FAQ() {
  return (
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
              Um espaço financeiro é um ambiente separado dentro do Recebee onde
              você pode gerenciar um conjunto específico de finanças, como suas
              finanças pessoais ou as de uma empresa específica.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              Posso migrar meus dados de outro sistema?
            </h3>
            <p className="text-muted-foreground">
              Sim, o Recebee oferece ferramentas de importação para migrar seus
              dados de planilhas e outros sistemas financeiros populares.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Meus dados estão seguros?</h3>
            <p className="text-muted-foreground">
              Absolutamente. Utilizamos criptografia de ponta a ponta e seguimos
              as melhores práticas de segurança para proteger seus dados
              financeiros.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              Posso cancelar a qualquer momento?
            </h3>
            <p className="text-muted-foreground">
              Sim, você pode cancelar sua assinatura a qualquer momento. Não há
              contratos de longo prazo ou taxas de cancelamento.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              Como funciona o suporte ao cliente?
            </h3>
            <p className="text-muted-foreground">
              Oferecemos suporte por e-mail para todos os planos, com tempo de
              resposta de até 24h. Clientes dos planos Profissional e
              Empresarial têm acesso a suporte prioritário via chat.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              Posso exportar meus dados do Recebee?
            </h3>
            <p className="text-muted-foreground">
              Sim, o Recebee permite exportar seus dados financeiros em formatos
              CSV e Excel, facilitando a integração com outros sistemas ou para
              backup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
