import { type Revenue } from "~/types/revenue";
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
} from "./add-revenue-dialog";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueRequest } from "~/requests/revenue";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { type User } from "~/types/user";
import { DeleteRevenueDialog } from "./delete-revenue-dialog";
import { EditRevenueDialog } from "./edit-revenue-dialog";

const RevenuesTable: React.FC<{
  short?: boolean;
  data: Array<Revenue>;
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
        {data.map((revenue) => (
          <TableRow key={revenue.id}>
            <TableCell className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
              {revenue.title}
            </TableCell>
            <DateCell date={revenue.date} status={revenue.status} />
            <TableCell className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap">
              R$ {maskAmount(String(revenue.amountInCents))}
            </TableCell>
            <StatusCell
              teamId={teamId}
              status={revenue.status}
              revenue={revenue}
            />
            <TableCell className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {revenue.category ? revenue.category.name : "--"}
            </TableCell>
            <Show
              component={
                <React.Fragment>
                  <TableCell>
                    {TRANSLATED_RECURRENCES[revenue.recurrence]}
                  </TableCell>
                  <UserCell user={revenue.user} />
                  <EditCell revenue={revenue} />
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

const EditCell: React.FC<{ revenue: Revenue }> = ({ revenue }) => {
  return (
    <TableCell className="flex items-center justify-center gap-2">
      <EditRevenueDialog revenue={revenue} />
      <DeleteRevenueDialog revenue={revenue} />
    </TableCell>
  );
};

const StatusCell: React.FC<{
  status: string;
  teamId: string;
  revenue: Revenue;
}> = ({ status, teamId, revenue }) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["revenues", teamId, "update", revenue.id],
    mutationFn: async () => {
      return await revenueRequest
        .updateByTeamAndId({
          teamId,
          revenueId: revenue.id,
          payload: {
            amountInCents: revenue.amountInCents,
            categoryId: revenue.category?.id ?? null,
            date: revenue.date,
            description: revenue.description,
            status: "RECEIVED",
            title: revenue.title,
          },
        })
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["revenues", { teamId }],
          });
        });
    },
  });
  if (status === "RECEIVED") {
    return (
      <TableCell>
        <span className="rounded-full px-2 py-1 text-xs font-medium text-green-800">
          {TRANSLATED_STATUSES[status as "RECEIVED"]}
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
        Marcar como Recebido
      </Button>
    </TableCell>
  );
};

const DateCell: React.FC<{
  date: string;
  status: "PENDING" | "OVERDUE" | "RECEIVED";
}> = ({ date, status }) => {
  const isNear =
    new Date(date) < new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) &&
    new Date(date) > new Date() &&
    status !== "RECEIVED";

  const isOverdue = new Date(date) < new Date() && status !== "RECEIVED";

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

export { RevenuesTable };
