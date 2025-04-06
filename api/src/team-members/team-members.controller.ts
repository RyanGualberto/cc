import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post('invites')
  async createInvite(
    @Req() req: Request,
    @Body() createTeamMemberDto: CreateTeamMemberDto,
  ) {
    return await this.teamMembersService.create(
      req.user.id,
      createTeamMemberDto,
    );
  }

  @Post('invites/accept/:inviteId')
  async acceptInvite(@Req() req: Request, @Param('inviteId') inviteId: string) {
    return await this.teamMembersService.acceptInvite(req.user.id, inviteId);
  }

  @Get(':teamId/invites')
  async findAll(@Req() req: Request, @Param('teamId') teamId: string) {
    return await this.teamMembersService.findAll(req.user.id, teamId);
  }

  @Delete(':teamId/invites/:inviteId')
  async removeInvite(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return await this.teamMembersService.removeTeamInvite(
      req.user.id,
      teamId,
      inviteId,
    );
  }

  @Get('/invites/:inviteId')
  async findOne(@Req() req: Request, @Param('inviteId') inviteId: string) {
    return await this.teamMembersService.findOne(req.user.email, inviteId);
  }

  @Patch(':teamId/:memberId')
  async update(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('memberId') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    return await this.teamMembersService.update(
      req.user.id,
      teamId,
      id,
      updateTeamMemberDto.role,
    );
  }

  @Delete(':teamId/:memberId')
  async remove(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('memberId') id: string,
  ) {
    return await this.teamMembersService.remove(req.user.id, teamId, id);
  }
}
