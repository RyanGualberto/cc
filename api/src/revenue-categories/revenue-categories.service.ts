import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRevenueCategoryDto } from './dto/create-revenue-category.dto';
import { UpdateRevenueCategoryDto } from './dto/update-revenue-category.dto';
import { PrismaService } from 'src/config/prisma-service';
import { TeamMemberRole } from '@prisma/client';

@Injectable()
export class RevenueCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    userId: string,
    createRevenueCategoryDto: CreateRevenueCategoryDto,
  ) {
    await this.validateUserPermission(
      userId,
      createRevenueCategoryDto.teamId,
      'ADMIN',
    );
    return await this.prismaService.revenueCategory.create({
      data: createRevenueCategoryDto,
    });
  }

  async findAll(userId: string, teamId: string) {
    await this.validateUserPermission(userId, teamId, 'MEMBER');

    const revenueCategories = await this.prismaService.revenueCategory.findMany(
      {
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
      },
    );
    return revenueCategories;
  }

  async update(
    id: string,
    userId: string,
    updateRevenueCategoryDto: UpdateRevenueCategoryDto,
  ) {
    await this.validateUserPermission(
      userId,
      updateRevenueCategoryDto.teamId,
      'ADMIN',
    );

    return await this.prismaService.revenueCategory.update({
      where: {
        id,
      },
      data: {
        name: updateRevenueCategoryDto.name,
        teamId: updateRevenueCategoryDto.teamId,
      },
    });
  }

  async remove(id: string, teamId: string, userId: string) {
    await this.validateUserPermission(userId, teamId, 'ADMIN');

    return await this.prismaService.revenueCategory.delete({
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
