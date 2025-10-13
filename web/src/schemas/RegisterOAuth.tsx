import { z } from "zod";
import isCPFValid from "~/helpers/isCpfValid";

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .length(14, "CPF inválido")
    .refine(isCPFValid, { message: "CPF inválido" }),
  phone: z.string().length(15, "Telefone inválido"),
});
