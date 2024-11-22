import { z } from "zod";
import { ALLOWED_STATUSES } from "./add-revenue-schema";

export const editRevenueSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  date: z.date(),
  amountInCents: z.string(),
  status: z.enum(ALLOWED_STATUSES),
  category: z.string().optional(),
  includeFuture: z.boolean().optional(),
});
