import { ExpenseStatus } from '@prisma/client';

export class UpdateExpenseDto {
  amountInCents: number;
  categoryId: string | null;
  date: string;
  description: string | null;
  status: ExpenseStatus;
  title: string;
  paymentMethodId: string | null;
  includeFuture?: boolean;
}
