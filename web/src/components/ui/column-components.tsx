import { type Column } from "@tanstack/react-table";
import { Button } from "./button";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Checkbox } from "./checkbox";
import { ScrollArea } from "./scroll-area";
import { useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import { Input } from "./input";

interface ColumnFilterProps<TData> {
  column: Column<TData>;
}

export function ColumnOptions<TData>({ column }: ColumnFilterProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={column.getIsFiltered() ? "bg-muted" : ""}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-52 flex-col p-2">
        <div
          onClick={() => {
            if (column.getIsSorted() === "asc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          }}
          className={cn(
            "flex cursor-pointer items-center gap-2 border-b p-2 text-sm",
            {
              "bg-muted": column.getIsSorted() === "asc",
            },
          )}
        >
          <ArrowUp className="h-4 w-4" />
          Ordenar ascendente
        </div>
        <div
          onClick={() => {
            if (column.getIsSorted() === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          }}
          className={cn(
            "flex cursor-pointer items-center gap-2 border-b p-2 text-sm",
            {
              "bg-muted": column.getIsSorted() === "desc",
            },
          )}
        >
          <ArrowDown className="h-4 w-4" />
          Ordenar descendente
        </div>
        <ColumnFilter column={column} />
      </PopoverContent>
    </Popover>
  );
}

export function ColumnFilter<TData>({ column }: ColumnFilterProps<TData>) {
  const [search, setSearch] = useState("");
  const uniqueValues = useMemo(() => {
    const values = new Set<string>();
    column.getFacetedUniqueValues().forEach((count, value) => {
      if (value === null || value === undefined) {
        values.add("N/A");
      } else if (typeof value === "object") {
        // Para objetos complexos, como category que tem name
        values.add((value as { name: string })?.name ?? "N/A");
      } else {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  }, [column]);

  const selectedValues = new Set(column.getFilterValue() as string[]);

  if (uniqueValues.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="text-sm">Filtrar por</div>
      <div>
        <input
          className="h-8 max-w-full rounded-md border-none px-2 text-sm focus:outline-none"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="h-52">
        {uniqueValues
          .filter((value) => value.toLowerCase().includes(search.toLowerCase()))
          .map((value) => (
            <div key={value} className="flex items-center space-x-2 p-1">
              <Checkbox
                checked={selectedValues.has(value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    column.setFilterValue(
                      selectedValues.size
                        ? [...selectedValues, value]
                        : [value],
                    );
                  } else {
                    const newValues = Array.from(selectedValues).filter(
                      (v) => v !== value,
                    );
                    column.setFilterValue(
                      newValues.length ? newValues : undefined,
                    );
                  }
                }}
              />
              <span className="text-sm">{value}</span>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}
