import { Wallet } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative flex animate-pulse flex-col items-center gap-4">
        <Wallet width={40} height={40} />
        <span className="text-lg font-bold">Recebee</span>
      </div>
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não foi encontrada.</p>
      <Link href="/">Voltar para a página inicial</Link>
    </div>
  );
}
