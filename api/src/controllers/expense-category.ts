import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { ExpenseCategoryModel } from "../model/expense-category";

export class ExpenseCategory {
  constructor() {}

  public async listTeamExpenseCategories(req: Request, res: Response) {
    try {
      const expenses = await ExpenseCategoryModel.listTeamExpenseCategories(
        req.params.teamId,
        req.user.id
      );

      res.status(200).json(expenses);
    } catch (error: unknown) {
      return handleError(
        error,
        res,
        "ExpenseCategory.listTeamExpenseCategories"
      );
    }
  }

  public async createTeamExpenseCategory(req: Request, res: Response) {
    try {
      const expense = await ExpenseCategoryModel.create(req.user.id, req.body);

      res.status(201).json(expense);
    } catch (error: unknown) {
      return handleError(
        error,
        res,
        "ExpenseCategory.createTeamExpenseCategories"
      );
    }
  }

  public async updateTeamExpenseCategory(req: Request, res: Response) {
    try {
      const expense = await ExpenseCategoryModel.update(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(200).json(expense);
    } catch (error: unknown) {
      return handleError(
        error,
        res,
        "ExpenseCategory.updateTeamExpenseCategories"
      );
    }
  }
}
