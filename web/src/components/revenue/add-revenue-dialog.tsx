import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import React, { useCallback, useState } from "react";
import { type Team } from "~/types/team";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addRevenueSchema,
  ALLOWED_RECURRENCES,
  ALLOWED_STATUSES,
} from "~/schemas/add-revenue-schema";
import { type z } from "zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "../ui/date-picker";
import maskAmount from "~/helpers/maskAmount";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revenueRequest } from "~/requests/revenue";
import Show from "../utils/show";
import { revenueCategoriesRequest } from "~/requests/revenue-category";

export const TRANSLATED_RECURRENCES = {
  ONCE: "Uma vez",
  DAILY: "Diário",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
};

export const TRANSLATED_STATUSES = {
  PENDING: "Pendente",
  RECEIVED: "Recebido",
  OVERDUE: "Atrasado",
};

const AddRevenueDialog: React.FC<{
  team: Team;
}> = ({ team }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    data: revenueCategories,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["revenue-categories", { teamId: team.id }],
    queryFn: async () =>
      await revenueCategoriesRequest.listByTeam({
        teamId: team.id,
      }),
  });

  const { mutateAsync, isPending: addingRevenue } = useMutation({
    mutationKey: ["revenues", team.id, "create"],
    mutationFn: async (data: z.infer<typeof addRevenueSchema>) => {
      const { until, ...dataWithoutUntil } = data;
      const untilToStringOrUndefined = until
        ? new Date(until).toISOString()
        : undefined;

      return await revenueRequest.createByTeam({
        ...dataWithoutUntil,
        teamId: team.id,
        amountInCents: parseInt(
          String(dataWithoutUntil.amountInCents).replace(/\D/g, ""),
        ),
        date: new Date(dataWithoutUntil.date).toISOString(),
        description: dataWithoutUntil.description ?? undefined,
        category: dataWithoutUntil.category ?? undefined,
        until: untilToStringOrUndefined,
      });
    },
  });
  const form = useForm<z.infer<typeof addRevenueSchema>>({
    resolver: zodResolver(addRevenueSchema),
    defaultValues: {
      recurrence: "ONCE",
      status: "PENDING",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof addRevenueSchema>) => {
      if (addingRevenue) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["revenues", { teamId: team.id }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["revenue-categories", { teamId: team.id }],
      });
      setIsDialogOpen(false);
    },
    [mutateAsync, addingRevenue, form, queryClient, team.id],
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full items-center gap-2 md:w-fit">
          <Plus size={16} />
          Adicionar Receita
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Receita em {team.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <Input
                    containerClassName="!bg-transparent border"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Descrição</FormLabel>
                  <textarea
                    className="h-24 resize-none rounded-md border !bg-transparent px-3 py-1 outline-none"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="amountInCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <Input
                      containerClassName="!bg-transparent border"
                      {...field}
                      value={field.value ? `R$ ${field.value}` : ""}
                      onChange={(e) => {
                        field.onChange(maskAmount(e.target.value));
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data </FormLabel>
                    <DatePicker
                      date={field.value ? new Date(field.value) : null}
                      setDate={(value) => {
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Recorrência</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALLOWED_RECURRENCES.map((recurrence) => (
                          <SelectItem key={recurrence} value={recurrence}>
                            {TRANSLATED_RECURRENCES[recurrence]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Show
                component={
                  <FormField
                    control={form.control}
                    name="until"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Até</FormLabel>
                        <DatePicker
                          date={field.value ? new Date(field.value) : null}
                          setDate={(value) => {
                            field.onChange(value);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                }
                when={form.watch("recurrence") !== "ONCE"}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger
                      disabled={isPending || isError}
                      className="h-12"
                    >
                      <SelectValue
                        placeholder={
                          isPending
                            ? "Carregando..."
                            : isError
                              ? "Erro ao carregar"
                              : "Categoria"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueCategories?.map((expCategory) => (
                        <SelectItem key={expCategory.id} value={expCategory.id}>
                          {expCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLOWED_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {TRANSLATED_STATUSES[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-6">
              <DialogClose>Cancelar</DialogClose>
              <Button disabled={addingRevenue} type="submit">
                Adicionar Receita
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { AddRevenueDialog };
