import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { type Team } from "~/types/team";
import { Button } from "../ui/button";
import Show from "../utils/show";
import { HeaderWithMonthPicker } from "../ui/header-with-month-picker";
import { ExpensesTable } from "./expenses-table";
import { ExpenseResumeCards } from "./expense-resume-cards";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseRequest } from "~/requests/expense";
import Link from "next/link";
import { AddExpenseDialog } from "./add-expense-dialog";
import { Loading } from "../ui/loading";
import { type RowSelectionState } from "@tanstack/react-table";
import { type Expense } from "~/types/expense";

const ExpensesCard: React.FC<{
  team: Team;
  short?: boolean;
}> = ({ team, short = false }) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const queryClient = useQueryClient();
  const [date, setDate] = React.useState(
    new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    }),
  );
  const {
    data: expenses,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["expenses", { teamId: team.id }],
    queryFn: async () =>
      await expenseRequest.listByTeamAndDate({
        teamId: team.id,
        date,
      }),
  });
  const [filteredData, setFilteredData] = React.useState<Expense[]>([]);

  useEffect(() => {
    setFilteredData(expenses ?? []);
  }, [expenses]);

  useEffect(() => {
    void queryClient.invalidateQueries({
      queryKey: ["expenses", { teamId: team.id }],
    });
  }, [date, team.id, queryClient]);

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Despesas</CardTitle>
        <AddExpenseDialog team={team} />
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
        when={Boolean(expenses)}
        component={
          <CardContent className="flex flex-col gap-8">
            <HeaderWithMonthPicker value={date} onChange={setDate} />
            <ExpenseResumeCards rowSelection={rowSelection} data={filteredData} />
            <ExpensesTable
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              onFilteredRowsChange={setFilteredData}
              short={short}
              data={expenses!}
              teamId={team.id}
            />
            <Show
              component={
                <Button className="w-full" variant="ghost" asChild>
                  <Link href={`/app/${team.id}/expenses`}>
                    Ver todas as despesas
                  </Link>
                </Button>
              }
              when={short}
            />
          </CardContent>
        }
      />
    </Card>
  );
};

export default ExpensesCard;
