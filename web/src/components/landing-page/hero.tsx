import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Mockup from "~/assets/images/mockup.png";

export default function Hero() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Gerencie todas as suas finanças em um só lugar
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Recebee é a plataforma que simplifica o gerenciamento financeiro
                para quem possui múltiplos espaços financeiros - pessoal,
                empresarial ou projetos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/register" passHref>
                <Button size="lg" className="gap-1 items-center">
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
                src={Mockup}
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
  );
}
