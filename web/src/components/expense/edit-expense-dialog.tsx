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
import { ALLOWED_STATUSES } from "~/schemas/add-expense-schema";
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
import { expenseRequest } from "~/requests/expense";
import Show from "../utils/show";
import { expenseCategoriesRequest } from "~/requests/expense-category";
import { type Expense } from "~/types/expense";
import { useUserContext } from "~/hooks/use-user-context";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { editExpenseSchema } from "~/schemas/edit-expense-schema";

export const TRANSLATED_RECURRENCES = {
  ONCE: "Uma vez",
  DAILY: "Diário",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
};

export const TRANSLATED_STATUSES = {
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Atrasado",
};

const EditExpenseDialog: React.FC<{
  expense: Expense;
}> = ({ expense }) => {
  const queryClient = useQueryClient();
  const { selectedTeam } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [includeFuture, setDeleteAll] = useState(false);
  const hasMany = useMemo(
    () => expense.recurrence !== "ONCE",
    [expense.recurrence],
  );
  const {
    data: expenseCategories,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["expense-categories", { teamId: selectedTeam?.id }],
    queryFn: async () =>
      await expenseCategoriesRequest.listByTeam({
        teamId: selectedTeam!.id,
      }),
  });

  const { mutateAsync, isPending: addingExpense } = useMutation({
    mutationKey: ["expenses", selectedTeam?.id, expense.id, "edit"],
    mutationFn: async (data: z.infer<typeof editExpenseSchema>) => {
      return await expenseRequest.updateByTeamAndId({
        expenseId: expense.id,
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
  const form = useForm<z.infer<typeof editExpenseSchema>>({
    resolver: zodResolver(editExpenseSchema),
  });

  useEffect(() => {
    form.reset({
      status: expense.status,
      title: expense.title,
      description: expense.description ?? undefined,
      amountInCents: maskAmount(String(expense.amountInCents)),
      category: expense.category?.id ?? undefined,
      date: new Date(expense.date),
    });
  }, [expense, form]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof editExpenseSchema>) => {
      if (addingExpense) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["expenses", { teamId: selectedTeam?.id }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["expense-categories", { teamId: selectedTeam?.id }],
      });
      setIsDialogOpen(false);
    },
    [mutateAsync, addingExpense, form, queryClient, selectedTeam?.id],
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
          <DialogTitle>Editar Despesa</DialogTitle>
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
                      {expenseCategories?.map((expCategory) => (
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
              <Button disabled={addingExpense} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditExpenseDialog };
