import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

export default function CallToAction() {
  return (
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
            <Link href="/auth/register" passHref>
              <Button size="lg" className="gap-1">
                Comece agora gratuitamente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button size="lg" variant="outline">
                Fale com nossa equipe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
