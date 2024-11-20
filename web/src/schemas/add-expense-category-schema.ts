import { z } from "zod";

export const addExpenseCategorySchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
});
