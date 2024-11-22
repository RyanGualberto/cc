"use client";
import React from "react";
import TeamInvitesCard from "~/components/team/team-invites-card";
import TeamMembersCard from "~/components/team/team-members-card";
import { useUserContext } from "~/hooks/use-user-context";

export default function Page() {
  const { selectedTeam } = useUserContext();

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <TeamMembersCard team={selectedTeam} />
      <TeamInvitesCard team={selectedTeam} />
    </div>
  );
}
