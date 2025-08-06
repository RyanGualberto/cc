import { Injectable } from '@nestjs/common';
import { ExpenseStatus } from '@prisma/client';
import { PrismaService } from '../config/prisma-service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}
  async processOverdueExpenses() {
    const overdueExpenses = await this.prismaService.expense.findMany({
      where: {
        date: {
          lt: new Date(),
        },
        status: ExpenseStatus.PENDING,
      },
      include: {
        team: {
          include: {
            teamMembers: {
              include: {
                user: {
                  select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (overdueExpenses.length === 0) {
      console.log('No overdue expenses found');
      return;
    }

    await this.prismaService.expense.updateMany({
      where: {
        id: { in: overdueExpenses.map((expense) => expense.id) },
      },
      data: { status: ExpenseStatus.OVERDUE },
    });

    await this.mailService.sendOverdueNotifications(overdueExpenses);
  }

  async notifyExpensesCloseToDue() {
    const closeToDueExpenses = await this.prismaService.expense.findMany({
      where: {
        date: {
          gte: new Date(),
          lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
        status: ExpenseStatus.PENDING,
      },
      include: {
        team: {
          include: {
            teamMembers: {
              include: {
                user: {
                  select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (closeToDueExpenses.length > 0) {
      await this.mailService.sendExpenseCloseToDueNotifications(
        closeToDueExpenses,
      );
    }
  }
}
