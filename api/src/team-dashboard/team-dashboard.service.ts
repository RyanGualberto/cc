import { Injectable } from '@nestjs/common';
import { Expense, Revenue } from '@prisma/client';
import { PrismaService } from 'src/config/prisma-service';

@Injectable()
export class TeamDashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTimeline(userId: string, teamId: string, date: string) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);
    const month = date.split('/')[0].padStart(2, '0');
    const year = date.split('/')[1].padStart(4, '0');
    const startDate = new Date(`${year}-${month}`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const expenses = await this.prismaService.expense.findMany({
      where: {
        teamId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        category: true,
        paymentMethod: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const revenues = await this.prismaService.revenue.findMany({
      where: {
        teamId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        category: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const revenuesGroupedByDate = revenues.reduce<
      Array<{
        date: string;
        revenues: Revenue[];
      }>
    >((acc, revenue) => {
      const dateKey = revenue.date.toISOString().split('T')[0];
      const existingDateGroup = acc.find((group) => group.date === dateKey);
      if (!existingDateGroup) {
        acc.push({
          date: dateKey,

          revenues: [revenue],
        });
      } else {
        existingDateGroup.revenues.push(revenue);
      }
      return acc;
    }, []);
    const expensesGroupedByDate = expenses.reduce<
      Array<{
        date: string;
        expenses: Expense[];
      }>
    >((acc, expense) => {
      const dateKey = expense.date.toISOString().split('T')[0];
      const existingDateGroup = acc.find((group) => group.date === dateKey);
      if (!existingDateGroup) {
        acc.push({
          date: dateKey,

          expenses: [expense],
        });
      } else {
        existingDateGroup.expenses.push(expense);
      }
      return acc;
    }, []);
    return {
      expenses: expensesGroupedByDate,
      revenues: revenuesGroupedByDate,
    };
  }

  private async validateIfUserIsPartFromTeam(userId: string, teamId: string) {
    const user = await this.prismaService.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (!user) {
      throw new Error('User is not part of the team');
    }

    return user;
  }
}
