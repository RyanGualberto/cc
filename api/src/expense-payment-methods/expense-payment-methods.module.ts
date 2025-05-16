import { Module } from '@nestjs/common';
import { ExpensePaymentMethodsService } from './expense-payment-methods.service';
import { ExpensePaymentMethodsController } from './expense-payment-methods.controller';
import { PrismaService } from 'src/config/prisma-service';

@Module({
  controllers: [ExpensePaymentMethodsController],
  providers: [ExpensePaymentMethodsService, PrismaService],
})
export class ExpensePaymentMethodsModule {}
