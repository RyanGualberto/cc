import prisma from "../clients/prismaClient";
import { CreateExpenseCategorySchema } from "../schemas/expense-category";
import { AppError } from "../utils/appError";
import { TeamModel } from "./team";

interface CreateExpenseCategoryInput {
  name: string;
  teamId: string;
  userId: string;
}

interface UpdateExpenseCategoryInput {
  name: string;
  teamId: string;
  userId: string;
}

class ExpenseCategoryModel {
  constructor() {}

  public async listTeamExpenseCategories(teamId: string, userId: string) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);

    return await prisma.expenseCategory.findMany({
      where: {
        teamId,
      },
      include: {
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    });
  }

  public async create(userId: string, data: CreateExpenseCategoryInput) {
    const { error, value } = CreateExpenseCategorySchema.validate(data);
    await TeamModel.findTeamAndValidatingUser(data.teamId, userId);

    if (error) {
      throw new AppError(error.message, 400);
    }

    return await prisma.expenseCategory.create({
      data: value,
    });
  }

  public async update(
    id: string,
    userId: string,
    data: UpdateExpenseCategoryInput
  ) {
    await TeamModel.findTeamAndValidatingUser(data.teamId, userId);

    return await prisma.expenseCategory.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
  }
}

const model = new ExpenseCategoryModel();
export { model as ExpenseCategoryModel };
