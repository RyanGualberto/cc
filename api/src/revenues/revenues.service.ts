import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CreateRevenueDto } from './dto/create-revenue.dto';
import { UpdateRevenueDto } from './dto/update-revenue.dto';
import { PrismaService } from 'src/config/prisma-service';

@Injectable()
export class RevenuesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: string, createRevenueDto: CreateRevenueDto) {
    await this.validateIfUserIsPartFromTeam(userId, createRevenueDto.teamId);

    const startDate = new Date(createRevenueDto.date);

    if (createRevenueDto.recurrence === 'ONCE') {
      return await this.prismaService.revenue.create({
        data: {
          amountInCents: createRevenueDto.amountInCents,
          title: createRevenueDto.title,
          description: createRevenueDto.description,
          status: createRevenueDto.status,
          categoryId: createRevenueDto.categoryId,
          teamId: createRevenueDto.teamId,
          date: startDate,
          recurrence: createRevenueDto.recurrence,
          userId: userId,
        },
      });
    }

    const endDate = new Date(createRevenueDto.until);
    const recurrence = createRevenueDto.recurrence;

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

    const revenues = dates.map((date) => ({
      amountInCents: createRevenueDto.amountInCents,
      title: createRevenueDto.title,
      description: createRevenueDto.description,
      status: createRevenueDto.status,
      categoryId: createRevenueDto.categoryId,
      teamId: createRevenueDto.teamId,
      date,
      recurrence,
      userId: userId,
      batch: batchId,
    }));

    const createdRevenues = await this.prismaService.revenue.createMany({
      data: revenues,
    });

    return createdRevenues;
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

    return revenues;
  }

  async update(
    userId: string,
    teamId: string,
    revenueId: string,
    updateRevenueDto: UpdateRevenueDto,
  ) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    const updatedRevenue = await this.prismaService.revenue.update({
      where: {
        teamId: teamId,
        id: revenueId,
      },
      data: {
        amountInCents: updateRevenueDto.amountInCents,
        title: updateRevenueDto.title,
        description: updateRevenueDto.description,
        status: updateRevenueDto.status,
        categoryId: updateRevenueDto.categoryId,
        date: updateRevenueDto.date,
      },
    });

    if (
      updateRevenueDto.editSelection &&
      updateRevenueDto.editSelection !== 'just-this'
    ) {
      const batchId = updatedRevenue.batch;
      let startDate: Date | undefined;
      if (updateRevenueDto.editSelection === 'include-future') {
        startDate = new Date(updatedRevenue.date);
      }
      return await this.prismaService.revenue.updateMany({
        where: {
          batch: batchId,
          NOT: {
            id: revenueId,
          },
          ...(startDate && {
            date: {
              gte: startDate,
            },
          }),
        },
        data: {
          amountInCents: updateRevenueDto.amountInCents,
          title: updateRevenueDto.title,
          description: updateRevenueDto.description,
          status: updateRevenueDto.status,
          categoryId: updateRevenueDto.categoryId,
        },
      });
    }

    return updatedRevenue;
  }

  async remove(userId: string, teamId: string, revenueId: string) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    const deletedRevenue = await this.prismaService.revenue.delete({
      where: {
        id: revenueId,
      },
    });

    return deletedRevenue;
  }

  async removeByBatchId(userId: string, teamId: string, batchId: string) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    const deletedRevenue = await this.prismaService.revenue.deleteMany({
      where: {
        batch: batchId,
      },
    });

    return deletedRevenue;
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
      case 'FIFTH_WORKING_DAY': {
        return this.getFifthBusinessDayOfNextMonth(date);
      }
      default:
        next.setDate(next.getDate() + 1);
        break;
    }
    return next;
  }

  private getFifthBusinessDayOfNextMonth(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Próximo mês

    const firstDayNextMonth = new Date(year, month, 1);

    let businessDayCount = 0;
    const currentDate = new Date(firstDayNextMonth);

    while (businessDayCount < 5) {
      const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDayCount++;
      }

      if (businessDayCount < 5) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return currentDate;
  }
}
