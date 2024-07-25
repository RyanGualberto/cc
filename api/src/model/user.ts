import prisma from "../clients/prismaClient";
import { AppError } from "../utils/appError";
import { userSerializer } from "../serializers/user";
import { CreateUserSchema, UserLoginSchema } from "../schemas/user";

export interface UserCreateInput {
  first_name: string;
  last_name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email?: string;
  phone?: string;
  cpf?: string;
  password: string;
}

class UserModel {
  constructor() {}

  public async create(data: UserCreateInput) {
    const { value, error } = CreateUserSchema.validate(data);

    if (error) {
      throw new AppError(error.message, 400);
    }

    const user = await prisma.user.create({
      data: value,
      select: userSerializer,
    });

    return user;
  }

  public async login(data: UserLoginInput) {
    const { error, value } = UserLoginSchema.validate(data);

    if (error) {
      throw new AppError(error.message, 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: value.email },
          { phone: value.phone },
          { cpf: value.cpf },
        ],
        password: value.password,
      },
      select: userSerializer,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  public async findUnique(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: userSerializer,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

const model = new UserModel();
export { model as UserModel };
