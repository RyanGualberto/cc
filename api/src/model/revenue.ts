import QueryString from "qs";
import prisma from "../clients/prismaClient";
import { CreateRevenueSchema, UpdateRevenueSchema } from "../schemas/revenue";
import { revenueSerializer } from "../serializers/revenue";
import { AppError } from "../utils/appError";
import { TeamModel } from "./team";
import { v4 as uuidv4 } from "uuid";

interface CreateRevenueInput {
  title: string;
  amountInCents: number;
  recurrence: string;
  description: string;
  until?: Date;
  date: Date;
  teamId: string;
  userId: string;
}

interface UpdateRevenueInput {
  title?: string;
  amountInCents?: number;
  recurrence?: string;
  description?: string;
  until?: Date;
  status: "pending" | "paid" | "overdue";
  date?: Date;
  teamId: string;
  userId: string;
  includeFuture?: boolean;
}

class RevenueModel {
  constructor() {}

  public async listTeamRevenues(
    userId: string,
    teamId: string,
    query: QueryString.ParsedQs
  ) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);
    const {
      date, // MM/YYYY
    } = query;

    const [month, year] = String(date).split("/");
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + 1)
    );

    const revenues = await prisma.revenue.findMany({
      where: {
        AND: [
          {
            teamId,
            userId,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      select: revenueSerializer,
    });

    return revenues;
  }

  public async create(data: CreateRevenueInput) {
    const { error, value } = CreateRevenueSchema.validate(data);
    await TeamModel.findTeamAndValidatingUser(data.teamId, data.userId);

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (value.recurrence !== "once" && !value.until) {
      throw new AppError("Until date is required for recurring revenues");
    }

    if (value.recurrence === "once" && value.until) {
      throw new AppError("Until date is not required for one-time revenues");
    }

    if (value.recurrence === "once") {
      const revenue = await prisma.revenue.create({
        data: value,
        select: revenueSerializer,
      });

      return revenue;
    }

    const batch = uuidv4();

    const revenues = await prisma.revenue.createMany({
      data: Array.from(
        {
          length: Math.ceil(
            (value.until.getTime() - value.date.getTime()) / 2628000000
          ),
        },
        (_, index) => ({
          ...value,
          date: new Date(value.date.getTime() + index * 2628000000),
          batch: batch,
        })
      ),
    });

    return revenues;
  }

  public async findRevenueById(
    revenueId: string,
    userId: string,
    teamId: string
  ) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);
    const revenue = await prisma.revenue.findFirst({
      where: {
        id: revenueId,
        userId,
        teamId,
      },
      select: revenueSerializer,
    });

    if (!revenue) {
      throw new AppError("Revenue not found", 404);
    }

    return revenue;
  }

  public async update(id: string, teamId: string, data: UpdateRevenueInput) {
    const { error, value } = UpdateRevenueSchema.validate(data);

    if (error) {
      throw new AppError(error.message, 400);
    }

    const { includeFuture, date, ...payload } = value;
    if (!includeFuture) {
      await this.findRevenueById(id, data.userId, teamId);
      return await prisma.revenue.update({
        where: {
          id,
        },
        data: {
          ...payload,
          date: date,
        },
        select: revenueSerializer,
      });
    }

    await TeamModel.findTeamAndValidatingUser(teamId, data.userId);

    return await prisma.revenue.updateMany({
      where: {
        batch: id,
      },
      data: payload,
    });
  }

  public async delete(id: string, userId: string, teamId: string) {
    await this.findRevenueById(id, userId, teamId);

    return await prisma.revenue.delete({
      where: {
        id,
      },
    });
  }

  public async deleteByBatch(id: string, userId: string, teamId: string) {
    await TeamModel.findTeamAndValidatingUser(teamId, userId);

    const revenues = await prisma.revenue.findMany({
      where: {
        batch: id,
      },
    });

    if (!revenues.length) {
      throw new AppError("Batch not found", 404);
    }

    return await prisma.revenue.deleteMany({
      where: {
        batch: id,
      },
    });
  }
}

const model = new RevenueModel();
export { model as RevenueModel };
