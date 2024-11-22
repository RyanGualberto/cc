"use client";
import React from "react";
import ExpenseCategoryCard from "~/components/expense-category/expense-category-card";
import ExpensesCard from "~/components/expense/expenses-card";
import RevenueCategoryCard from "~/components/revenue-category/revenue-category-card";
import RevenuesCard from "~/components/revenue/revenues-card";
import TeamInvitesCard from "~/components/team/team-invites-card";
import TeamMembersCard from "~/components/team/team-members-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4">
        <ExpensesCard short team={selectedTeam} />
        <RevenuesCard short team={selectedTeam} />
      </div>
      <div className="flex gap-4">
        <ExpenseCategoryCard team={selectedTeam} />
        <RevenueCategoryCard team={selectedTeam} />
      </div>
      <div className="flex gap-4">
        <TeamMembersCard team={selectedTeam} />
        <TeamInvitesCard team={selectedTeam} />
      </div>
    </section>
  );
}
