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
import { TeamMemberSchema } from "~/schemas/team-member-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import { useUserContext } from "~/hooks/use-user-context";
import React, { useCallback, useState } from "react";
import { type Team } from "~/types/team";

const AddTeamMemberDialog: React.FC<{
  team: Team;
}> = ({ team }) => {
  const form = useForm<z.infer<typeof TeamMemberSchema>>({
    resolver: zodResolver(TeamMemberSchema),
  });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { refetchTeams } = useUserContext();
  const { mutate, isPending } = useMutation({
    mutationKey: ["teams", team.id, "invite"],
    mutationFn: async (data: { email: string }) => {
      if (!team || !data.email) {
        return;
      }
      return await teamRequests
        .teamMemberInvite({
          teamId: team.id,
          email: data.email,
        })
        .then(() => {
          refetchTeams();
          void queryClient.invalidateQueries({
            queryKey: ["team", team.id, "invites"],
          });
          setOpen(false);
          form.reset();
        });
    },
  });

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isPending) return;
      await form.handleSubmit(
        async (values: z.infer<typeof TeamMemberSchema>) => {
          mutate(values);
        },
      )();
    },
    [form, mutate, isPending],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="items-center gap-2 w-full md:w-fit">
          <Plus size={16} />
          Adicionar Membro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Membro</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do membro</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="h-12">
              Enviar Convite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
