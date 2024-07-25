import { NextFunction, Request, Response } from "express";
import { decodeTokenFromHeader } from "../services/jwt";
import { UserModel } from "../model/user";

export async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userId } = decodeTokenFromHeader<{ userId: string }>(authorization);
    const user = await UserModel.findUnique(userId);

    req.user = user;
    next();
  } catch (error: unknown) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
