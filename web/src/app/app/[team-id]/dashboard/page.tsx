"use client";
import ExpenseCategoryCard from "~/components/expense-category/expense-category-card";
import ExpensesCard from "~/components/expense/expenses-card";
import RevenueCategoryCard from "~/components/revenue-category/revenue-category-card";
import RevenuesCard from "~/components/revenue/revenues-card";
import TeamInvitesCard from "~/components/team/team-invites-card";
import TeamMembersCard from "~/components/team/team-members-card";
import FinancialChartsCard from "~/components/dashboard/financial-charts";
import { useUserContext } from "~/hooks/use-user-context";
import { useState } from "react";
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
    <section className="flex flex-col gap-4">
      <HeaderWithMonthPicker value={date} onChange={setDate} />
      <FinancialChartsCard date={date} team={selectedTeam} />

      <div className="flex flex-col gap-4 md:flex-row">
        <RevenuesCard short date={date} team={selectedTeam} />
        <ExpensesCard short date={date} team={selectedTeam} />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <RevenueCategoryCard team={selectedTeam} />
        <ExpenseCategoryCard team={selectedTeam} />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <TeamMembersCard team={selectedTeam} />
        <TeamInvitesCard team={selectedTeam} />
      </div>
    </section>
  );
}
