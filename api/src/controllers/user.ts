import { Request, Response, Router } from "express";
import { User as UserUseCase } from "../useCases/user";
import { AppError } from "../helpers/appError";
import { handleError } from "../helpers/handleError";

export class User {
  private userUseCase: UserUseCase;

  constructor() {
    this.userUseCase = new UserUseCase();
  }

  public get(req: Request, res: Response) {
    res.send("Hello, world!");
  }

  public getMe(req: Request, res: Response) {
    res.send("Hello, world from me!");
  }

  public async post(req: Request, res: Response) {
    try {
      const { user, token } = await this.userUseCase.create(req.body);
      res.status(201).header("Authorization", `Bearer ${token}`).json(user);
    } catch (error: unknown) {
      return handleError(error, res, "User.post");
    }
  }

  public put(req: Request, res: Response) {
    res.send("Hello, world!");
  }

  public delete(req: Request, res: Response) {}
}
