import React from "react";
import { type Team } from "~/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { expenseCategoriesRequest } from "~/requests/expense-category";
import Show from "../utils/show";
import ExpenseCategoryTable from "./expense-category-table";
import { AddExpenseCategoryDialog } from "./add-expense-category-dialog";
import { Loading } from "../ui/loading";

const ExpenseCategoryCard: React.FC<{ team: Team; date: string }> = ({
  team,
  date,
}) => {
  const {
    data: expenseCategories,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["expense-categories", { teamId: team.id, date }],
    queryFn: async () =>
      await expenseCategoriesRequest.listByTeam({
        teamId: team.id,
        date,
      }),
  });

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Categorias de despesas</CardTitle>
        <AddExpenseCategoryDialog team={team} />
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
        component={<CardContent>Erro ao carregar despesas</CardContent>}
      />
      <Show
        when={Boolean(expenseCategories)}
        component={
          <CardContent>
            <ExpenseCategoryTable team={team} data={expenseCategories!} />
          </CardContent>
        }
      />
    </Card>
  );
};

export default ExpenseCategoryCard;
