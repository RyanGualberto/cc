import React from "react";
import { type Revenue } from "~/types/revenue";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import maskAmount from "~/helpers/maskAmount";
import { type RowSelectionState } from "@tanstack/react-table";

const RevenueResumeCards: React.FC<{
  data: Array<Revenue>;
  rowSelection: RowSelectionState;
}> = ({ data, rowSelection }) => {
  const selected = data.filter((revenue) => rowSelection[revenue.id]);
  const filteredData = selected.length > 0 ? selected : data;
  const organizedData = filteredData.reduce(
    (acc, revenue) => {
      if (revenue.status === "PENDING") {
        acc.pending += revenue.amountInCents;
      } else if (revenue.status === "RECEIVED") {
        acc.paid += revenue.amountInCents;
      } else if (revenue.status === "OVERDUE") {
        acc.overdue += revenue.amountInCents;
      }
      acc.total += revenue.amountInCents;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      paid: 0,
      overdue: 0,
    },
  );

  return (
    <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap">
      <Card className="w-full bg-blue-400 text-white dark:bg-blue-950 md:w-48">
        <CardHeader className="pb-0 md:p-4 md:pb-0">
          <CardTitle className="text-base md:text-xl">
            R$ {maskAmount(String(organizedData.total))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 text-sm md:p-4 md:pt-0 md:text-base">
          Total
        </CardFooter>
      </Card>
      <Card className="w-full bg-yellow-400 text-white dark:bg-yellow-900 md:w-48">
        <CardHeader className="pb-0 md:p-4 md:pb-0">
          <CardTitle className="text-base md:text-xl">
            R$ {maskAmount(String(organizedData.pending))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 text-sm md:p-4 md:pt-0 md:text-base">
          Pendente
        </CardFooter>
      </Card>
      <Card className="w-full bg-green-400 text-white dark:bg-green-900 md:w-48">
        <CardHeader className="pb-0 md:p-4 md:pb-0">
          <CardTitle className="text-base md:text-xl">
            R$ {maskAmount(String(organizedData.paid))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 text-sm md:p-4 md:pt-0 md:text-base">
          Pagos
        </CardFooter>
      </Card>
      <Card className="w-full bg-red-400 text-white dark:bg-red-900 md:w-48">
        <CardHeader className="pb-0 md:p-4 md:pb-0">
          <CardTitle className="text-base md:text-xl">
            R$ {maskAmount(String(organizedData.overdue))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 text-sm md:p-4 md:pt-0 md:text-base">
          Atrasados
        </CardFooter>
      </Card>
    </div>
  );
};

export { RevenueResumeCards };
