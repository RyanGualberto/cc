import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/config/prisma-service';
import { ExpenseStatus } from '@prisma/client';

export interface MappedData {
  title: string;
  amountInCents: number;
  date: string;
  paymentMethod: string;
  category: string;
  status: string;
}

@Injectable()
export class ExpensesService {
  constructor(private readonly prismaService: PrismaService) {}

  async import(userId: string, teamId: string, mappedData: MappedData[]) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);
    // procura se tem categorias com o nome das categorias do mappedData, se não tem, cria elas.
    // substitui a category, por categoryId
    const categories = await this.prismaService.expenseCategory.findMany({
      where: {
        name: {
          in: mappedData.map((data) => data.category),
        },
      },
    });

    const categoriesToCreate = mappedData.filter(
      (data) => !categories.some((category) => category.name === data.category),
    );

    await this.prismaService.expenseCategory.createMany({
      data: categoriesToCreate
        .filter((data) => data.category)
        .map((data) => ({
          name: data.category,
          teamId,
        })),
    });

    const allCategories = await this.prismaService.expenseCategory.findMany({
      where: {
        name: {
          in: mappedData.map((data) => data.category),
        },
      },
    });

    const categoriesMap = allCategories.reduce<Record<string, string>>(
      (acc, category) => {
        acc[category.name] = category.id;
        return acc;
      },
      {},
    );

    const paymentMethods =
      await this.prismaService.expensePaymentMethod.findMany({
        where: {
          name: {
            in: mappedData.map((data) => data.paymentMethod),
          },
        },
      });

    const paymentMethodsMap = paymentMethods.reduce<Record<string, string>>(
      (acc, paymentMethod) => {
        acc[paymentMethod.name] = paymentMethod.id;
        return acc;
      },
      {},
    );

    const paymentMethodsToCreate = mappedData.filter(
      (data) =>
        !paymentMethods.some(
          (paymentMethod) => paymentMethod.name === data.paymentMethod,
        ),
    );

    await this.prismaService.expensePaymentMethod.createMany({
      data: paymentMethodsToCreate
        .filter((data) => data.paymentMethod)
        .map((data) => ({
          name: data.paymentMethod,
          teamId,
        })),
    });

    const expenses = mappedData.map((data) => ({
      ...data,
      categoryId: categoriesMap[data.category],
      expensePaymentMethodId: paymentMethodsMap[data.paymentMethod],
    }));

    const setStatus = (status: string) => {
      if (status === 'PENDING') {
        return ExpenseStatus.PENDING;
      } else if (status === 'PAID') {
        return ExpenseStatus.PAID;
      } else if (status === 'OVERDUE') {
        return ExpenseStatus.OVERDUE;
      }

      return ExpenseStatus.PENDING;
    };

    const createdExpenses = await this.prismaService.expense.createMany({
      data: expenses.map((expense) => ({
        amountInCents: expense.amountInCents,
        title: expense.title,
        status: setStatus(expense.status),
        categoryId: expense.categoryId,
        teamId: teamId,
        date: expense.date,
        recurrence: 'ONCE',
        userId: userId,
        expensePaymentMethodId: expense.expensePaymentMethodId,
      })),
    });

    return createdExpenses;
  }
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

  async findAll(userId: string, teamId: string, date: string) {
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

    if (
      updateExpenseDto.editSelection &&
      updateExpenseDto.editSelection !== 'just-this'
    ) {
      const batchId = updatedExpense.batch;
      let startDate: Date | undefined;
      if (updateExpenseDto.editSelection === 'include-future') {
        startDate = new Date(updatedExpense.date);
      }

      return await this.prismaService.expense.updateMany({
        where: {
          batch: batchId,
          NOT: {
            id: expenseId,
          },
          ...(startDate && {
            date: {
              gte: startDate,
            },
          }),
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
