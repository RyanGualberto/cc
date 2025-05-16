import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import Logo from "~/assets/images/logo-without-bg.svg";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative animate-pulse">
        <Image src={Logo as StaticImport} alt="Logo" width={180} height={180} />
      </div>
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não foi encontrada.</p>
      <Link href="/">Voltar para a página inicial</Link>
    </div>
  );
}
