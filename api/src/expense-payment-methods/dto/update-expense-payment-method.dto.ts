import { PartialType } from '@nestjs/mapped-types';
import { CreateExpensePaymentMethodDto } from './create-expense-payment-method.dto';

export class UpdateExpensePaymentMethodDto extends PartialType(
  CreateExpensePaymentMethodDto,
) {}
