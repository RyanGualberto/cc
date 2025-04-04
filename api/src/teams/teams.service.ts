import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/config/prisma-service';

@Injectable()
export class TeamsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTeamDto: CreateTeamDto & { userId: string }) {
    return await this.prismaService.team.create({
      data: {
        name: createTeamDto.name,
        teamMembers: {
          create: {
            userId: createTeamDto.userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.team.findMany({
      where: {
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      include: {
        teamMembers: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const team = await this.prismaService.team.findFirst({
      where: {
        id,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      include: {
        teamMembers: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return null;
    }

    const currentUserRole =
      team.teamMembers.find((member) => member.userId === userId)?.role || null;

    return {
      ...team,
      role: currentUserRole,
    };
  }

  async update(id: string, userId: string, updateTeamDto: UpdateTeamDto) {
    return await this.prismaService.team.update({
      where: {
        id,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
      data: {
        name: updateTeamDto.name,
      },
    });
  }

  async remove(id: string, userId: string) {
    return await this.prismaService.team.delete({
      where: {
        id,
        teamMembers: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
