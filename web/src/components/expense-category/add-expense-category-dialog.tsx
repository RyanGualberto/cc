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
import React, { useState } from "react";
import { type Team } from "~/types/team";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addExpenseCategorySchema } from "~/schemas/add-expense-category-schema";
import { type z } from "zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseCategoriesRequest } from "~/requests/expense-category";

const AddExpenseCategoryDialog: React.FC<{
  team: Team;
}> = ({ team }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync } = useMutation({
    mutationKey: ["expense-categories", team.id, "create"],
    mutationFn: async (data: z.infer<typeof addExpenseCategorySchema>) => {
      await expenseCategoriesRequest.createByTeam({
        name: data.name,
        teamId: team.id,
      });
    },
  });
  const form = useForm<z.infer<typeof addExpenseCategorySchema>>({
    resolver: zodResolver(addExpenseCategorySchema),
  });

  const onSubmit = async (data: z.infer<typeof addExpenseCategorySchema>) => {
    await mutateAsync(data);
    form.reset();
    void queryClient.invalidateQueries({
      queryKey: ["expense-categories", { teamId: team.id }],
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="items-center gap-2">
          <Plus size={16} />
          Adicionar Categoria de Despesa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Adicionar Categoria de Despesa em {team.name}
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
              <Button type="submit">Adicionar Categoria de Despesa</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { AddExpenseCategoryDialog };
