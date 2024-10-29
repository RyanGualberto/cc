import { z } from "zod";
import isCPFValid from "~/helpers/isCpfValid";
import isPasswordValid from "~/helpers/isPasswordValid";
const INVALID_PASSWORD_MESSAGE =
  "Sua senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um caractere especial";

export const LoginSchema = z.object({
  cpf: z
    .string()
    .length(14, "CPF inválido")
    .refine(isCPFValid, { message: "CPF inválido" }),
  password: z
    .string()
    .min(6, INVALID_PASSWORD_MESSAGE)
    .refine(isPasswordValid, { message: INVALID_PASSWORD_MESSAGE }),
});
