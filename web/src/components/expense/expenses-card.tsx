import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { type Team } from "~/types/team";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MonthAndYearPicker } from "../ui/month-and-year-picker";

const ExpensesCard: React.FC<{
  team: Team;
}> = () => {
  const [date, setDate] = React.useState(
    new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    }),
  );

  const nextDate = useCallback((date: string) => {
    const [month, year] = date.split("/");
    let nextMonth;
    let nextYear = year;

    if (month && parseInt(month) === 12) {
      nextMonth = 1;
      nextYear = String(
        year ? parseInt(year) + 1 : new Date().getFullYear() + 1,
      );
    } else {
      nextMonth = month ? parseInt(month) + 1 : 1;
    }
    return `${nextMonth}/${nextYear}`;
  }, []);

  const previousDate = useCallback((date: string) => {
    const [month, year] = date.split("/");
    let previousMonth;
    let previousYear = year;

    if (month && parseInt(month) === 1) {
      previousMonth = 12;
      previousYear = String(
        year ? parseInt(year) - 1 : new Date().getFullYear() - 1,
      );
    } else {
      previousMonth = month ? parseInt(month) - 1 : 12;
    }
    return `${previousMonth}/${previousYear}`;
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <Button onClick={() => setDate(previousDate(date))} variant="ghost">
            <ChevronLeft size={16} />
          </Button>
          <MonthAndYearPicker
            value={date}
            onChange={(value) => setDate(value)}
          />
          <Button variant="ghost" onClick={() => setDate(nextDate(date))}>
            <ChevronRight size={16} />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead>Recorrência</TableHead>
              <TableHead className="text-center">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpensesCard;
