import { ExpenseRecurrence, ExpenseStatus } from '@prisma/client';

export class CreateExpenseDto {
  teamId: string;
  description?: string;
  amountInCents: number;
  date: string;
  recurrence: ExpenseRecurrence;
  status: ExpenseStatus;
  until?: string;
  title: string;
  categoryId: string | undefined;
  paymentMethodId: string | undefined;
}
