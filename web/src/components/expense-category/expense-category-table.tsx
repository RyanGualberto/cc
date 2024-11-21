import React from "react";
import { ExpenseCategory } from "~/types/expense-category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { EditExpenseCategoryDialog } from "./edit-expense-category-dialog";
import { type Team } from "~/types/team";

const ExpenseCategoryTable: React.FC<{
  data: Array<ExpenseCategory>;
  team: Team;
}> = ({ data, team }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Despesas</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((expenseCategory) => (
          <TableRow key={expenseCategory.id}>
            <TableCell>{expenseCategory.name}</TableCell>
            <TableCell>{expenseCategory._count?.expenses}</TableCell>
            <TableCell className="flex items-center gap-2">
              <EditExpenseCategoryDialog
                team={team}
                expenseCategory={expenseCategory}
              />
              <Button className="bg-red-500/10 text-red-500" size="icon">
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpenseCategoryTable;
