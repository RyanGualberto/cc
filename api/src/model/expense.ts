import prisma from "../clients/prismaClient";
import { CreateExpenseSchema } from "../schemas/expense";
import { expenseSerializer } from "../serializers/expense";
import { AppError } from "../utils/appError";

interface CreateExpenseInput {
  title: string;
  amountInCents: number;
  recurrence: string;
  description: string;
  date: Date;
  teamId: string;
  userId: string;
}

export class ExpenseModel {
  constructor() {}

  public async create(data: CreateExpenseInput) {
    const { error, value } = CreateExpenseSchema.validate(data);

    if (error) {
      throw new AppError(error.message, 400);
    }

    const expense = await prisma.expense.create({
      data: value,
      select: expenseSerializer,
    });

    return expense;
  }
}
