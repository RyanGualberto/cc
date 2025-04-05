import { z } from "zod";

export const ALLOWED_STATUSES = ["PENDING", "RECEIVED", "OVERDUE"] as const;
export const ALLOWED_RECURRENCES = [
  "MONTHLY",
  "WEEKLY",
  "DAILY",
  "ONCE",
] as const;

export const addRevenueSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  date: z.date({
    message: "Data inválida",
  }),
  amountInCents: z.string({
    message: "Valor inválido",
  }),
  status: z.enum(ALLOWED_STATUSES, {
    message: "Status inválido",
  }),
  recurrence: z.enum(ALLOWED_RECURRENCES, {
    message: "Recorrência inválida",
  }),
  until: z.date().optional(),
  category: z.string().optional(),
});
