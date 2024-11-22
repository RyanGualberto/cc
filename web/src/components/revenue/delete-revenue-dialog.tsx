import type React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { type Revenue } from "~/types/revenue";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Switch } from "../ui/switch";
import Show from "../utils/show";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueRequest } from "~/requests/revenue";
import { useUserContext } from "~/hooks/use-user-context";
import { TIME_TO_CONFIRM } from "~/config/constants";

const DeleteRevenueDialog: React.FC<{
  revenue: Revenue;
}> = ({ revenue }) => {
  const queryClient = useQueryClient();
  const { selectedTeam } = useUserContext();
  const [confirmCount, setConfirmCount] = useState(TIME_TO_CONFIRM);
  const [open, setOpen] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const hasMany = useMemo(
    () => revenue.recurrence !== "once",
    [revenue.recurrence],
  );
  const { mutateAsync: deleteRequest, isPending: loadingDeleteRequest } =
    useMutation({
      mutationKey: [selectedTeam?.id, "revenues", revenue.id, "delete"],
      mutationFn: async () => {
        if (!selectedTeam) return;

        if (deleteAll) {
          return await revenueRequest.deleteByTeamAndBatchId({
            teamId: selectedTeam.id,
            batchId: revenue.batch,
          });
        }

        return await revenueRequest.deleteByTeamAndId({
          teamId: selectedTeam.id,
          id: revenue.id,
        });
      },
      onSuccess: () => {
        setOpen(false);
        if (!selectedTeam) return;
        void queryClient.invalidateQueries({
          queryKey: ["revenues", { teamId: selectedTeam.id }],
        });
        void queryClient.invalidateQueries({
          queryKey: ["revenue-categories", { teamId: selectedTeam.id }],
        });
      },
    });
  const disabledButton = useMemo(
    () => confirmCount !== 0 || loadingDeleteRequest,
    [confirmCount, loadingDeleteRequest],
  );

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
      <AlertDialogTrigger>
        <Button className="bg-red-500/10 text-red-500" size="icon">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir a receita?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Você está prestes a excluir a receita <strong>{revenue.title}</strong>
          . Esta ação não pode ser desfeita.
        </p>
        <Show
          when={hasMany}
          component={
            <div className="flex items-center gap-2">
              <Switch
                checked={deleteAll}
                name="deleteAll"
                onCheckedChange={(checked) => setDeleteAll(checked)}
              />
              <Label htmlFor="deleteAll">Excluir todas as recorrências</Label>
            </div>
          }
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            disabled={disabledButton}
            variant="destructive"
            className="disabled:opacity-50"
            onClick={async () => await deleteRequest()}
          >
            Confirmar {confirmCount > 0 ? `(${confirmCount})` : null}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteRevenueDialog };
