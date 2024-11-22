import React from "react";
import { type Revenue } from "~/types/revenue";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import maskAmount from "~/helpers/maskAmount";

const RevenueResumeCards: React.FC<{
  data: Array<Revenue>;
}> = ({ data }) => {
  const organizedData = data.reduce(
    (acc, revenue) => {
      if (revenue.status === "pending") {
        acc.pending += revenue.amountInCents;
      } else if (revenue.status === "paid") {
        acc.paid += revenue.amountInCents;
      } else if (revenue.status === "overdue") {
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
    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4">
      <Card className="w-full md:w-48 bg-blue-400 text-white dark:bg-blue-950">
        <CardHeader className="pb-0 md:pb-0">
          <CardTitle className="text-base md:text-2xl">
            R$ {maskAmount(String(organizedData.total))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 md:pt-0 text-sm md:text-base">Total</CardFooter>
      </Card>
      <Card className="w-full md:w-48 bg-yellow-400 text-white dark:bg-yellow-900">
        <CardHeader className="pb-0 md:pb-0">
          <CardTitle className="text-base md:text-2xl">
            R$ {maskAmount(String(organizedData.pending))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 md:pt-0 text-sm md:text-base">Pendente</CardFooter>
      </Card>
      <Card className="w-full md:w-48 bg-green-400 text-white dark:bg-green-900">
        <CardHeader className="pb-0 md:pb-0">
          <CardTitle className="text-base md:text-2xl">
            R$ {maskAmount(String(organizedData.paid))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 md:pt-0 text-sm md:text-base">Recebidos</CardFooter>
      </Card>
      <Card className="w-full md:w-48 bg-red-400 text-white dark:bg-red-900">
        <CardHeader className="pb-0 md:pb-0">
          <CardTitle className="text-base md:text-2xl">
            R$ {maskAmount(String(organizedData.overdue))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 md:pt-0 text-sm md:text-base">Atrasados</CardFooter>
      </Card>
    </div>
  );
};

export { RevenueResumeCards };
