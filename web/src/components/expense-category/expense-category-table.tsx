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
import { Edit, Trash2 } from "lucide-react";

const ExpenseCategoryTable: React.FC<{
  data: Array<ExpenseCategory>;
}> = ({ data }) => {
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
              <Button className="bg-blue-500/10 text-blue-500" size="icon">
                <Edit size={16} />
              </Button>
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
