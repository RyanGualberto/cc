import { Module } from '@nestjs/common';
import { ExpenseCategoriesService } from './expense-categories.service';
import { ExpenseCategoriesController } from './expense-categories.controller';
import { PrismaService } from 'src/config/prisma-service';

@Module({
  controllers: [ExpenseCategoriesController],
  providers: [ExpenseCategoriesService, PrismaService],
})
export class ExpenseCategoriesModule {}
