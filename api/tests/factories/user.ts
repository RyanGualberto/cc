import prisma from "../../src/clients/prismaClient";
import { faker } from "@faker-js/faker";
import { UserCreateInput } from "../../src/schemas/user";

export const user = async (data?: Partial<UserCreateInput>) => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    cpf: String(faker.number.int(11)),
    phone: faker.phone.number(),
  };

  return await prisma.user.create({
    data: {
      ...user,
      ...data,
    },
  });
};
