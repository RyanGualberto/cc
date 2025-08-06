import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { PrismaService } from 'src/config/prisma-service';
import { TeamMemberRole } from '@prisma/client';

@Injectable()
export class ExpenseCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    userId: string,
    createExpenseCategoryDto: CreateExpenseCategoryDto,
  ) {
    await this.validateUserPermission(
      userId,
      createExpenseCategoryDto.teamId,
      'ADMIN',
    );
    return await this.prismaService.expenseCategory.create({
      data: createExpenseCategoryDto,
    });
  }

  async findAll(userId: string, teamId: string, date?: string) {
    await this.validateUserPermission(userId, teamId, 'MEMBER');

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (date) {
      const month = date.split('/')[0].padStart(2, '0');
      const year = date.split('/')[1].padStart(4, '0');
      startDate = new Date(`${year}-${month}`);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const expenseCategories = await this.prismaService.expenseCategory.findMany(
      {
        where: {
          OR: [{ teamId }, { teamId: null }],
        },
        include: {
          _count: {
            select: {
              expenses: {
                where: {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              },
            },
          },
        },
      },
    );
    return expenseCategories;
  }

  async update(
    id: string,
    userId: string,
    updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    await this.validateUserPermission(
      userId,
      updateExpenseCategoryDto.teamId,
      'ADMIN',
    );

    return await this.prismaService.expenseCategory.update({
      where: {
        id,
      },
      data: updateExpenseCategoryDto,
    });
  }

  async remove(id: string, teamId: string, userId: string) {
    await this.validateUserPermission(userId, teamId, 'ADMIN');

    return await this.prismaService.expenseCategory.delete({
      where: {
        id,
      },
    });
  }

  private async validateUserPermission(
    userId: string,
    teamId: string,
    role: TeamMemberRole,
  ) {
    const userTeamMember = await this.prismaService.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (!userTeamMember) {
      throw new ForbiddenException(
        'User does not have permission to view or update somethin at this team',
      );
    }

    if (role === 'ADMIN' && userTeamMember.role === 'MEMBER') {
      throw new ForbiddenException(
        'User does not have permission to view or update somethin at this team',
      );
    }

    return true;
  }
}
