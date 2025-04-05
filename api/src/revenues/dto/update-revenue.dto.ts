import { RevenueStatus } from '@prisma/client';

export class UpdateRevenueDto {
  amountInCents: number;
  categoryId: string | null;
  date: string;
  description: string | null;
  status: RevenueStatus;
  title: string;
  includeFuture?: boolean;
}
