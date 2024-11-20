"use client";
import React from "react";
import ExpensesCard from "~/components/expense/expenses-card";
import TeamMembersCard from "~/components/team/team-members-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-4">
        <ExpensesCard short team={selectedTeam} />
        <ExpensesCard short team={selectedTeam} />
      </div>
      <TeamMembersCard team={selectedTeam} />
    </section>
  );
}
