"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Team } from "~/types/team";
import { Button } from "../ui/button";
import Show from "../utils/show";
import { ExpensesTable } from "./expenses-table";
import { ExpenseResumeCards } from "./expense-resume-cards";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseRequest } from "~/requests/expense";
import Link from "next/link";
import { AddExpenseDialog, TRANSLATED_STATUSES } from "./add-expense-dialog";
import { Loading } from "../ui/loading";
import type { RowSelectionState } from "@tanstack/react-table";
import type { Expense } from "~/types/expense";
import { Upload, MoreVertical, FileDown, FileUp, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ExpensesCard: React.FC<{
  team: Team;
  short?: boolean;
  date: string;
}> = ({ team, short = false, date }) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
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
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredData(expenses ?? []);
  }, [expenses]);

  useEffect(() => {
    void queryClient.invalidateQueries({
      queryKey: ["expenses", { teamId: team.id }],
    });
  }, [date, team.id, queryClient]);

  const handleExportData = () => {
    // Aqui você implementaria a lógica de exportação
    // Por exemplo, converter os dados para CSV e fazer o download

    const selectedData =
      Object.keys(rowSelection).length > 0
        ? filteredData.filter((_, index) => rowSelection[index])
        : filteredData;

    const csvContent = convertToCSV(selectedData);
    downloadCSV(csvContent, `despesas-${team.name}-${date}.csv`);
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você implementaria a lógica para processar o arquivo
      console.log("Arquivo selecionado:", file.name);
      // Resetar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImportDialogOpen(false);
    }
  };

  // Função auxiliar para converter dados para CSV
  const convertToCSV = (data: Expense[]) => {
    const headers = ["Descrição", "Valor", "Data", "Categoria", "Status"];
    const rows = data.map((expense) => [
      expense.description,
      expense.amountInCents?.toString() ?? "0",
      new Date(expense.date).toLocaleDateString(),
      expense.category?.name ?? "Sem categoria",
      TRANSLATED_STATUSES[expense.status],
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  // Função auxiliar para fazer download do CSV
  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <DropdownMenuItem onClick={handleExportData}>
                <FileDown className="mr-2 h-4 w-4" />
                <span>Exportar dados</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
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

      {/* Diálogo de importação */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar despesas</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo CSV ou Excel com suas despesas.
              <a
                href="#"
                className="mt-1 block text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // Aqui você poderia fornecer um modelo para download
                  alert("Download do modelo de importação");
                }}
              >
                Baixar modelo de importação
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Arquivo</Label>
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Selecionar arquivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExpensesCard;
