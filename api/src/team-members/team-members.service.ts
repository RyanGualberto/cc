import { Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { PrismaService } from 'src/config/prisma-service';
import { MailService } from 'src/mail/mail.service';
import { Team, TeamMemberRole } from '@prisma/client';

@Injectable()
export class TeamMembersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(userId: string, createTeamMemberDto: CreateTeamMemberDto) {
    const teamMember = await this.validateIfUserIsPartFromTeam(
      userId,
      createTeamMemberDto.teamId,
    );

    const invite = await this.prismaService.teamInvite.create({
      data: {
        teamId: createTeamMemberDto.teamId,
        email: createTeamMemberDto.email,
      },
    });

    return await this.mailService.sendTeamInvite(
      invite.email,
      teamMember.team.name,
      invite.id,
    );
  }

  async acceptInvite(userId: string, inviteId: string) {
    const invite = await this.prismaService.teamInvite.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invite) {
      throw new Error('Invite not found');
    }

    await this.prismaService.teamInvite.delete({
      where: {
        id: inviteId,
      },
    });

    return await this.prismaService.teamMember.create({
      data: {
        userId,
        teamId: invite.teamId,
        role: 'MEMBER',
      },
    });
  }

  async findAll(userId: string, teamId: string) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);
    return await this.prismaService.teamInvite.findMany({
      where: {
        teamId,
      },
    });
  }

  async removeTeamInvite(
    userId: string,
    teamId: string,
    teamInviteId: string,
  ): Promise<void> {
    await this.validateIfUserIsPartFromTeam(userId, teamId);
    await this.prismaService.teamInvite.delete({
      where: {
        id: teamInviteId,
      },
    });

    return;
  }

  async findOne(userEmail: string, teamInviteId: string): Promise<Team> {
    const { team } = await this.prismaService.teamInvite.findFirst({
      where: {
        id: teamInviteId,
        email: userEmail,
      },
      select: {
        team: true,
      },
    });

    return team;
  }

  async update(
    userId: string,
    teamId: string,
    teamMemberId: string,
    role: TeamMemberRole,
  ) {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    return await this.prismaService.teamMember.update({
      where: {
        id: teamMemberId,
      },
      data: {
        role: role,
      },
    });
  }

  async remove(
    userId: string,
    teamId: string,
    teamMemberId: string,
  ): Promise<void> {
    await this.validateIfUserIsPartFromTeam(userId, teamId);

    await this.prismaService.teamMember.delete({
      where: {
        id: teamMemberId,
      },
    });

    return;
  }

  private async validateIfUserIsPartFromTeam(userId: string, teamId: string) {
    const user = await this.prismaService.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
      include: {
        team: true,
      },
    });

    if (!user) {
      throw new Error('User is not part of the team');
    }

    return user;
  }
}
