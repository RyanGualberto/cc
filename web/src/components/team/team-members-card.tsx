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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import AddTeamMemberDialog from "./add-team-member-dialog";
import Show from "../utils/show";
import DeleteTeamMemberDialog from "./delete-team-member-dialog";

const TeamMembersCard: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Participantes do time</CardTitle>
        <Show
          when={team.role !== "MEMBER"}
          component={<AddTeamMemberDialog team={team} />}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.teamMembers.map((member) => (
              <TableRow key={member.userId}>
                <TableCell className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap">
                  {member.user.firstName} {member.user.lastName}
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell className="min-w-36">
                  <Select defaultValue={member.role}>
                    <SelectTrigger disabled={team.role === "MEMBER"}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem disabled value="OWNER">
                        Dono
                      </SelectItem>
                      <SelectItem
                        disabled={
                          member.role === "ADMIN" || member.role === "OWNER"
                        }
                        value="ADMIN"
                      >
                        Admin
                      </SelectItem>
                      <SelectItem
                        disabled={
                          member.role === "MEMBER" || member.role === "OWNER"
                        }
                        value="MEMBER"
                      >
                        Membro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <DeleteTeamMemberDialog
                    team={team}
                    teamMember={member}
                    trigger={
                      <Button
                        variant="destructive"
                        disabled={
                          team.role === "MEMBER" || member.role === "OWNER"
                        }
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
    </Card>
  );
};

export default TeamMembersCard;
