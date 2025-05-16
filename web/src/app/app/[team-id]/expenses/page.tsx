"use client";
import React from "react";
import ExpensesCard from "~/components/expense/expenses-card";
import { useUserContext } from "~/hooks/use-user-context";
import ExpensePaymentMethodCard from "~/components/expense-payment-method/expense-payment-method-card";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <ExpensesCard team={selectedTeam} />
      <ExpensePaymentMethodCard team={selectedTeam} />
    </div>
  );
}
