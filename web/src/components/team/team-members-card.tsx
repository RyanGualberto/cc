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

const TeamMembersCard: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Participantes do time</CardTitle>
        <AddTeamMemberDialog team={team} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="text-center">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.teamMembers.map((member) => (
              <TableRow key={member.userId}>
                <TableCell>
                  {member.user.first_name} {member.user.last_name}
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
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
                  <Button
                    variant="destructive"
                    disabled={team.role === "MEMBER" || member.role === "OWNER"}
                  >
                    <Trash2 size={16} />
                  </Button>
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
