"use client";
import Image from "next/image";
import registerBackground from "../../../assets/images/register-background.webp";
import { Input } from "~/components/ui/input";
import { Lock, Mail, Phone, User } from "lucide-react";

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
import PasswordProgress from "~/components/Register/PasswordProgress";
import maskCpf from "~/helpers/maskCpf";
import Link from "next/link";
import { RegisterSchema } from "~/schemas/RegisterSchema";
import maskPhone from "~/helpers/maskPhone";
import { useAuth } from "~/hooks/use-auth";

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
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      cpf: values.cpf,
      phone: values.phone,
      password: values.password,
    });
  }

  return (
    <section className="flex h-[100vh] max-h-fit w-[100vw] max-w-[100vw] overflow-y-scroll md:max-h-[100vh] md:overflow-clip ">
      <figure className="relative hidden h-full w-full md:block ">
        <Image
          src={registerBackground}
          alt="Register background image"
          fill
          className="object-cover"
        />
      </figure>
      <main className="flex h-full w-full flex-shrink-0 flex-col items-center justify-center gap-6 p-6 py-12 md:w-[550px] md:overflow-auto">
        <h1 className="text-2xl font-bold">Register</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full w-full space-y-6"
          >
            <span className="flex w-full flex-col gap-4 md:flex-row">
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
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Telefone</FormLabel>
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
            <Button className="h-12 w-full" type="submit">
              Criar minha conta
            </Button>
            <span className="flex w-full justify-center md:justify-start">
              w
              <Link href="/auth/login" className="mb-4 text-white/70">
                Já possui uma conta?{" "}
                <span className="text-white/100"> Faça login </span>
              </Link>
            </span>
          </form>
        </Form>
      </main>
    </section>
  );
}
