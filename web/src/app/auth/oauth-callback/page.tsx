"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import apiClient from "~/config/api-client";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { INITIAL_ROUTE } from "~/config/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import maskCpf from "~/helpers/maskCpf";
import maskPhone from "~/helpers/maskPhone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "~/schemas/RegisterOAuth";
import { type z } from "zod";
import { Mail, Phone, User } from "lucide-react";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [needsCompletion, setNeedsCompletion] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      cpf: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function exchange() {
      try {
        const session = await getSession();
        console.log(session);
        
        if (!session?.user?.email) {
          setError("Não foi possível obter sessão do provedor.");
          return;
        }

        const payload = {
          email: session.user.email,
          firstName: session.user.name?.split(" ")[0] ?? "",
          lastName: session.user.name?.split(" ").slice(1).join(" ") ?? "",
        };

        type OAuthResponse =
          | { token?: string }
          | {
              needsProfileCompletion: true;
              email: string;
              firstName?: string;
              lastName?: string;
            };

        const { data } = await apiClient.post<OAuthResponse>(
          "/auth/oauth",
          payload,
        );

        if ("token" in data && data.token) {
          setCookie("token", data.token, { path: "/" });
          router.replace(INITIAL_ROUTE);
          return;
        }

        if ("needsProfileCompletion" in data && data.needsProfileCompletion) {
          form.reset({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
          });
          setNeedsCompletion(true);
          return;
        }

        setError("Não foi possível autenticar no servidor.");
      } catch (err: unknown) {
        setError((err as Error).message || "Erro desconhecido");
      }
    }

    void exchange();
  }, [router, form]);

  async function submitCompletion() {
    const profileData = form.getValues();
    if (!profileData.email) return setError("Email ausente");
    if (!profileData.cpf || !profileData.phone)
      return setError("Preencha todos os campos");
    setLoading(true);
    try {
      const body = {
        email: profileData.email,
        firstName: profileData.firstName ?? "",
        lastName: profileData.lastName ?? "",
        cpf: profileData.cpf,
        phone: profileData.phone,
      };

      const { data } = await apiClient.post<{ token?: string }>(
        "/auth/oauth/complete",
        body,
      );

      if (data.token) {
        setCookie("token", data.token, { path: "/" });
        router.replace(INITIAL_ROUTE);
        return;
      }

      setError("Falha ao completar perfil");
    } catch (err: unknown) {
      setError((err as Error).message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {!needsCompletion && !error && <div>Autenticando...</div>}

      {needsCompletion && (
        <Card>
          <CardHeader>
            <CardTitle>Complete seu perfil</CardTitle>
            <CardDescription>
              Precisamos de mais alguns dados para criar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitCompletion)}
                className="space-y-3"
              >
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
              </form>
            </Form>
          </CardContent>
          <CardFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setNeedsCompletion(false)}>Cancelar</Button>
            <Button
              onClick={() => form.handleSubmit(submitCompletion)()}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
