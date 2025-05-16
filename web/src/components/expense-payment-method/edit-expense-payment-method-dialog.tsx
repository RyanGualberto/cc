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
import React, { useCallback, useState } from "react";
import { type Team } from "~/types/team";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expensePaymentMethodsRequest } from "~/requests/expense-payment-method";
import { editExpensePaymentMethodSchema } from "~/schemas/edit-expense-payment-method-schema";
import { type ExpensePaymentMethod } from "~/types/expense-payment-method";

const EditExpensePaymentMethodDialog: React.FC<{
  team: Team;
  expensePaymentMethod: ExpensePaymentMethod;
}> = ({ team, expensePaymentMethod }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [
      "expense-payment-methods",
      team.id,
      expensePaymentMethod.id,
      "update",
    ],
    mutationFn: async (
      data: z.infer<typeof editExpensePaymentMethodSchema>,
    ) => {
      return await expensePaymentMethodsRequest.updateByTeamAndId({
        teamId: team.id,
        payload: {
          ...expensePaymentMethod,
          ...data,
        },
      });
    },
  });
  const form = useForm<z.infer<typeof editExpensePaymentMethodSchema>>({
    resolver: zodResolver(editExpensePaymentMethodSchema),
    defaultValues: {
      name: expensePaymentMethod.name,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof editExpensePaymentMethodSchema>) => {
      if (isPending) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["expense-payment-methods", { teamId: team.id }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["expenses", { teamId: team.id }],
      });
      setIsDialogOpen(false);
    },
    [mutateAsync, queryClient, team.id, isPending, form],
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
          <DialogTitle>Editar método de pagamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    containerClassName="!bg-transparent border"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-6">
              <DialogClose>Cancelar</DialogClose>
              <Button disabled={isPending} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditExpensePaymentMethodDialog };
