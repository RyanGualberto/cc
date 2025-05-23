"use client";
import React, { useState } from "react";
import ExpensesCard from "~/components/expense/expenses-card";
import { useUserContext } from "~/hooks/use-user-context";
import ExpensePaymentMethodCard from "~/components/expense-payment-method/expense-payment-method-card";
import { HeaderWithMonthPicker } from "~/components/ui/header-with-month-picker";

export default function Page() {
  const { selectedTeam } = useUserContext();
  const [date, setDate] = useState(
    new Date().toLocaleDateString("pt-BR", {
      month: "2-digit",
      year: "numeric",
    }),
  );

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <HeaderWithMonthPicker value={date} onChange={setDate} />
      <ExpensesCard date={date} team={selectedTeam} />
      <ExpensePaymentMethodCard team={selectedTeam} />
    </div>
  );
}
