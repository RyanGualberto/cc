import { Module } from '@nestjs/common';
import { RevenuesService } from './revenues.service';
import { RevenuesController } from './revenues.controller';
import { PrismaService } from 'src/config/prisma-service';

@Module({
  controllers: [RevenuesController],
  providers: [RevenuesService, PrismaService],
})
export class RevenuesModule {}
