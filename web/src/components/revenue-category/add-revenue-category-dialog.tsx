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
import { addRevenueCategorySchema } from "~/schemas/add-revenue-category-schema";
import { type z } from "zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueCategoriesRequest } from "~/requests/revenue-category";

const AddRevenueCategoryDialog: React.FC<{
  team: Team;
}> = ({ team }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["revenue-categories", team.id, "create"],
    mutationFn: async (data: z.infer<typeof addRevenueCategorySchema>) => {
      return await revenueCategoriesRequest.createByTeam({
        name: data.name,
        teamId: team.id,
      });
    },
  });
  const form = useForm<z.infer<typeof addRevenueCategorySchema>>({
    resolver: zodResolver(addRevenueCategorySchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof addRevenueCategorySchema>) => {
      if (isPending) return;
      await mutateAsync(data);
      form.reset();
      void queryClient.invalidateQueries({
        queryKey: ["revenue-categories", { teamId: team.id }],
      });
      setIsDialogOpen(false);
    },
    [mutateAsync, queryClient, team.id, isPending, form],
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="items-center gap-2">
          <Plus size={16} />
          Adicionar Categoria de Receita
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Adicionar Categoria de Receita em {team.name}
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
                Adicionar Categoria de Receita
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { AddRevenueCategoryDialog };
