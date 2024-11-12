import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { SpaceSchema } from "~/schemas/space-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import { useUserContext } from "~/hooks/use-user-context";
import React, { useCallback, useState } from "react";
import { Team } from "~/types/team";

const EditSpaceDialog: React.FC<{
  team: Team;
  trigger: React.ReactNode;
}> = ({ team, trigger }) => {
  const form = useForm<z.infer<typeof SpaceSchema>>({
    resolver: zodResolver(SpaceSchema),
    defaultValues: {
      name: team.name,
    },
  });
  const [open, setOpen] = useState(false);
  const { refetchTeams } = useUserContext();
  const { mutate } = useMutation({
    mutationKey: ["spaces", team.id, "edit"],
    onMutate: async (data: { name: string }) =>
      await teamRequests
        .updateTeam({
          id: team.id,
          name: data.name,
        })
        .then(() => {
          refetchTeams();
          setOpen(false);
        }),
  });

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await form.handleSubmit(async (values: z.infer<typeof SpaceSchema>) => {
        mutate(values);
      })();
    },
    [form, mutate],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar espaço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do espaço</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-12">
              Editar espaço
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpaceDialog;