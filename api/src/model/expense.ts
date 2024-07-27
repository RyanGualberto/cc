import prisma from "../clients/prismaClient";
import { CreateExpenseSchema } from "../schemas/expense";
import { expenseSerializer } from "../serializers/expense";
import { AppError } from "../utils/appError";
import { TeamModel } from "./team";

interface CreateExpenseInput {
  title: string;
  amountInCents: number;
  recurrence: string;
  description: string;
  date: Date;
  teamId: string;
  userId: string;
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

    const expense = await prisma.expense.create({
      data: value,
      select: expenseSerializer,
    });

    return expense;
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
      },
      select: expenseSerializer,
    });

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    return expense;
  }
}

const model = new ExpenseModel();
export { model as ExpenseModel };
