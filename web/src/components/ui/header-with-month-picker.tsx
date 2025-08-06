import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { MonthAndYearPicker } from "./month-and-year-picker";
import { useCallback } from "react";

const HeaderWithMonthPicker: React.FC<{
  onChange: (date: string) => void;
  value: string; // MM/YYYY
}> = ({ onChange, value }) => {
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
    <div className="flex sticky backdrop-blur-sm bg-background/90 z-50 top-0 md:static items-center justify-between gap-4">
      <Button onClick={() => onChange(previousDate(value))} variant="ghost">
        <ChevronLeft size={16} />
      </Button>
      <MonthAndYearPicker value={value} onChange={onChange} />
      <Button variant="ghost" onClick={() => onChange(nextDate(value))}>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export { HeaderWithMonthPicker };
