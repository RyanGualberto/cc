import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { PrismaService } from '../config/prisma-service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [CronController],
  providers: [CronService, PrismaService, MailService],
})
export class CronModule {}
