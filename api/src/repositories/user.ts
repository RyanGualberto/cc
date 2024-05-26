import prisma from "../clients/prismaClient";
import { AppError } from "../helpers/appError";
import { createUser, createUser as createUserSchema } from "../schemas/user";

const env = process.env.NODE_ENV;

export class User {
  constructor() {}

  public async create(payload: createUser) {
    try {
      await createUserSchema.validateAsync(payload);
      return await prisma.user.create({
        data: payload,
      });
    } catch (error: any) {
      if (error.isJoi) {
        throw new AppError(error.message, 400);
      }

      if (error.code === "P2002") {
        throw new AppError(`User already exists`, 400);
      }

      if (env === "development") {
        console.error(error);
      }

      throw new AppError(`Internal server error`, 500);
    }
  }

  public async get() {}
}
