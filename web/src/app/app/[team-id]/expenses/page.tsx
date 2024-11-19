"use client";
import React from "react";
import ExpensesCard from "~/components/expense/expenses-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return <ExpensesCard team={selectedTeam} />;
}
