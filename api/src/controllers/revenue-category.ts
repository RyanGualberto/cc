import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { RevenueCategoryModel } from "../model/revenue-category";

export class RevenueCategory {
  constructor() {}

  public async listTeamRevenueCategories(req: Request, res: Response) {
    try {
      const revenues = await RevenueCategoryModel.listTeamRevenueCategories(
        req.params.teamId,
        req.user.id
      );

      res.status(200).json(revenues);
    } catch (error: unknown) {
      return handleError(
        error,
        res,
        "RevenueCategory.listTeamRevenueCategories"
      );
    }
  }

  public async createTeamRevenueCategory(req: Request, res: Response) {
    try {
      const revenue = await RevenueCategoryModel.create(req.user.id, req.body);

      res.status(201).json(revenue);
    } catch (error: unknown) {
      return handleError(
        error,
        res,
        "RevenueCategory.createTeamRevenueCategories"
      );
    }
  }

  public async updateTeamRevenueCategory(req: Request, res: Response) {
    try {
      const revenue = await RevenueCategoryModel.update(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(200).json(revenue);
    } catch (error: unknown) {
      return handleError(
        error,
        res,
        "RevenueCategory.updateTeamRevenueCategories"
      );
    }
  }
}
