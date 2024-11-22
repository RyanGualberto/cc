"use client";
import React from "react";
import ExpenseCategoryCard from "~/components/expense-category/expense-category-card";
import RevenueCategoryCard from "~/components/revenue-category/revenue-category-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 md:flex-row">
      <RevenueCategoryCard team={selectedTeam} />
      <ExpenseCategoryCard team={selectedTeam} />
    </section>
  );
}
