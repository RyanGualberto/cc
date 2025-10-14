import Link from "next/link"

export const metadata = {
  title: "Termos de Serviço | Recebee",
  description: "Regras e condições para uso da plataforma Recebee.",
}

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-muted-foreground">
      <h1 className="text-3xl font-bold text-foreground mb-6">Termos de Serviço</h1>

      <section className="space-y-4">
        <p>
          Ao utilizar o <span className="font-semibold text-foreground">Recebee</span>, você concorda
          com os seguintes termos e condições. Leia-os atentamente antes de continuar.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">1. Uso da plataforma</h2>
        <p>
          O Recebee é destinado ao gerenciamento pessoal de finanças e não deve ser utilizado para
          fins ilegais ou que violem direitos de terceiros.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">2. Responsabilidade do usuário</h2>
        <p>
          Você é responsável por manter a confidencialidade de suas credenciais e pelas ações
          realizadas em sua conta.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. Modificações</h2>
        <p>
          O Recebee pode alterar estes Termos de Serviço a qualquer momento, mediante aviso dentro da
          plataforma. O uso continuado do serviço após tais alterações constitui aceitação das novas
          condições.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">4. Limitação de responsabilidade</h2>
        <p>
          Não nos responsabilizamos por perdas financeiras resultantes do uso incorreto da plataforma
          ou por falhas de terceiros envolvidos no processamento de dados.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">5. Contato</h2>
        <p>
          Para dúvidas ou suporte, envie um e-mail para{" "}
          <Link href="mailto:suporte@recebee.com" className="text-primary hover:underline">
            suporte@recebee.com
          </Link>.
        </p>
      </section>

      <div className="mt-12 pt-6 border-t">
        <p className="text-sm text-center">
          Consulte também nossa{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Política de Privacidade
          </Link>.
        </p>
      </div>
    </main>
  )
}