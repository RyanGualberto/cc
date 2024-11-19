import { z } from "zod";
const INVALID_SPACE_NAME_REQUIRED = "Nome do espaço é obrigatório";
const INVALID_SPACE_NAME_MAX_LENGTH =
  "Nome do espaço deve ter no máximo 255 caracteres";

export const TeamSchema = z.object({
  name: z
    .string({
      message: INVALID_SPACE_NAME_REQUIRED,
    })
    .min(1, INVALID_SPACE_NAME_REQUIRED)
    .max(255, INVALID_SPACE_NAME_MAX_LENGTH),
});
