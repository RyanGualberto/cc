import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { UserModel } from "../model/user";
import { generateToken } from "../services/jwt";

export class Auth {
  constructor() {}

  public async login(req: Request, res: Response) {
    try {
      const userModel = new UserModel();

      const user = await userModel.login(req.body);
      const token = generateToken({ userId: user.id });

      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(200).json(user);
    } catch (error: unknown) {
      return handleError(error, res, "User.post");
    }
  }
}
