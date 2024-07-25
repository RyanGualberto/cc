import prisma from "../clients/prismaClient";
import { AppError } from "../utils/appError";
import { CreateTeamSchema } from "../schemas/team";
import { teamSerializer } from "../serializers/team";

export interface TeamCreateInput {
  name: string;
  userId: string;
}

export interface TeamInviteInput {
  email: string;
  teamId: string;
  userId: string;
}

class TeamModel {
  constructor() {}

  public async create(data: TeamCreateInput) {
    CreateTeamSchema.validate(data);

    const team = await prisma.team.create({
      data: {
        name: data.name,
        teamMembers: {
          create: {
            userId: data.userId,
            role: "OWNER",
          },
        },
      },
      select: teamSerializer,
    });

    return team;
  }

  public async findUserTeams(userId: string) {
    const teams = await prisma.team.findMany({
      where: {
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      select: teamSerializer,
    });

    return teams;
  }

  public async findTeam(userId: string, teamId: string) {
    const team = await this.findTeamAndValidatingUser(teamId, userId);
    return team;
  }

  public async inviteTeamMembers(data: TeamInviteInput) {
    await this.findTeamAndValidatingUser(data.teamId, data.userId);
    const invite = await prisma.teamInvite.create({
      data: {
        email: data.email,
        teamId: data.teamId,
      },
    });

    return invite;
  }

  public async acceptInvite(userId: string, inviteId: string) {
    const userEmail = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    if (!userEmail) {
      throw new AppError("User not found", 404);
    }

    const invite = await prisma.teamInvite.findFirst({
      where: {
        id: inviteId,
        email: userEmail.email,
      },
    });

    if (!invite) {
      throw new AppError("Team invite not found", 404);
    }

    await prisma.teamMember.create({
      data: {
        userId,
        teamId: invite.teamId,
        role: "MEMBER",
      },
    });

    return invite;
  }

  public async removeTeamMember(userId: string, teamMemberId: string) {
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: teamMemberId,
      },
    });

    if (!teamMember) {
      throw new AppError("Team member not found", 404);
    }

    if (teamMember.userId === userId) {
      throw new AppError("You can't remove yourself from the team", 400);
    }

    const myTeamRole = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId: teamMember.teamId,
      },
      select: {
        role: true,
      },
    });

    if (myTeamRole?.role !== "OWNER" && myTeamRole?.role !== "ADMIN") {
      throw new AppError(
        "You don't have permission to remove team member",
        403
      );
    }

    await prisma.teamMember.delete({
      where: {
        id: teamMemberId,
      },
    });

    return;
  }

  private async findTeamAndValidatingUser(teamId: string, userId: string) {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      select: teamSerializer,
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return team;
  }
}

const model = new TeamModel();
export { model as TeamModel };
