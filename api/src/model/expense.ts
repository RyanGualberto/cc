import prisma from "../clients/prismaClient";
import { CreateExpenseSchema, UpdateExpenseSchema } from "../schemas/expense";
import { expenseSerializer } from "../serializers/expense";
import { AppError } from "../utils/appError";
import { TeamModel } from "./team";
import { v4 as uuidv4 } from "uuid";

interface CreateExpenseInput {
  title: string;
  amountInCents: number;
  recurrence: string;
  description: string;
  until?: Date;
  date: Date;
  teamId: string;
  userId: string;
}

interface UpdateExpenseInput {
  title?: string;
  amountInCents?: number;
  recurrence?: string;
  description?: string;
  until?: Date;
  date?: Date;
  teamId: string;
  userId: string;
  includeFuture?: boolean;
}

class ExpenseModel {
  constructor() {}

  public async listTeamExpenses(userId: string, teamId: string) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);

    const expenses = await prisma.expense.findMany({
      where: {
        teamId,
        userId,
      },
      select: expenseSerializer,
    });

    return expenses;
  }

  public async create(data: CreateExpenseInput) {
    const { error, value } = CreateExpenseSchema.validate(data);
    await TeamModel.findTeamAndValidatingUser(data.teamId, data.userId);

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (value.recurrence !== "once" && !value.until) {
      throw new AppError("Until date is required for recurring expenses");
    }

    if (value.recurrence === "once" && value.until) {
      throw new AppError("Until date is not required for one-time expenses");
    }

    if (value.recurrence === "once") {
      const expense = await prisma.expense.create({
        data: value,
        select: expenseSerializer,
      });

      return expense;
    }

    const expenses = await prisma.expense.createMany({
      data: Array.from(
        {
          length: Math.ceil(
            (value.until.getTime() - value.date.getTime()) / 2628000000
          ),
        },
        (_, index) => ({
          ...value,
          date: new Date(value.date.getTime() + index * 2628000000),
          batch: uuidv4(),
        })
      ),
    });

    return expenses;
  }

  public async findExpenseById(
    expenseId: string,
    userId: string,
    teamId: string
  ) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId,
        teamId
      },
      select: expenseSerializer,
    });

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    return expense;
  }

  public async update(id: string, teamId: string, data: UpdateExpenseInput) {
    const { error, value } = UpdateExpenseSchema.validate(data);

    if (error) {
      throw new AppError(error.message, 400);
    }

    await this.findExpenseById(id, data.userId, teamId);

    const { includeFuture, ...payload } = value;
    if (!includeFuture) {
      return await prisma.expense.update({
        where: {
          id,
        },
        data: payload,
        select: expenseSerializer,
      });
    }

    return await prisma.expense.updateMany({
      where: {
        batch: id,
        date: {
          gte: new Date(),
        },
      },
      data: payload,
    });
  }
}

const model = new ExpenseModel();
export { model as ExpenseModel };
