import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import { useUserContext } from "~/hooks/use-user-context";
import React, { useState } from "react";
import { Team } from "~/types/team";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const DeleteSpaceDialog: React.FC<{
  team: Team;
  trigger: React.ReactNode;
}> = ({ team, trigger }) => {
  const [open, setOpen] = useState(false);
  const { refetchTeams } = useUserContext();
  const { mutate } = useMutation({
    mutationKey: ["spaces", team.id, "delete"],
    onMutate: async () =>
      await teamRequests.deleteTeam(team.id).then(() => {
        refetchTeams();
        setOpen(false);
      }),
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Espaço</AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Você tem certeza que deseja excluir o espaço{" "}
          <strong>{team.name}</strong>? Essa ação não pode ser desfeita.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={() => {
              mutate();
            }}
          >
            Excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSpaceDialog;
