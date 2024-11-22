import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import { useUserContext } from "~/hooks/use-user-context";
import React, { useCallback, useEffect, useState } from "react";
import { type TeamInvite, type Team } from "~/types/team";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { TIME_TO_CONFIRM } from "~/config/constants";

const DeleteTeamInviteDialog: React.FC<{
  team: Team;
  invite: TeamInvite;
  trigger: React.ReactNode;
}> = ({ team, trigger, invite }) => {
  const queryClient = useQueryClient();
  const [confirmCount, setConfirmCount] = useState(TIME_TO_CONFIRM);
  const [open, setOpen] = useState(false);
  const { refetchTeams } = useUserContext();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["team", team.id, "invite", invite.id, "delete"],
    mutationFn: async () =>
      await teamRequests.removeTeamInvite(team.id, invite.id).then(() => {
        refetchTeams();
        void queryClient.invalidateQueries({
          queryKey: ["team", team.id, "invites"],
        });
        setOpen(false);
      }),
  });

  useEffect(() => {
    if (open && confirmCount > 0) {
      const interval = setInterval(() => {
        setConfirmCount(confirmCount - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, confirmCount]);

  const onOpenChange = useCallback((open: boolean) => {
    if (open) {
      setConfirmCount(TIME_TO_CONFIRM);
      setOpen(true);
      return;
    }

    setOpen(false);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger disabled={team.role === "MEMBER"} asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Convite de Time</AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Você tem certeza que deseja excluir o convite para o time{" "}
          <strong>{team.name}</strong> para o email{" "}
          <strong>{invite.email}</strong>? Essa ação não pode ser desfeita.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>

          <Button
            variant="destructive"
            disabled={confirmCount !== 0 || isPending}
            onClick={async () => {
              await mutateAsync();
            }}
          >
            Excluir {confirmCount !== 0 ? `(${confirmCount})` : ""}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamInviteDialog;
