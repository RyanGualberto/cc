"use client"
import Image from "next/image"
import loginBackground from "../../../assets/images/login-background.webp"
import { Input } from "~/components/ui/input"
import { Lock, User, ArrowRight } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import maskCpf from "~/helpers/maskCpf"
import Link from "next/link"
import { LoginSchema } from "~/schemas/LoginSchema"
import { useAuth } from "~/hooks/use-auth"

export default function LoginPage() {
  const { login } = useAuth()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  })

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    await login(values)
  }

  return (
    <section className="flex h-screen overflow-hidden">
      {/* Left side - Image */}
      <div className="relative hidden md:block md:w-1/2 h-full">
        <Image
          src={loginBackground || "/placeholder.svg"}
          alt="Gerencie suas finanças com o Recebee"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute bottom-8 left-8 max-w-xs">
          <h2 className="text-2xl font-bold text-white mb-2">Recebee</h2>
          <p className="text-white/90">Gerencie todas as suas finanças em um só lugar</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-sm text-muted-foreground">Entre na sua conta para continuar</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        onChange={(e) => field.onChange(maskCpf(e.target.value))}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs">Senha</FormLabel>
                      <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        Icon={Lock}
                        type="password"
                        error={form.formState.errors.password?.message}
                        placeholder="Sua senha"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button className="w-full h-10 text-sm gap-2 group" type="submit">
                  Entrar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="flex items-center justify-center text-xs pt-1">
                <span className="text-muted-foreground">Não possui uma conta?</span>
                <Link href="/auth/register" className="font-medium ml-1 text-primary hover:underline">
                  Registre-se
                </Link>
              </div>
            </form>
          </Form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10 text-xs" type="button">
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
              <Button variant="outline" className="h-10 text-xs" type="button">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
