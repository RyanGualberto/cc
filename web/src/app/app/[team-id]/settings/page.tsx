"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserContext } from "~/hooks/use-user-context";
import { teamRequests } from "~/requests/team";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { selectedTeam } = useUserContext();
  const teamForm = useForm({
    defaultValues: {
      name: selectedTeam?.name ?? "",
    },
  });
  const { mutateAsync: updateTeamAsync } = useMutation({
    mutationKey: ["updateTeam"],
    mutationFn: async (data: { name: string }) => {
      if (!selectedTeam) throw new Error("No team selected");
      return teamRequests.updateTeam({
        name: data.name,
        id: selectedTeam.id,
      });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["selectedTeam"] });
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      teamForm.reset({
        name: data?.name,
      });
    },
  });
  const confirmdeleteForm = useForm({
    defaultValues: {
      confirm: "",
    },
  });
  const { mutateAsync: deleteTeamAsync } = useMutation({
    mutationKey: ["deleteTeam"],
    mutationFn: async () => {
      if (!selectedTeam) throw new Error("No team selected");
      return teamRequests.deleteTeam(selectedTeam.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      confirmdeleteForm.reset({});
      router.push("/app/teams");
    },
  });

  return (
    <div className="flex flex-1 gap-4 md:px-24">
      <Tabs className="flex flex-col md:flex-row flex-1 gap-4" defaultValue="general">
        <TabsList
          className="flex h-fit justify-start md:min-w-36 flex-row md:flex-col gap-1.5 bg-transparent"
          defaultValue={"general"}
        >
          <TabsTrigger
            className="w-fit md:w-full justify-start py-2 text-left hover:bg-accent data-[state=active]:bg-accent"
            value="general"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger
            className="w-fit md:w-full justify-start py-2 text-left hover:bg-accent data-[state=active]:bg-accent"
            value="permissions"
          >
            Permissões
          </TabsTrigger>
        </TabsList>
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="flex-1 md:px-6">
          <TabsContent value="general" className="flex flex-1 flex-col">
            <h1 className="text-2xl font-semibold">Configurações Gerais</h1>
            <Card className="mt-4 w-full">
              <CardHeader className="mb-0 !pb-0">
                <CardTitle>Informações do Espaço Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...teamForm}>
                  <form
                    onSubmit={teamForm.handleSubmit(async (data) => {
                      await updateTeamAsync(data);
                    })}
                  >
                    <FormField
                      control={teamForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Espaço Financeiro</FormLabel>
                          <Input
                            {...field}
                            placeholder="Nome do Espaço"
                            className="input"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-4 flex justify-end">
                      <Button
                        disabled={!teamForm.formState.isDirty}
                        type="submit"
                      >
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <Card className="mt-4 w-full border-destructive">
              <Form {...confirmdeleteForm}>
                <form
                  onSubmit={confirmdeleteForm.handleSubmit(async () => {
                    await deleteTeamAsync();
                  })}
                >
                  <CardHeader className="mb-2 md:mb-0 !pb-0">
                    <CardTitle>Excluir Espaço Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={confirmdeleteForm.control}
                      name="confirm"
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...field}
                            placeholder="Digite 'EXCLUIR' para confirmar"
                            className="input mt-2"
                          />
                          <FormMessage />
                          <FormDescription>
                            Para excluir este espaço financeiro, digite
                            &ldquo;EXCLUIR&rdquo; no campo acima.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end bg-destructive/20 py-2 px-4">
                    <Button
                      disabled={
                        confirmdeleteForm.watch("confirm") !== "EXCLUIR"
                      }
                      type="submit"
                      variant="destructive"
                    >
                      Excluir Espaço
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
