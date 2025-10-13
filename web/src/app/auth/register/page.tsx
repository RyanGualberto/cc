"use client";
import Image from "next/image";
import registerBackground from "~/assets/images/register-background.webp";
import { Input } from "~/components/ui/input";
import { Lock, Mail, Phone, User, ArrowRight, CheckCircle } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import PasswordProgress from "~/components/Register/PasswordProgress";
import maskCpf from "~/helpers/maskCpf";
import Link from "next/link";
import { RegisterSchema } from "~/schemas/RegisterSchema";
import maskPhone from "~/helpers/maskPhone";
import { useAuth } from "~/hooks/use-auth";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const { register } = useAuth();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      cpf: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    await register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      cpf: values.cpf,
      phone: values.phone,
      password: values.password,
    });
  }

  return (
    <section className="flex h-screen">
      {/* Left side - Image */}
      <div className="relative hidden h-full md:block md:w-1/2">
        <Image
          src={registerBackground || "/placeholder.svg"}
          alt="Gerencie suas finanças com o Recebee"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute bottom-8 left-8 max-w-xs">
          <h2 className="mb-2 text-2xl font-bold text-white">Recebee</h2>
          <p className="mb-2 text-white/90">
            Gerencie todas as suas finanças em um só lugar
          </p>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Gerencie múltiplos espaços financeiros</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Acesso a relatórios financeiros detalhados</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Suporte dedicado para todas as suas dúvidas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex h-full w-full items-center justify-center p-4 md:w-1/2 md:p-6 overflow-y-scroll">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Crie sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Nome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nome"
                          error={form.formState.errors.firstName?.message}
                          Icon={User}
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Sobrenome"
                          error={form.formState.errors.lastName?.message}
                          Icon={User}
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        error={form.formState.errors.email?.message}
                        Icon={Mail}
                        placeholder="Seu melhor email"
                        {...field}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">CPF</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={14}
                          placeholder="000.000.000-00"
                          error={form.formState.errors.cpf?.message}
                          Icon={User}
                          {...field}
                          onChange={(e) =>
                            field.onChange(maskCpf(e.target.value))
                          }
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={15}
                          placeholder="(00) 00000-0000"
                          error={form.formState.errors.phone?.message}
                          Icon={Phone}
                          {...field}
                          onChange={(e) =>
                            field.onChange(maskPhone(e.target.value))
                          }
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Senha</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            Icon={Lock}
                            type="password"
                            error={form.formState.errors.password?.message}
                            placeholder="Sua melhor senha"
                            {...field}
                            className="h-9"
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Confirme sua senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          Icon={Lock}
                          type="password"
                          error={form.formState.errors.confirmPassword?.message}
                          placeholder="Confirme sua senha"
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <PasswordProgress password={form.watch("password")} />

              <div className="pt-2">
                <Button
                  className="group h-10 w-full gap-2 text-sm"
                  type="submit"
                >
                  Criar minha conta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      ou continue com
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-10 text-xs"
                    type="button"
                    onClick={() => void signIn('google', { callbackUrl: '/auth/oauth-callback' })}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-xs"
                    type="button"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center pt-1 text-xs">
                <span className="text-muted-foreground">
                  Já possui uma conta?
                </span>
                <Link
                  href="/auth/login"
                  className="ml-1 font-medium text-primary hover:underline"
                >
                  Faça login
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
