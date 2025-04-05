import { type Expense } from "~/types/expense";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Show from "../utils/show";
import React from "react";
import maskAmount from "~/helpers/maskAmount";
import {
  TRANSLATED_RECURRENCES,
  TRANSLATED_STATUSES,
} from "./add-expense-dialog";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseRequest } from "~/requests/expense";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { type User } from "~/types/user";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { EditExpenseDialog } from "./edit-expense-dialog";

const ExpensesTable: React.FC<{
  short?: boolean;
  data: Array<Expense>;
  teamId: string;
}> = ({ short, data, teamId }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Categoria</TableHead>
          <Show
            component={
              <React.Fragment>
                <TableHead>Recorrência</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead className="text-center">#</TableHead>
              </React.Fragment>
            }
            when={!short}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
              {expense.title}
            </TableCell>
            <DateCell date={expense.date} status={expense.status} />
            <TableCell className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap">
              R$ {maskAmount(String(expense.amountInCents))}
            </TableCell>
            <StatusCell
              teamId={teamId}
              status={expense.status}
              expense={expense}
            />
            <TableCell className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {expense.category ? expense.category.name : "--"}
            </TableCell>
            <Show
              component={
                <React.Fragment>
                  <TableCell>
                    {TRANSLATED_RECURRENCES[expense.recurrence]}
                  </TableCell>
                  <UserCell user={expense.user} />
                  <EditCell expense={expense} />
                </React.Fragment>
              }
              when={!short}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const UserCell: React.FC<{ user: User }> = ({ user }) => {
  return (
    <TableCell>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage
                src="/images/avatar.png"
                alt="Avatar"
                width={40}
                height={40}
              />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <span>
              {user.firstName} {user.lastName}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

const EditCell: React.FC<{ expense: Expense }> = ({ expense }) => {
  return (
    <TableCell className="flex items-center justify-center gap-2">
      <EditExpenseDialog expense={expense} />
      <DeleteExpenseDialog expense={expense} />
    </TableCell>
  );
};

const StatusCell: React.FC<{
  status: string;
  teamId: string;
  expense: Expense;
}> = ({ status, teamId, expense }) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["expenses", teamId, "update", expense.id],
    mutationFn: async () => {
      return await expenseRequest
        .updateByTeamAndId({
          teamId,
          expenseId: expense.id,
          payload: {
            amountInCents: expense.amountInCents,
            categoryId: expense.category?.id ?? null,
            date: expense.date,
            description: expense.description,
            status: "PAID",
            title: expense.title,
          },
        })
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["expenses", { teamId }],
          });
        });
    },
  });
  if (status === "PAID") {
    return (
      <TableCell>
        <span className="rounded-full px-2 py-1 text-xs font-medium text-green-800">
          {TRANSLATED_STATUSES[status as "PAID"]}
        </span>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <Button
        disabled={isPending}
        onClick={() => mutateAsync()}
        className="bg-green-500/10 text-green-500"
      >
        Marcar como Pago
      </Button>
    </TableCell>
  );
};

const DateCell: React.FC<{
  date: string;
  status: "PENDING" | "OVERDUE" | "PAID";
}> = ({ date, status }) => {
  const isNear =
    new Date(date) < new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) &&
    new Date(date) > new Date() &&
    status !== "PAID";

  const isOverdue = new Date(date) < new Date() && status !== "PAID";

  return (
    <TableCell
      className={cn({
        "text-red-500": status === "OVERDUE" || isOverdue,
        "text-yellow-500": isNear,
      })}
    >
      {new Date(date).toLocaleDateString("pt-BR")}
    </TableCell>
  );
};

export { ExpensesTable };
