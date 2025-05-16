import { type Expense } from "~/types/expense";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FileDown } from "lucide-react";
import { TRANSLATED_STATUSES } from "./add-expense-dialog";

interface ExportExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: Expense[];
  teamName: string;
  date: string;
}

export function ExportExpenseDialog({
  open,
  onOpenChange,
  expenses,
  teamName,
  date,
}: ExportExpenseDialogProps) {
  const handleExport = () => {
    const csvContent = convertToCSV(expenses);
    downloadCSV(csvContent, `despesas-${teamName}-${date}.csv`);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar despesas</DialogTitle>
          <DialogDescription>
            Exportar {expenses.length} despesa{expenses.length !== 1 ? "s" : ""} para CSV
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            O arquivo CSV conterá as seguintes colunas:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            <li>Descrição</li>
            <li>Valor</li>
            <li>Data</li>
            <li>Categoria</li>
            <li>Status</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 