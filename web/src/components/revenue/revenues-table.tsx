import React from "react";
import { type Revenue } from "~/types/revenue";

import { columns } from "./columns";
import { DataTable } from "../ui/data-table";
import { type OnChangeFn, type RowSelectionState } from "@tanstack/react-table";

const RevenuesTable: React.FC<{
  short?: boolean;
  data: Array<Revenue>;
  teamId: string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onFilteredRowsChange?: (rows: Revenue[]) => void;
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

export { RevenuesTable };
