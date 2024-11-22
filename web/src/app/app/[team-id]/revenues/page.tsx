"use client";
import React from "react";
import RevenuesCard from "~/components/revenue/revenues-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return <RevenuesCard team={selectedTeam} />;
}
