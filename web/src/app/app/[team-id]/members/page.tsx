"use client";
import React from "react";
import TeamMembersCard from "~/components/team/team-members-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <section>
      <TeamMembersCard team={selectedTeam} />
    </section>
  );
}
