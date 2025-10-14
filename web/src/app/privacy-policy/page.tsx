import Link from "next/link"

export const metadata = {
  title: "Política de Privacidade | Recebee",
  description: "Saiba como o Recebee coleta, usa e protege suas informações.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-muted-foreground">
      <h1 className="text-3xl font-bold text-foreground mb-6">Política de Privacidade</h1>

      <section className="space-y-4">
        <p>
          A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o{" "}
          <span className="font-semibold text-foreground">Recebee</span> coleta, usa e protege
          suas informações ao utilizar nossos serviços.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">1. Informações que coletamos</h2>
        <p>
          Coletamos informações fornecidas diretamente por você, como nome, e-mail e dados de login,
          bem como informações geradas automaticamente durante o uso do sistema (por exemplo, dados
          de acesso, uso e preferências).
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">2. Uso das informações</h2>
        <p>
          As informações são utilizadas para manter e melhorar nossos serviços, personalizar sua
          experiência, enviar comunicações relevantes (como lembretes e notificações financeiras) e
          garantir a segurança da sua conta.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. Compartilhamento de dados</h2>
        <p>
          Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto
          quando necessário para o funcionamento do serviço (por exemplo, provedores de login, como
          o Google) ou quando exigido por lei.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">4. Armazenamento e segurança</h2>
        <p>
          Os dados são armazenados em servidores seguros e adotamos medidas técnicas para protegê-los
          contra acesso não autorizado, alteração ou destruição. No entanto, nenhum sistema é
          completamente seguro, e recomendamos que você mantenha sua senha em sigilo.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">5. Seus direitos</h2>
        <p>
          Você pode solicitar a exclusão da sua conta e de todos os seus dados a qualquer momento,
          entrando em contato conosco pelos canais oficiais disponíveis dentro da plataforma.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">6. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você a
          revise regularmente para se manter informado sobre como protegemos suas informações.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">7. Contato</h2>
        <p>
          Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail{" "}
          <Link
            href="mailto:suporte@recebee.com"
            className="text-primary hover:underline"
          >
            suporte@recebee.com
          </Link>.
        </p>
      </section>

      <div className="mt-12 pt-6 border-t">
        <p className="text-sm text-center">
          Leia também nossos{" "}
          <Link href="/terms-of-service" className="text-primary hover:underline">
            Termos de Serviço
          </Link>.
        </p>
      </div>
    </main>
  )
}