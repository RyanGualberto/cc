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
import { Edit, Trash2 } from "lucide-react";
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
import { User } from "~/types/user";

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
            <TableCell>{expense.title}</TableCell>
            <DateCell date={expense.date} status={expense.status} />
            <TableCell>
              R$ {maskAmount(String(expense.amountInCents))}
            </TableCell>
            <StatusCell
              teamId={teamId}
              status={expense.status}
              expense={expense}
            />
            <TableCell>
              {expense.category ? expense.category.name : "--"}
            </TableCell>
            <Show
              component={
                <React.Fragment>
                  <TableCell>
                    {TRANSLATED_RECURRENCES[expense.recurrence]}
                  </TableCell>
                  <UserCell user={expense.user} />
                  <EditCell id={expense.id} />
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
                {user.first_name[0]}
                {user.last_name[0]}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <span>
              {user.first_name} {user.last_name}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

const EditCell: React.FC<{ id: string }> = ({ id }) => {
  return (
    <TableCell className="flex items-center justify-center gap-2">
      <Button className="bg-blue-500/10 text-blue-500" size="icon">
        <Edit size={16} />
      </Button>
      <Button className="bg-red-500/10 text-red-500" size="icon">
        <Trash2 size={16} />
      </Button>
    </TableCell>
  );
};

const StatusCell: React.FC<{
  status: string;
  teamId: string;
  expense: Expense;
}> = ({ status, teamId, expense }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["expenses", teamId, "update", expense.id],
    onMutate: async () => {
      return await expenseRequest
        .updateByTeamAndId({
          teamId,
          payload: {
            ...expense,
            status: "paid",
            description: expense.description || undefined,
          },
        })
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["expenses", { teamId }],
          });
        });
    },
  });
  if (status === "paid") {
    return (
      <TableCell>
        <span className="rounded-full px-2 py-1 text-xs font-medium text-green-800">
          {TRANSLATED_STATUSES[status as "paid"]}
        </span>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <Button
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
  status: "pending" | "overdue" | "paid";
}> = ({ date, status }) => {
  const isNear =
    new Date(date) < new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) &&
    new Date(date) > new Date() &&
    status !== "paid";

  return (
    <TableCell
      className={cn({
        "text-red-500": status === "overdue",
        "text-yellow-500": isNear,
      })}
    >
      {new Date(date).toLocaleDateString("pt-BR")}
    </TableCell>
  );
};

export { ExpensesTable };
