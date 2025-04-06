import { TeamMemberRole } from '@prisma/client';

export class UpdateTeamMemberDto {
  role: TeamMemberRole;
}
