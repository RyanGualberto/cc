import { Controller, Get, Param, Req, UseGuards, Query } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { TeamDashboardService } from './team-dashboard.service';

@UseGuards(AuthGuard)
@Controller('teams-dashboard')
export class TeamDashboardController {
  constructor(private readonly teamDashboardService: TeamDashboardService) {}

  @Get(':teamId/timeline')
  async findAll(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Query('date') date: string,
  ) {
    return await this.teamDashboardService.getTimeline(
      req.user.id,
      teamId,
      date,
    );
  }
}
