import {
  type Column,
  type FilterFnOption,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { type Revenue } from "~/types/revenue";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueRequest } from "~/requests/revenue";
import {
  TRANSLATED_RECURRENCES,
  TRANSLATED_STATUSES,
} from "./add-revenue-dialog";
import { Checkbox } from "../ui/checkbox";
import { useParams } from "next/navigation";
import { ColumnOptions } from "../ui/column-components";
import { EditRevenueDialog } from "./edit-revenue-dialog";
import { DeleteRevenueDialog } from "./delete-revenue-dialog";

export const columns = (short: boolean): ColumnDef<Revenue>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mb-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mb-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Nome
        <ColumnOptions column={column} />
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.title;
      const b = rowB.original.title;
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
      }

      return 0;
    },

    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Data
        <ColumnOptions column={column} />
      </div>
    ),
    filterFn: "arrIncludesSome",
    accessorFn: (row) => {
      return new Date(row.date).toLocaleDateString("pt-BR");
    },
    cell: ({ row }) => {
      const date: string = row.original.date;
      return <DateCell date={date} status={row.original.status} />;
    },
  },
  {
    accessorKey: "amountInCents",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Valor
        <ColumnOptions column={column} />
      </div>
    ),
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const amountInCents = row.original.amountInCents;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(amountInCents) / 100);
    },
    accessorFn: (row) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(row.amountInCents) / 100);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Status
        <ColumnOptions column={column} />
      </div>
    ),
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusCell status={status} revenue={row.original} />;
    },
    accessorFn: (row) => TRANSLATED_STATUSES[row.status],
  },
  ...(!short
    ? [
        {
          accessorKey: "recurrence",
          header: ({ column }: { column: Column<Revenue> }) => (
            <div className="flex items-center gap-2">
              Recorrência
              <ColumnOptions column={column} />
            </div>
          ),
          filterFn: "arrIncludesSome" as FilterFnOption<Revenue> | undefined,
          accessorFn: (row: Revenue) =>
            TRANSLATED_RECURRENCES[row.recurrence] ?? "N/A",
          cell: ({ row }: { row: { original: Revenue } }) => {
            const recurrence = row.original.recurrence;
            return TRANSLATED_RECURRENCES[recurrence];
          },
        },
        {
          accessorKey: "category",
          header: ({ column }: { column: Column<Revenue> }) => (
            <div className="flex items-center gap-2">
              Categoria
              <ColumnOptions column={column} />
            </div>
          ),
          filterFn: "arrIncludesSome" as FilterFnOption<Revenue> | undefined,
          cell: ({ row }: { row: { original: Revenue } }) => {
            const category = row.original.category;
            return category?.name ?? "N/A";
          },
          accessorFn: (row: Revenue) => row.category?.name ?? "N/A",
        },
        {
          accessorKey: "actions",
          header: "Ações",
          cell: ({ row }: { row: { original: Revenue } }) => {
            return <EditCell revenue={row.original} />;
          },
        },
      ]
    : [
        {
          accessorKey: "actions",
          header: "Ações",
          cell: ({ row }: { row: { original: Revenue } }) => {
            return <EditCell revenue={row.original} />;
          },
        },
      ]),
];

const StatusCell: React.FC<{
  status: string;
  revenue: Revenue;
}> = ({ status, revenue }) => {
  const queryClient = useQueryClient();
  const { ["team-id"]: teamId }: { ["team-id"]: string } = useParams();
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
      <span>
        <span className="rounded-full px-2 py-1 text-xs font-medium text-green-800">
          {TRANSLATED_STATUSES[status]}
        </span>
      </span>
    );
  }

  return (
    <span>
      <Button
        disabled={isPending}
        onClick={() => mutateAsync()}
        className="bg-green-500/10 text-green-500"
      >
        Marcar como Pago
      </Button>
    </span>
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
    <span
      className={cn({
        "text-red-500": status === "OVERDUE" || isOverdue,
        "text-yellow-500": isNear,
      })}
    >
      {new Date(date).toLocaleDateString("pt-BR")}
    </span>
  );
};

const EditCell: React.FC<{ revenue: Revenue }> = ({ revenue }) => {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <EditRevenueDialog revenue={revenue} />
      <DeleteRevenueDialog revenue={revenue} />
    </div>
  );
};
