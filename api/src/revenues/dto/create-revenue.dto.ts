import { RevenueRecurrence, RevenueStatus } from '@prisma/client';

export class CreateRevenueDto {
  teamId: string;
  description?: string;
  amountInCents: number;
  date: string;
  recurrence: RevenueRecurrence;
  status: RevenueStatus;
  until?: string;
  title: string;
  categoryId: string | undefined;
}
