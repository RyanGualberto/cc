import { z } from "zod";


export const TeamMemberSchema = z.object({
  email: z.string().email("E-mail inválido").nonempty("E-mail é obrigatório"),
});
