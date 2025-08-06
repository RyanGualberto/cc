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

  async findAll(userId: string, teamId: string) {
    await this.validateUserPermission(userId, teamId, 'MEMBER');

    const expenseCategories = await this.prismaService.expenseCategory.findMany(
      {
        where: {
          OR: [{ teamId }, { teamId: null }],
        },
        include: {
          _count: {
            select: {
              expenses: true,
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
