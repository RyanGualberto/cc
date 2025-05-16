import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MoveRight, Upload } from "lucide-react";
import Papa from "papaparse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface MappedData {
  title: string;
  amountInCents: number;
  date: string;
  paymentMethod: string;
  category: string;
  status: string;
}
interface ImportExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (mappedData: Array<MappedData>) => void;
}

type ColumnMapping = Record<string, string>;

const REQUIRED_COLUMNS = {
  title: "Título",
  amountInCents: "Valor",
  date: "Data",
};

const SYSTEM_COLUMNS = {
  ...REQUIRED_COLUMNS,
  status: "Status",
  category: "Categoria",
  paymentMethod: "Método de Pagamento",
};

export function ImportExpenseDialog({
  open,
  onOpenChange,
  onImport,
}: ImportExpenseDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "mapping">("upload");
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const requiredColumns = Object.keys(REQUIRED_COLUMNS);
    const mappedColumns = Object.keys(columnMapping);
    const validMappedColumns = mappedColumns.filter(
      (col) => columnMapping[col] !== "none",
    );
    const hasAllColumns = requiredColumns.every((col) =>
      validMappedColumns.includes(col),
    );
    const hasUniqueValues =
      new Set(Object.values(columnMapping).filter((v) => v !== "none")).size ===
      validMappedColumns.length;

    setIsValid(hasAllColumns && hasUniqueValues);

    const newErrors: Record<string, string> = {};
    if (!hasAllColumns) {
      newErrors.columns = "Todas as colunas obrigatórias devem ser mapeadas";
    }
    if (!hasUniqueValues) {
      newErrors.unique =
        "Cada coluna do arquivo deve ser mapeada apenas uma vez";
    }
    setErrors(newErrors);
  }, [columnMapping]);
  const [csvData, setCsvData] = useState<Array<string[]>>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<string[]>(file, {
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const headers = results.data[0]!;
          setFileColumns(headers);
          setCsvData(results.data.slice(1));
          setStep("mapping");
        }
      },
      header: false,
    });
  };

  const handleColumnMap = (systemColumn: string, fileColumn: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [systemColumn]: fileColumn,
    }));
  };
  const handleImport = () => {
    const mappedData = csvData.map((row: string[]) => {
      const mappedRow: Record<string, string> = {};
      Object.entries(columnMapping).forEach(([systemCol, fileCol]) => {
        const columnIndex = fileColumns.indexOf(fileCol);
        mappedRow[systemCol] = row[columnIndex] ?? "";
      });
      return mappedRow;
    });

    const formattedData = mappedData.map((row) => ({
      title: row.title ?? "",
      amountInCents: Number(row.amountInCents),
      date: row.date ?? "",
      paymentMethod: row.paymentMethod ?? "",
      category: row.category ?? "",
      status: row.status ?? "",
    }));

    onImport(formattedData);
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setStep("upload");
    setFileColumns([]);
    setColumnMapping({});
    setCsvData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importar despesas</DialogTitle>
          <DialogDescription>
            {step === "upload"
              ? "Faça upload de um arquivo CSV com suas despesas."
              : "Mapeie as colunas do seu arquivo com os campos do sistema."}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Arquivo</Label>
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileUpload}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // Implementar download do modelo
                }}
              >
                Baixar modelo de importação
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {Object.entries(SYSTEM_COLUMNS).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-2"
              >
                <Label>{label}</Label>
                <div className="flex items-center gap-4">
                  <MoveRight className="h-4 w-4" />
                  <Select
                    value={columnMapping[key]}
                    onValueChange={(value) => handleColumnMap(key, value)}
                  >
                    <SelectTrigger className="w-52">
                      <SelectValue placeholder="Selecione uma coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não mapear</SelectItem>
                      {fileColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.columns && (
          <div className="text-sm text-red-500">{errors.columns}</div>
        )}
        {errors.unique && (
          <div className="text-sm text-red-500">{errors.unique}</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {step === "upload" ? (
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Selecionar arquivo
            </Button>
          ) : (
            <Button disabled={!isValid} onClick={handleImport}>
              Importar dados
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
