import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateExpensePaymentMethodDto } from './dto/create-expense-payment-method.dto';
import { UpdateExpensePaymentMethodDto } from './dto/update-expense-payment-method.dto';
import { PrismaService } from 'src/config/prisma-service';
import { TeamMemberRole } from '@prisma/client';

@Injectable()
export class ExpensePaymentMethodsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    userId: string,
    createExpensePaymentMethodDto: CreateExpensePaymentMethodDto,
  ) {
    await this.validateUserPermission(
      userId,
      createExpensePaymentMethodDto.teamId,
      'ADMIN',
    );
    return await this.prismaService.expensePaymentMethod.create({
      data: createExpensePaymentMethodDto,
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

    const expensePaymentMethods =
      await this.prismaService.expensePaymentMethod.findMany({
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
      });
    return expensePaymentMethods;
  }

  async update(
    id: string,
    userId: string,
    updateExpensePaymentMethodDto: UpdateExpensePaymentMethodDto,
  ) {
    await this.validateUserPermission(
      userId,
      updateExpensePaymentMethodDto.teamId,
      'ADMIN',
    );

    return await this.prismaService.expensePaymentMethod.update({
      where: {
        id,
      },
      data: {
        name: updateExpensePaymentMethodDto.name,
      },
    });
  }

  async remove(id: string, teamId: string, userId: string) {
    await this.validateUserPermission(userId, teamId, 'ADMIN');

    return await this.prismaService.expensePaymentMethod.delete({
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
