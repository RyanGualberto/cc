import React from "react";
import { type Expense } from "~/types/expense";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import maskAmount from "~/helpers/maskAmount";

const ExpenseResumeCards: React.FC<{
  data: Array<Expense>;
}> = ({ data }) => {
  const organizedData = data.reduce(
    (acc, expense) => {
      if (expense.status === "pending") {
        acc.pending += expense.amountInCents;
      } else if (expense.status === "paid") {
        acc.paid += expense.amountInCents;
      } else if (expense.status === "overdue") {
        acc.overdue += expense.amountInCents;
      }
      acc.total += expense.amountInCents;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      paid: 0,
      overdue: 0,
    },
  );

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-48 bg-blue-400 text-white dark:bg-blue-950">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">
            R$ {maskAmount(String(organizedData.total))}
          </CardTitle>
        </CardHeader>
        <CardFooter>Total</CardFooter>
      </Card>
      <Card className="w-48 bg-yellow-400 text-white dark:bg-yellow-900">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">
            R$ {maskAmount(String(organizedData.pending))}
          </CardTitle>
        </CardHeader>
        <CardFooter>Pendente</CardFooter>
      </Card>
      <Card className="w-48 bg-green-400 text-white dark:bg-green-900">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">
            R$ {maskAmount(String(organizedData.paid))}
          </CardTitle>
        </CardHeader>
        <CardFooter>Pagos</CardFooter>
      </Card>
      <Card className="w-48 bg-red-400 text-white dark:bg-red-900">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">
            R$ {maskAmount(String(organizedData.overdue))}
          </CardTitle>
        </CardHeader>
        <CardFooter>Atrasados</CardFooter>
      </Card>
    </div>
  );
};

export { ExpenseResumeCards };
