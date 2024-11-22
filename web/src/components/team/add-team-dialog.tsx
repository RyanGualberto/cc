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
import { TeamSchema } from "~/schemas/team-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import { useUserContext } from "~/hooks/use-user-context";
import { useCallback, useState } from "react";

const AddTeamDialog = () => {
  const form = useForm<z.infer<typeof TeamSchema>>({
    resolver: zodResolver(TeamSchema),
  });
  const [open, setOpen] = useState(false);
  const { refetchTeams } = useUserContext();
  const { mutate, isPending } = useMutation({
    mutationKey: ["team", "create"],
    mutationFn: async (data: { name: string }) =>
      await teamRequests.createTeam(data).then(() => {
        refetchTeams();
        setOpen(false);
      }),
  });

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isPending) return;
      await form.handleSubmit(async (values: z.infer<typeof TeamSchema>) => {
        mutate(values);
      })();
    },
    [form, mutate, isPending],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="items-center gap-2">
          <Plus size={16} />
          Adicionar espaço
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar espaço</DialogTitle>
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
            <Button disabled={isPending} type="submit" className="h-12">
              Adicionar espaço
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamDialog;
