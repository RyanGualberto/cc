"use client"
import Image from "next/image";
import registerBackground from "../../../assets/images/register-background.webp"
import { Input } from "~/components/ui/input";
import { Lock, Mail, User } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import PasswordProgress from "~/components/Register/PasswordProgress";
import maskCpf from "~/helpers/maskCpf";
import Link from "next/link";
import { RegisterSchema } from "~/schemas/RegisterSchema";

export default function RegisterPage() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      cpf: "",
      password: "",
      confirmPassword: ""
    },
  })

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    console.log(values)
  }

  return (
    <section className="w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh] overflow-clip flex ">
      <figure className="w-full h-full relative ">
        <Image src={registerBackground} alt="Register background image" fill className="object-cover" />
      </figure>
      <main className="w-[550px] h-full flex-shrink-0 flex flex-col justify-center items-center p-6 gap-6 overflow-auto">
        <h1 className="font-bold text-2xl">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 ">
            <span className="w-full flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nome"
                        error={form.formState.errors.firstName?.message}
                        Icon={User}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Sobrenome"
                        error={form.formState.errors.lastName?.message}
                        Icon={User}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </span>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      error={form.formState.errors.email?.message}
                      Icon={Mail}
                      placeholder="Sua melhor email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <PasswordProgress password={field.value} />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Confirme sua senha</FormLabel>
                  <FormControl>
                    <Input
                      Icon={Lock}
                      type="password"
                      error={form.formState.errors.confirmPassword?.message}
                      placeholder="Confirme sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="w-full flex justify-between items-center">
              <Link href="/auth/login">
                Já possui uma conta? Faça login
              </Link>
              <Button type="submit">
                Criar minha conta
              </Button>
            </span>
          </form>
        </Form>
      </main>
    </section>
  )
}