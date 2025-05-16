"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Team } from "~/types/team";
import type { Expense } from "~/types/expense";
import { Button } from "../ui/button";
import Show from "../utils/show";
import { ExpensesTable } from "./expenses-table";
import { ExpenseResumeCards } from "./expense-resume-cards";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseRequest } from "~/requests/expense";
import Link from "next/link";
import { AddExpenseDialog } from "./add-expense-dialog";
import { Loading } from "../ui/loading";
import type { RowSelectionState } from "@tanstack/react-table";
import { MoreVertical, FileDown, FileUp, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ImportExpenseDialog, type MappedData } from "./import-expense-dialog";
import { ExportExpenseDialog } from "./export-expense-dialog";

const ExpensesCard: React.FC<{
  team: Team;
  short?: boolean;
  date: string;
}> = ({ team, short = false, date }) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

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

  const handleImportData = async (mappedData: MappedData[]) => {
    // Aqui você implementaria a lógica para salvar os dados importados
    console.log("Dados mapeados para importação:", mappedData);
    // TODO: Implementar a chamada para a API
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Despesas</CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opções de dados</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                <FileDown className="mr-2 h-4 w-4" />
                <span>Exportar dados</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                <span>Importar dados</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Gerar relatório</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddExpenseDialog team={team} />
        </div>
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
            <ExpenseResumeCards
              rowSelection={rowSelection}
              data={filteredData}
            />
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

      <ImportExpenseDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportData}
      />

      <ExportExpenseDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        expenses={filteredData}
        teamName={team.name}
        date={date}
      />
    </Card>
  );
};

export default ExpensesCard;
