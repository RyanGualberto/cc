"use client";
import Image from "next/image";
import loginBackground from "../../../assets/images/login-background.webp";
import { Input } from "~/components/ui/input";
import { Lock, User } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import maskCpf from "~/helpers/maskCpf";
import Link from "next/link";
import { LoginSchema } from "~/schemas/LoginSchema";

export default function LoginPage() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log(values);
  }

  return (
    <section className="flex h-[100vh] max-h-[100vh] w-[100vw] max-w-[100vw] overflow-clip ">
      <figure className="relative h-full w-full ">
        <Image
          src={loginBackground}
          alt="Register background image"
          fill
          className="object-cover"
        />
      </figure>
      <main className="flex h-full w-full md:w-[550px] flex-shrink-0 flex-col items-center justify-center gap-6 overflow-auto p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 "
          >
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      maxLength={14}
                      placeholder="000.000.000-00"
                      error={form.formState.errors.cpf?.message}
                      Icon={User}
                      {...field}
                      onChange={(e) => field.onChange(maskCpf(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        Icon={Lock}
                        type="password"
                        error={form.formState.errors.password?.message}
                        placeholder="Sua melhor senha"
                        {...field}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="h-12 w-full" type="submit">
              Entrar
            </Button>
            <span className="flex w-full justify-center md:justify-start">
              <Link href="/auth/register" className="text-white/70">
                Não possui uma conta?{" "}
                <span className="text-white/100"> Registre-se</span>
              </Link>
            </span>
          </form>
        </Form>
      </main>
    </section>
  );
}
