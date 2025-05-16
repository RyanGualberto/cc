import React from "react";
import { type Expense } from "~/types/expense";
import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
import { type OnChangeFn, type RowSelectionState } from "@tanstack/react-table";

const ExpensesTable: React.FC<{
  short?: boolean;
  data: Array<Expense>;
  teamId: string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onFilteredRowsChange?: (rows: Expense[]) => void;
}> = ({
  short,
  data,
  rowSelection,
  onRowSelectionChange,
  onFilteredRowsChange,
}) => {
  return (
    <DataTable
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      columns={columns(short ?? false)}
      onFilteredRowsChange={onFilteredRowsChange}
      data={data}
    />
  );
};

export { ExpensesTable };
