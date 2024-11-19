import React from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const MonthAndYearPicker: React.FC<{
  value: string; // MM/YYYY
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const monthContainerRef = React.useRef<HTMLDivElement>(null);
  const yearContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (isOpen) {
          monthContainerRef.current?.scrollTo({
            top: Number(value.split("/")[0]) * 52,
            behavior: "smooth",
          });
          yearContainerRef.current?.scrollTo({
            top: 0,
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
          }).format(new Date(`${value.split("/")[0]}/` + value))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit gap-4 pb-0 pt-3">
        <div
          ref={monthContainerRef}
          className="scrollbar-hide flex max-h-12 flex-col gap-1 overflow-y-scroll"
        >
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date();
            date.setMonth(index);
            return (
              <Button
                variant={
                  date.getMonth() + 1 === Number(value.split("/")[0])
                    ? "secondary"
                    : "ghost"
                }
                key={index}
                onClick={() =>
                  onChange(
                    `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`,
                  )
                }
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
          className="scrollbar-hide flex max-h-12 flex-col gap-1 overflow-y-scroll"
        >
          {Array.from({ length: 10 }).map((_, index) => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + index);
            return (
              <Button
                variant={
                  date.getFullYear() === Number(value.split("/")[1])
                    ? "secondary"
                    : "ghost"
                }
                key={index}
                onClick={() =>
                  onChange(
                    `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`,
                  )
                }
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
