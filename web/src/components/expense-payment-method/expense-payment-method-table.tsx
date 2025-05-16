import React from "react";
import { type ExpensePaymentMethod } from "~/types/expense-payment-method";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EditExpensePaymentMethodDialog } from "./edit-expense-payment-method-dialog";
import { type Team } from "~/types/team";
import { DeleteExpensePaymentMethodDialog } from "./delete-expense-payment-method-dialog";

const ExpensePaymentMethodTable: React.FC<{
  data: Array<ExpensePaymentMethod>;
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
        {data.map((expensePaymentMethod) => (
          <TableRow key={expensePaymentMethod.id}>
            <TableCell>{expensePaymentMethod.name}</TableCell>
            <TableCell>{expensePaymentMethod._count?.expenses}</TableCell>
            <TableCell className="flex items-center gap-2">
              <EditExpensePaymentMethodDialog
                team={team}
                expensePaymentMethod={expensePaymentMethod}
              />
              <DeleteExpensePaymentMethodDialog
                expensePaymentMethod={expensePaymentMethod}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensePaymentMethodTable;
