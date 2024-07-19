import { User } from "@prisma/client";

export const userSerializer = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    cpf: user.cpf,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
