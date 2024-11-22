import prisma from "../clients/prismaClient";
import { CreateRevenueCategorySchema } from "../schemas/revenue-category";
import { AppError } from "../utils/appError";
import { TeamModel } from "./team";

interface CreateRevenueCategoryInput {
  name: string;
  teamId: string;
  userId: string;
}

interface UpdateRevenueCategoryInput {
  name: string;
  teamId: string;
  userId: string;
}

class RevenueCategoryModel {
  constructor() {}

  public async listTeamRevenueCategories(teamId: string, userId: string) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);

    return await prisma.revenueCategory.findMany({
      where: {
        teamId,
      },
      include: {
        _count: {
          select: {
            revenues: true,
          },
        },
      },
    });
  }

  public async create(userId: string, data: CreateRevenueCategoryInput) {
    const { error, value } = CreateRevenueCategorySchema.validate(data);
    await TeamModel.findTeamAndValidatingUser(data.teamId, userId);

    if (error) {
      throw new AppError(error.message, 400);
    }

    return await prisma.revenueCategory.create({
      data: value,
    });
  }

  public async update(
    id: string,
    userId: string,
    data: UpdateRevenueCategoryInput
  ) {
    await TeamModel.findTeamAndValidatingUser(data.teamId, userId);

    return await prisma.revenueCategory.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
  }
}

const model = new RevenueCategoryModel();
export { model as RevenueCategoryModel };
