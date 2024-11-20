import React, { useCallback, useMemo } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const MonthAndYearPicker: React.FC<{
  value: string; // MM/YYYY
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const monthContainerRef = React.useRef<HTMLDivElement>(null);
  const yearContainerRef = React.useRef<HTMLDivElement>(null);
  const monthAndYear = useMemo(() => {
    const [month, year] = value.split("/");
    return { month, year };
  }, [value]);

  const changeMonth = useCallback(
    (month: number) => {
      onChange(`${String(month).padStart(2, "0")}/${monthAndYear.year}`);
    },
    [monthAndYear.year, onChange],
  );

  const changeYear = useCallback(
    (year: number) => {
      onChange(`${monthAndYear.month}/${year}`);
    },
    [monthAndYear.month, onChange],
  );

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (isOpen) {
          monthContainerRef.current?.scrollTo({
            top: Number(monthAndYear.month) * 52,
            behavior: "smooth",
          });
          yearContainerRef.current?.scrollTo({
            top: Number(monthAndYear.year) * 52,
            behavior: "smooth",
          });
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" className="capitalize">
          {new Intl.DateTimeFormat("pt-BR", {
            month: "long",
            year: "numeric",
          }).format(new Date(`${monthAndYear.month}/` + value))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit gap-4 pb-0 pt-3">
        <div
          ref={monthContainerRef}
          className="scrollbar-hide flex max-h-24 flex-col gap-1 overflow-y-scroll"
        >
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date();
            date.setMonth(index);
            return (
              <Button
                variant={
                  date.getMonth() + 1 === Number(monthAndYear.month)
                    ? "secondary"
                    : "ghost"
                }
                key={index}
                onClick={() => changeMonth(date.getMonth() + 1)}
              >
                {new Intl.DateTimeFormat("pt-BR", {
                  month: "long",
                }).format(date)}
              </Button>
            );
          })}
        </div>
        <div
          ref={yearContainerRef}
          className="scrollbar-hide flex max-h-24 flex-col gap-1 overflow-y-scroll"
        >
          {Array.from({ length: 10 }).map((_, index) => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + index);
            return (
              <Button
                variant={
                  date.getFullYear() === Number(monthAndYear.year)
                    ? "secondary"
                    : "ghost"
                }
                key={index}
                onClick={() => changeYear(date.getFullYear())}
              >
                {date.getFullYear()}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { MonthAndYearPicker };
