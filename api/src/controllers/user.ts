import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { UserModel } from "../model/user";
import { generateToken } from "../services/jwt";

export class User {
  constructor() {}

  public async post(req: Request, res: Response) {
    try {
      const userModel = new UserModel();

      const user = await userModel.create(req.body);
      const token = generateToken({ userId: user.id });

      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(201).json(user);
    } catch (error: unknown) {
      return handleError(error, res, "User.post");
    }
  }
}
