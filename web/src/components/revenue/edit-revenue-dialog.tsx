import { Edit } from "lucide-react";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ALLOWED_STATUSES } from "~/schemas/add-revenue-schema";
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
import { type Revenue } from "~/types/revenue";
import { useUserContext } from "~/hooks/use-user-context";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { editRevenueSchema } from "~/schemas/edit-revenue-schema";

export const TRANSLATED_RECURRENCES = {
  ONCE: "Uma vez",
  DAILY: "Diário",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  FIFTH_WORKING_DAY: "Quinto dia útil",
};

export const TRANSLATED_STATUSES = {
  PENDING: "Pendente",
  RECEIVED: "Recebido",
  OVERDUE: "Atrasado",
};

const EditRevenueDialog: React.FC<{
  revenue: Revenue;
}> = ({ revenue }) => {
  const queryClient = useQueryClient();
  const { selectedTeam } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [includeFuture, setDeleteAll] = useState(false);
  const hasMany = useMemo(
    () => revenue.recurrence !== "ONCE",
    [revenue.recurrence],
  );
  const {
    data: revenueCategories,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["revenue-categories", { teamId: selectedTeam?.id }],
    queryFn: async () =>
      await revenueCategoriesRequest.listByTeam({
        teamId: selectedTeam!.id,
      }),
  });

  const { mutateAsync, isPending: addingRevenue } = useMutation({
    mutationKey: ["revenues", selectedTeam?.id, revenue.id, "edit"],
    mutationFn: async (data: z.infer<typeof editRevenueSchema>) => {
      return await revenueRequest.updateByTeamAndId({
        revenueId: revenue.id,
        payload: {
          categoryId: data.category,
          amountInCents: parseInt(
            String(data.amountInCents).replace(/\D/g, ""),
          ),
          description: data.description ?? null,
          title: data.title,
          status: data.status,
          includeFuture: includeFuture,
          date: new Date(data.date).toISOString(),
        },
        teamId: selectedTeam!.id,
      });
    },
  });
  const form = useForm<z.infer<typeof editRevenueSchema>>({
    resolver: zodResolver(editRevenueSchema),
  });

  useEffect(() => {
    form.reset({
      status: revenue.status,
      title: revenue.title,
      description: revenue.description ?? undefined,
      amountInCents: maskAmount(String(revenue.amountInCents)),
      category: revenue.category?.id ?? undefined,
      date: new Date(revenue.date),
    });
  }, [revenue, form]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof editRevenueSchema>) => {
      if (addingRevenue) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["revenues", { teamId: selectedTeam?.id }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["revenue-categories", { teamId: selectedTeam?.id }],
      });
      setIsDialogOpen(false);
    },
    [mutateAsync, addingRevenue, form, queryClient, selectedTeam?.id],
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500/10 text-blue-500" size="icon">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
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
              <Show
                when={!includeFuture}
                component={
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
                }
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
            <Show
              when={!includeFuture}
              component={
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
              }
            />
            <Show
              when={hasMany}
              component={
                <div className="flex items-center gap-2">
                  <Switch
                    checked={includeFuture}
                    name="includeFuture"
                    onCheckedChange={(checked) => setDeleteAll(checked)}
                  />
                  <Label htmlFor="includeFuture">
                    Editar todas as recorrências
                  </Label>
                </div>
              }
            />
            <DialogFooter className="gap-6">
              <DialogClose>Cancelar</DialogClose>
              <Button disabled={addingRevenue} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditRevenueDialog };
