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
import { expenseCategoriesRequest } from "~/requests/expense-category";
import { editExpenseCategorySchema } from "~/schemas/edit-expense-category-schema";
import { type ExpenseCategory } from "~/types/expense-category";

const EditExpenseCategoryDialog: React.FC<{
  team: Team;
  expenseCategory: ExpenseCategory;
}> = ({ team, expenseCategory }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["expense-categories", team.id, "create"],
    mutationFn: async (data: z.infer<typeof editExpenseCategorySchema>) => {
      return await expenseCategoriesRequest.updateByTeamAndId({
        teamId: team.id,
        payload: {
          ...expenseCategory,
          ...data,
        },
      });
    },
  });
  const form = useForm<z.infer<typeof editExpenseCategorySchema>>({
    resolver: zodResolver(editExpenseCategorySchema),
    defaultValues: {
      name: expenseCategory.name,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof editExpenseCategorySchema>) => {
      if (isPending) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["expense-categories", { teamId: team.id }],
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
          <DialogTitle>Editar categoria de despesa</DialogTitle>
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

export { EditExpenseCategoryDialog };
