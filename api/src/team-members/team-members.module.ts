import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { MailModule } from 'src/mail/mail.module';
import { PrismaService } from 'src/config/prisma-service';

@Module({
  imports: [MailModule],
  controllers: [TeamMembersController],
  providers: [TeamMembersService, PrismaService],
})
export class TeamMembersModule {}
