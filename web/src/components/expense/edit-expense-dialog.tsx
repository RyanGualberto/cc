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
import { Label } from "../ui/label";
import { editExpenseSchema } from "~/schemas/edit-expense-schema";
import { expensePaymentMethodsRequest } from "~/requests/expense-payment-method";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
  const [editSelection, setEditSelection] = useState<
    "just-this" | "include-all" | "include-future"
  >("just-this");
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

  const {
    data: expensePaymentMethods,
    isPending: isPendingExpensePaymentMethods,
    isError: isErrorExpensePaymentMethods,
  } = useQuery({
    queryKey: ["expense-payment-methods", { teamId: selectedTeam?.id }],
    queryFn: async () =>
      await expensePaymentMethodsRequest.listByTeam({
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
          date: new Date(data.date).toISOString(),
          paymentMethodId: data.paymentMethod,
          ...(editSelection !== "just-this" && {
            editSelection: editSelection,
          }),
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
      paymentMethod: expense.paymentMethod?.id ?? undefined,
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
      void queryClient.invalidateQueries({
        queryKey: ["expense-payment-methods", { teamId: selectedTeam?.id }],
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
                when={editSelection === "just-this"}
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
              when={editSelection === "just-this"}
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
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger
                      disabled={
                        isPendingExpensePaymentMethods ||
                        isErrorExpensePaymentMethods
                      }
                      className="h-12"
                    >
                      <SelectValue
                        placeholder={
                          isPendingExpensePaymentMethods
                            ? "Carregando..."
                            : isErrorExpensePaymentMethods
                              ? "Erro ao carregar"
                              : "Método de Pagamento"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {expensePaymentMethods?.map((expPaymentMethod) => (
                        <SelectItem
                          key={expPaymentMethod.id}
                          value={expPaymentMethod.id}
                        >
                          {expPaymentMethod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Show
              when={hasMany}
              component={
                <div className="flex items-center gap-2">
                  <RadioGroup
                    defaultValue="just-this"
                    value={editSelection}
                    onValueChange={(value) =>
                      setEditSelection(value as typeof editSelection)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="just-this" id="just-this" />
                      <Label htmlFor="just-this">Editar somente essa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="include-all" id="include-all" />
                      <Label htmlFor="include-all">Editar todas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="include-future"
                        id="include-future"
                      />
                      <Label htmlFor="include-future">Editar futuras</Label>
                    </div>
                  </RadioGroup>
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
