import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/config/prisma-service';

@Injectable()
export class TeamsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTeamDto: CreateTeamDto & { userId: string }) {
    return await this.prismaService.team.create({
      data: {
        name: createTeamDto.name,
        teamMembers: {
          create: {
            userId: createTeamDto.userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    const teamWithTeamMembers = await this.prismaService.team.findMany({
      where: {
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      include: {
        teamMembers: true,
      },
    });

    const currentMonth = new Date().getMonth() + 1;
    const transactionsTotal = await Promise.all(
      teamWithTeamMembers.map(async (team) => {
        const expenses = await this.prismaService.expense.aggregate({
          where: {
            teamId: team.id,
            date: {
              gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
              lt: new Date(new Date().getFullYear(), currentMonth, 1),
            },
          },
          _sum: {
            amountInCents: true,
          },
        });
        const revenues = await this.prismaService.revenue.aggregate({
          where: {
            teamId: team.id,
            date: {
              gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
              lt: new Date(new Date().getFullYear(), currentMonth, 1),
            },
          },
          _sum: {
            amountInCents: true,
          },
        });
        const transactionsCount = await this.prismaService.$transaction([
          this.prismaService.expense.count({
            where: {
              teamId: team.id,
              date: {
                gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
                lt: new Date(new Date().getFullYear(), currentMonth, 1),
              },
            },
          }),
          this.prismaService.revenue.count({
            where: {
              teamId: team.id,
              date: {
                gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
                lt: new Date(new Date().getFullYear(), currentMonth, 1),
              },
            },
          }),
        ]);
        return {
          teamId: team.id,
          balance: revenues._sum.amountInCents - expenses._sum.amountInCents,
          qtTransactions: transactionsCount[0] + transactionsCount[1],
        };
      }),
    );

    return teamWithTeamMembers.map((team) => {
      const currentUserRole =
        team.teamMembers.find((member) => member.userId === userId)?.role ||
        null;

      const transaction = transactionsTotal.find(
        (t) => t.teamId === team.id,
      ) || {
        balance: 0,
        qtTransactions: 0,
      };

      return {
        ...team,
        role: currentUserRole,
        balance: transaction.balance,
        qtTransactions: transaction.qtTransactions,
      };
    });
  }

  async findOne(id: string, userId: string) {
    const team = await this.prismaService.team.findFirst({
      where: {
        id,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      include: {
        teamMembers: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return null;
    }

    const currentUserRole =
      team.teamMembers.find((member) => member.userId === userId)?.role || null;

    return {
      ...team,
      role: currentUserRole,
    };
  }

  async update(id: string, userId: string, updateTeamDto: UpdateTeamDto) {
    return await this.prismaService.team.update({
      where: {
        id,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      data: {
        name: updateTeamDto.name,
      },
    });
  }

  async remove(id: string, userId: string) {
    return await this.prismaService.team.delete({
      where: {
        id,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
