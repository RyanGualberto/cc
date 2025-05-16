import { z } from "zod";

export const addExpensePaymentMethodSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
});
