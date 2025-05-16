import React from "react";
import { type Team } from "~/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { expensePaymentMethodsRequest } from "~/requests/expense-payment-method";
import Show from "../utils/show";
import ExpensePaymentMethodTable from "./expense-payment-method-table";
import { AddExpensePaymentMethodDialog } from "./add-expense-payment-method-dialog";
import { Loading } from "../ui/loading";

const ExpensePaymentMethodCard: React.FC<{ team: Team }> = ({ team }) => {
  const {
    data: expensePaymentMethods,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["expense-payment-methods", { teamId: team.id }],
    queryFn: async () =>
      await expensePaymentMethodsRequest.listByTeam({
        teamId: team.id,
      }),
  });

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Métodos de pagamento</CardTitle>
        <AddExpensePaymentMethodDialog team={team} />
      </CardHeader>
      <Show
        when={isPending}
        component={
          <CardContent>
            <Loading />
          </CardContent>
        }
      />
      <Show
        when={isError}
        component={
          <CardContent>Erro ao carregar métodos de pagamento</CardContent>
        }
      />
      <Show
        when={Boolean(expensePaymentMethods)}
        component={
          <CardContent>
            <ExpensePaymentMethodTable
              team={team}
              data={expensePaymentMethods!}
            />
          </CardContent>
        }
      />
    </Card>
  );
};

export default ExpensePaymentMethodCard;
