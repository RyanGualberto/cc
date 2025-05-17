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
import { type RevenueCategory } from "~/types/revenue-category";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueCategoriesRequest } from "~/requests/revenue-category";
import { useUserContext } from "~/hooks/use-user-context";
import { TIME_TO_CONFIRM } from "~/config/constants";

const DeleteRevenueCategoryDialog: React.FC<{
  revenueCategory: RevenueCategory;
}> = ({ revenueCategory }) => {
  const queryClient = useQueryClient();
  const { selectedTeam } = useUserContext();
  const [confirmCount, setConfirmCount] = useState(TIME_TO_CONFIRM);
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteRequest, isPending: loadingDeleteRequest } =
    useMutation({
      mutationKey: [
        selectedTeam?.id,
        "revenue-categories",
        revenueCategory.id,
        "delete",
      ],
      mutationFn: async () => {
        if (!selectedTeam) return;

        return await revenueCategoriesRequest.deleteByTeamAndId({
          teamId: selectedTeam.id,
          payload: revenueCategory,
        });
      },
      onSuccess: () => {
        setOpen(false);
        if (!selectedTeam) return;
        void queryClient.invalidateQueries({
          queryKey: ["revenue-categories", { teamId: selectedTeam.id }],
        });
        void queryClient.invalidateQueries({
          queryKey: ["revenues", { teamId: selectedTeam.id }],
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
      <AlertDialogTrigger asChild>
        <Button className="bg-red-500/10 text-red-500" size="icon">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir a categoria de despesa?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Você está prestes a excluir a categoria de despesa{" "}
          <strong>{revenueCategory.name}</strong>. Esta ação não pode ser
          desfeita.
        </p>
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

export { DeleteRevenueCategoryDialog };
