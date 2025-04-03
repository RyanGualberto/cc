import { Module } from '@nestjs/common';
import { RevenueCategoriesService } from './revenue-categories.service';
import { RevenueCategoriesController } from './revenue-categories.controller';
import { PrismaService } from 'src/config/prisma-service';

@Module({
  controllers: [RevenueCategoriesController],
  providers: [RevenueCategoriesService, PrismaService],
})
export class RevenueCategoriesModule {}
