import { z } from "zod";
import { ALLOWED_STATUSES } from "./add-expense-schema";

export const editExpenseSchema = z.object({
  title: z
    .string({
      message: "Título inválido",
    })
    .min(3, "Título deve ter no mínimo 3 caracteres"),
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
  category: z.string({
    message: "Categoria inválida",
  }),
  paymentMethod: z.string({
    message: "Método de pagamento inválido",
  }),
  includeFuture: z.boolean().optional(),
});
