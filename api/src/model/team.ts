import prisma from "../clients/prismaClient";
import { AppError } from "../utils/appError";
import { CreateTeamSchema, UpdateTeamSchema } from "../schemas/team";
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

export interface TeamUpdateInput {
  name?: string;
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

    const teamsWithCurrentRole = teams.map((team) => {
      const currentTeamMember = team.teamMembers.find(
        (member) => member.userId === userId
      );
      return {
        ...team,
        role: currentTeamMember?.role,
      };
    });

    const teamsWithBalanceAndQtTransactions = await Promise.all(
      teamsWithCurrentRole.map(async (team) => {
        const { balance, qtTransactions } =
          await this.calculateTeamBalanceAndQtTransactions(team.id);
        return {
          ...team,
          balance,
          qtTransactions,
        };
      })
    );

    return teamsWithBalanceAndQtTransactions;
  }

  public async findTeam(userId: string, teamId: string) {
    const team = await this.findTeamAndValidatingUser(teamId, userId);
    const currentTeamMember = team.teamMembers.find(
      (member) => member.userId === userId
    );
    return {
      ...team,
      role: currentTeamMember?.role,
    };
  }

  public async listTeamInvites(userId: string, teamId: string) {
    await this.validateTeamMemberRole(teamId, userId);

    const invites = await prisma.teamInvite.findMany({
      where: {
        teamId,
      },
    });

    return invites;
  }

  public async findTeamByInviteCode(inviteId: string, userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const invite = await prisma.teamInvite.findFirst({
      where: {
        id: inviteId,
        email: user.email.toLowerCase(),
      },
      select: {
        team: true,
      },
    });

    if (!invite) {
      throw new AppError("Invite not found or invalid", 404);
    }

    return invite.team;
  }

  public async inviteTeamMembers(data: TeamInviteInput) {
    await this.validateTeamMemberRole(data.teamId, data.userId);
    const invite = await prisma.teamInvite.create({
      data: {
        email: data.email.toLowerCase(),
        teamId: data.teamId,
      },
      include: {
        team: true,
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
        email: userEmail.email.toLowerCase(),
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

    await prisma.teamInvite.delete({
      where: {
        id: inviteId,
      },
    });

    return invite;
  }

  public async removeTeamInvite(
    userId: string,
    teamId: string,
    inviteId: string
  ) {
    await this.validateTeamMemberRole(teamId, userId);

    const invite = await prisma.teamInvite.findFirst({
      where: {
        id: inviteId,
        teamId,
      },
    });

    if (!invite) {
      throw new AppError("Invite not found", 404);
    }

    await prisma.teamInvite.delete({
      where: {
        id: inviteId,
      },
    });

    return;
  }

  public async removeTeamMember(
    userId: string,
    teamMemberId: string,
    teamId: string
  ) {
    await this.validateTeamMemberRole(teamId, userId);

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: teamMemberId,
        teamId,
      },
    });

    if (teamMember?.userId === userId) {
      throw new AppError("You can't remove yourself from the team");
    }

    if (!teamMember) {
      throw new AppError("Team member not found", 404);
    }

    await prisma.teamMember.delete({
      where: {
        id: teamMemberId,
      },
    });

    return;
  }

  public async updateMemberRole(
    userId: string,
    teamMemberId: string,
    teamId: string,
    role: string
  ) {
    await this.validateTeamMemberRole(teamId, userId);

    if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: teamMemberId,
      },
    });

    if (!teamMember) {
      throw new AppError("Team member not found", 404);
    }

    await prisma.teamMember.update({
      where: {
        id: teamMemberId,
      },
      data: {
        role,
      },
    });

    return teamMember;
  }

  public async findTeamAndValidatingUser(teamId: string, userId: string) {
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

  public async updateTeam(
    userId: string,
    teamId: string,
    data: TeamUpdateInput
  ) {
    if (!data.name) {
      throw new AppError("Name is required", 400);
    }

    const team = await this.findTeamAndValidatingUser(teamId, userId);
    await this.validateTeamMemberRole(teamId, userId);

    if (data.name) {
      await prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          name: data.name,
        },
      });
    }

    return team;
  }

  public async deleteTeam(userId: string, teamId: string) {
    await this.validateTeamMemberRole(teamId, userId);

    await prisma.team.delete({
      where: {
        id: teamId,
      },
    });

    return;
  }

  private async calculateTeamBalanceAndQtTransactions(teamId: string) {
    const teamExpensesInCurrentYearAndMonth = await prisma.expense.aggregate({
      where: {
        teamId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
      _sum: {
        amountInCents: true,
      },
      _count: true,
    });

    const teamRevenuesInCurrentYearAndMonth = await prisma.revenue.aggregate({
      where: {
        teamId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
      _sum: {
        amountInCents: true,
      },
      _count: true,
    });

    return {
      balance:
        (teamRevenuesInCurrentYearAndMonth._sum?.amountInCents || 0) -
        (teamExpensesInCurrentYearAndMonth._sum?.amountInCents || 0),
      qtTransactions:
        teamExpensesInCurrentYearAndMonth._count +
        teamRevenuesInCurrentYearAndMonth._count,
    };
  }

  private async validateTeamMemberRole(teamId: string, userId: string) {
    const team = await this.findTeamAndValidatingUser(teamId, userId);
    const currentTeamMember = team.teamMembers.find(
      (member) => member.userId === userId
    );

    if (
      !currentTeamMember ||
      (currentTeamMember.role !== "OWNER" && currentTeamMember.role !== "ADMIN")
    ) {
      throw new AppError(
        "You don't have permission to invite team members",
        403
      );
    }
  }
}

const model = new TeamModel();
export { model as TeamModel };
