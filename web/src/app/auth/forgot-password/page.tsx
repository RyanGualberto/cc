"use client"
import Image from "next/image"
import loginBackground from "../../../assets/images/login-background.webp"
import { Input } from "~/components/ui/input"
import { User, ArrowRight, ArrowLeft } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import maskCpf from "~/helpers/maskCpf"
import Link from "next/link"
import { useState } from "react"

const ForgotPasswordSchema = z.object({
  cpf: z.string().min(14, "CPF inválido"),
})

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      cpf: "",
    },
  })

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    // Aqui você implementaria a lógica para enviar o email/SMS de recuperação
    console.log(values)
    setIsSubmitted(true)
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
          <Link href="/auth/login" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para o login
          </Link>

          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Recuperar senha</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Informe seu CPF para receber instruções de recuperação de senha
                </p>
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

                  <div className="pt-2">
                    <Button className="w-full h-10 text-sm gap-2 group" type="submit">
                      Enviar instruções
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  Lembrou sua senha?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Voltar para o login
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary h-8 w-8"
                >
                  <path d="M22 10v6M2 10l10 5 10-5-10-5-10 5Z" />
                  <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Verifique seu email</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Enviamos instruções de recuperação de senha para o email associado ao seu CPF.
              </p>
              <div className="pt-4">
                <Button variant="outline" className="h-10 text-sm" onClick={() => setIsSubmitted(false)}>
                  Tentar novamente
                </Button>
              </div>
              <p className="text-xs text-muted-foreground pt-4">
                Não recebeu o email?{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline">
                  Reenviar
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
