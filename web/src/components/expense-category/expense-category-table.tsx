import React from "react";
import { type ExpenseCategory } from "~/types/expense-category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EditExpenseCategoryDialog } from "./edit-expense-category-dialog";
import { type Team } from "~/types/team";
import { DeleteExpenseCategoryDialog } from "./delete-expense-category-dialog";

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
              <DeleteExpenseCategoryDialog expenseCategory={expenseCategory} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpenseCategoryTable;
