import type React from "react";
import { type Team } from "~/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { teamRequests } from "~/requests/team";
import Show from "../utils/show";
import DeleteTeamInviteDialog from "./delete-team-invite-dialog";

const TeamInvitesCard: React.FC<{ team: Team }> = ({ team }) => {
  const { data: teamInvites } = useQuery({
    queryKey: ["team", team.id, "invites"],
    queryFn: async () => {
      if (!team) {
        return [];
      }
      return await teamRequests.listTeamInvites(team.id);
    },
  });

  if (!teamInvites) {
    return null;
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center gap-4 md:flex-row">
        <CardTitle className="w-full">Convites para o time</CardTitle>
      </CardHeader>
      <Show
        when={teamInvites.length > 0}
        component={
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Convidado em</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamInvites.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {new Date(member.createdAt).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-center">
                      <DeleteTeamInviteDialog
                        team={team}
                        invite={member}
                        trigger={
                          <Button
                            variant="destructive"
                            disabled={team.role === "MEMBER"}
                          >
                            <Trash2 size={16} />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        }
        fallback={
          <CardContent className="flex h-full flex-1 flex-col items-center justify-center">
            <p className="text-center opacity-60">Sem convites pendentes</p>
          </CardContent>
        }
      />
    </Card>
  );
};

export default TeamInvitesCard;
