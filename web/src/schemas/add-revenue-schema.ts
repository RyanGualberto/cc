import { z } from "zod";

export const ALLOWED_STATUSES = ["pending", "paid", "overdue"] as const;
export const ALLOWED_RECURRENCES = [
  "monthly",
  "weekly",
  "daily",
  "once",
] as const;

export const addRevenueSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  date: z.date(),
  amountInCents: z.string(),
  status: z.enum(ALLOWED_STATUSES),
  recurrence: z.enum(ALLOWED_RECURRENCES),
  until: z.date().optional(),
  category: z.string().optional(),
});
