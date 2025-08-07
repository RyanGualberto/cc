import { Module } from '@nestjs/common';
import { TeamDashboardService } from './team-dashboard.service';
import { TeamDashboardController } from './team-dashboard.controller';
import { PrismaService } from 'src/config/prisma-service';

@Module({
  controllers: [TeamDashboardController],
  providers: [TeamDashboardService, PrismaService],
})
export class TeamDashboardModule {}
