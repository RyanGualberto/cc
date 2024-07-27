import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { ExpenseModel } from "../model/expense";

export class Expense {
  constructor() {}

  public async listTeamExpenses(req: Request, res: Response) {
    try {
      const expenses = await ExpenseModel.listTeamExpenses(
        req.user.id,
        req.params.teamId
      );

      res.status(200).json(expenses);
    } catch (error: unknown) {
      return handleError(error, res, "Expense.listTeamExpenses");
    }
  }

  public async createTeamExpense(req: Request, res: Response) {
    try {
      const expense = await ExpenseModel.create(req.body);

      res.status(201).json(expense);
    } catch (error: unknown) {
      return handleError(error, res, "User.post");
    }
  }
}
