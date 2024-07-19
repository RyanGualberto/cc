import prisma from "../clients/prismaClient";
import { AppError } from "../utils/appError";
import { UserCreateInput, UserLoginInput } from "../schemas/user";
import { userSerializer } from "../serializers";

export class UserModel {
  constructor() {}

  public async create(data: UserCreateInput) {
    const userPayload = new UserCreateInput(data);
    UserCreateInput.validate(userPayload);

    const user = await prisma.user.create({
      data: userPayload,
    });

    return userSerializer(user);
  }

  public async login(data: UserLoginInput) {
    UserLoginInput.validate(data);
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }, { cpf: data.cpf }],
        password: data.password,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return userSerializer(user);
  }
}
