import {
  type FilterFnOption,
  type ColumnDef,
  type Column,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { type Expense } from "~/types/expense";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseRequest } from "~/requests/expense";
import {
  TRANSLATED_RECURRENCES,
  TRANSLATED_STATUSES,
} from "./add-expense-dialog";
import { Checkbox } from "../ui/checkbox";
import { useParams } from "next/navigation";
import { ColumnOptions } from "../ui/column-components";
import { EditExpenseDialog } from "./edit-expense-dialog";
import { DeleteExpenseDialog } from "./delete-expense-dialog";

export const columns = (short: boolean): ColumnDef<Expense>[] => [
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
      return <StatusCell status={status} expense={row.original} />;
    },
    accessorFn: (row) => TRANSLATED_STATUSES[row.status],
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Categoria
        <ColumnOptions column={column} />
      </div>
    ),
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const category = row.original.category;
      return category?.name ?? "N/A";
    },
    accessorFn: (row: Expense) => row.category?.name ?? "N/A",
  },
  ...(!short
    ? [
        {
          accessorKey: "recurrence",
          header: ({ column }: { column: Column<Expense> }) => (
            <div className="flex items-center gap-2">
              Recorrência
              <ColumnOptions column={column} />
            </div>
          ),
          filterFn: "arrIncludesSome" as FilterFnOption<Expense> | undefined,
          accessorFn: (row: Expense) => TRANSLATED_RECURRENCES[row.recurrence] ?? "N/A",
          cell: ({ row }: { row: { original: Expense } }) => {
            const recurrence = row.original.recurrence;
            return TRANSLATED_RECURRENCES[recurrence];
          },
        },
        {
          accessorKey: "actions",
          header: "Ações",
          cell: ({ row }: { row: { original: Expense } }) => {
            return <EditCell expense={row.original} />;
          },
        },
      ]
    : []),
];

const StatusCell: React.FC<{
  status: string;
  expense: Expense;
}> = ({ status, expense }) => {
  const queryClient = useQueryClient();
  const { ["team-id"]: teamId }: { ["team-id"]: string } = useParams();
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
  status: "PENDING" | "OVERDUE" | "PAID";
}> = ({ date, status }) => {
  const isNear =
    new Date(date) < new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) &&
    new Date(date) > new Date() &&
    status !== "PAID";

  const isOverdue = new Date(date) < new Date() && status !== "PAID";

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

const EditCell: React.FC<{ expense: Expense }> = ({ expense }) => {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <EditExpenseDialog expense={expense} />
      <DeleteExpenseDialog expense={expense} />
    </div>
  );
};
