import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { ExpenseModel } from "../model/expense";

export class Expense {
  constructor() {}

  public async post(req: Request, res: Response) {
    try {
      const expenseModel = new ExpenseModel();
      const expense = await expenseModel.create(req.body);

      res.status(200).json(expense);
    } catch (error: unknown) {
      return handleError(error, res, "User.post");
    }
  }
}
