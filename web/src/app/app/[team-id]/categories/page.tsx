"use client";
import React from "react";
import ExpenseCategoryCard from "~/components/expense-category/expense-category-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-4">
        <ExpenseCategoryCard team={selectedTeam} />
        <ExpenseCategoryCard team={selectedTeam} />
      </div>
    </section>
  );
}
