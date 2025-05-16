import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/config/prisma-service';

@Injectable()
export class ExpensesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    await this.validateIfUserIsPartFromTeam(userId, createExpenseDto.teamId);

    const startDate = new Date(createExpenseDto.date);

    if (createExpenseDto.recurrence === 'ONCE') {
      return await this.prismaService.expense.create({
        data: {
          amountInCents: createExpenseDto.amountInCents,
          title: createExpenseDto.title,
          description: createExpenseDto.description,
          status: createExpenseDto.status,
          categoryId: createExpenseDto.categoryId,
          teamId: createExpenseDto.teamId,
          date: startDate,
          recurrence: createExpenseDto.recurrence,
          userId: userId,
          expensePaymentMethodId: createExpenseDto.paymentMethodId,
        },
      });
    }

    const endDate = new Date(createExpenseDto.until);
    const recurrence = createExpenseDto.recurrence;

    const dates: Date[] = [];

    for (
      let current = new Date(startDate);
      current <= endDate;
      current = this.getNextDate(current, recurrence)
    ) {
      dates.push(new Date(current));
    }

    let batchId: string | null = null;

    batchId = randomUUID();

    const expenses = dates.map((date) => ({
      amountInCents: createExpenseDto.amountInCents,
      title: createExpenseDto.title,
      description: createExpenseDto.description,
      status: createExpenseDto.status,
      categoryId: createExpenseDto.categoryId,
      teamId: createExpenseDto.teamId,
      date,
      recurrence,
      userId: userId,
      batch: batchId,
      expensePaymentMethodId: createExpenseDto.paymentMethodId,
    }));

    const createdExpenses = await this.prismaService.expense.createMany({
      data: expenses,
    });

    return createdExpenses;
  }

  async findAll(
    userId: string,
    teamId: string,
    date: string, // "mes/ano"
  ) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);
    // se o mes for < 10, adicionar o zero a esquerda
    if (date.split('/')[0].length < 2) {
      date = `0${date}`;
    }
    const month = date.split('/')[0];
    const year = date.split('/')[1];
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

    return expenses;
  }

  async update({
    userId,
    teamId,
    expenseId,
    updateExpenseDto,
  }: {
    userId: string;
    teamId: string;
    expenseId: string;
    updateExpenseDto: UpdateExpenseDto;
  }) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    const updatedExpense = await this.prismaService.expense.update({
      where: {
        teamId: teamId,
        id: expenseId,
      },
      data: {
        amountInCents: updateExpenseDto.amountInCents,
        title: updateExpenseDto.title,
        description: updateExpenseDto.description,
        status: updateExpenseDto.status,
        categoryId: updateExpenseDto.categoryId,
        date: updateExpenseDto.date,
        expensePaymentMethodId: updateExpenseDto.paymentMethodId,
      },
    });

    if (updateExpenseDto.includeFuture) {
      const batchId = updatedExpense.batch;
      return await this.prismaService.expense.updateMany({
        where: {
          batch: batchId,
          NOT: {
            id: expenseId,
          },
        },
        data: {
          amountInCents: updateExpenseDto.amountInCents,
          title: updateExpenseDto.title,
          description: updateExpenseDto.description,
          status: updateExpenseDto.status,
          categoryId: updateExpenseDto.categoryId,
          expensePaymentMethodId: updateExpenseDto.paymentMethodId,
        },
      });
    }

    return updatedExpense;
  }

  async remove(userId: string, teamId: string, expenseId: string) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    const deletedExpense = await this.prismaService.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return deletedExpense;
  }

  async removeByBatchId(userId: string, teamId: string, batchId: string) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    const deletedExpense = await this.prismaService.expense.deleteMany({
      where: {
        batch: batchId,
      },
    });

    return deletedExpense;
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

  private getNextDate(date: Date, recurrence: string): Date {
    const next = new Date(date);
    switch (recurrence) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        next.setDate(next.getDate() + 1);
        break;
    }
    return next;
  }
}
