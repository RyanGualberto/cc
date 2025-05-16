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
import { addExpensePaymentMethodSchema } from "~/schemas/add-expense-payment-method-schema";
import { type z } from "zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expensePaymentMethodsRequest } from "~/requests/expense-payment-method";

const AddExpensePaymentMethodDialog: React.FC<{
  team: Team;
}> = ({ team }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["expense-payment-methods", team.id, "create"],
    mutationFn: async (data: z.infer<typeof addExpensePaymentMethodSchema>) => {
      return await expensePaymentMethodsRequest.createByTeam({
        name: data.name,
        teamId: team.id,
      });
    },
  });
  const form = useForm<z.infer<typeof addExpensePaymentMethodSchema>>({
    resolver: zodResolver(addExpensePaymentMethodSchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof addExpensePaymentMethodSchema>) => {
      if (isPending) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["expense-payment-methods", { teamId: team.id }],
      });
      setIsDialogOpen(false);
    },
    [mutateAsync, queryClient, team.id, isPending, form],
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full items-center gap-2 md:w-fit">
          <Plus size={16} />
          Adicionar Método de Pagamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Adicionar Método de Pagamento em {team.name}
          </DialogTitle>
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
                Adicionar Método de Pagamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { AddExpensePaymentMethodDialog };
