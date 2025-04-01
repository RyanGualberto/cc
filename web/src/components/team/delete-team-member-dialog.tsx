import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import { useUserContext } from "~/hooks/use-user-context";
import React, { useCallback, useEffect, useState } from "react";
import { type TeamMember, type Team } from "~/types/team";
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

const DeleteTeamMemberDialog: React.FC<{
  team: Team;
  teamMember: TeamMember;
  trigger: React.ReactNode;
}> = ({ team, trigger, teamMember }) => {
  const [confirmCount, setConfirmCount] = useState(TIME_TO_CONFIRM);
  const [open, setOpen] = useState(false);
  const { refetchTeams } = useUserContext();
  const { mutate, isPending } = useMutation({
    mutationKey: ["team", team.id, "members", teamMember.id, "delete"],
    mutationFn: async () =>
      await teamRequests.removeTeamMember(team.id, teamMember.id).then(() => {
        refetchTeams();
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
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover Membro</AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Tem certeza que deseja remover{" "}
          <strong>
            {teamMember.user.firstName} {teamMember.user.lastName}
          </strong>{" "}
          do time?
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>

          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              mutate();
            }}
          >
            Remover
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamMemberDialog;
