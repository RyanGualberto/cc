import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { RevenueModel } from "../model/revenue";

export class Revenue {
  constructor() {}

  public async listTeamRevenues(req: Request, res: Response) {
    try {
      const revenues = await RevenueModel.listTeamRevenues(
        req.user.id,
        req.params.teamId,
        req.query
      );

      res.status(200).json(revenues);
    } catch (error: unknown) {
      return handleError(error, res, "Revenue.listTeamRevenues");
    }
  }

  public async createTeamRevenue(req: Request, res: Response) {
    try {
      req.body.userId = req.user.id;
      const revenue = await RevenueModel.create(req.body);

      res.status(201).json(revenue);
    } catch (error: unknown) {
      return handleError(error, res, "Revenue.createTeamRevenue");
    }
  }

  public async updateTeamRevenue(req: Request, res: Response) {
    try {
      const revenue = await RevenueModel.update(
        req.params.id,
        req.params.teamId,
        req.body
      );

      res.status(200).json(revenue);
    } catch (error: unknown) {
      return handleError(error, res, "Revenue.updateTeamRevenue");
    }
  }

  public async deleteTeamRevenue(req: Request, res: Response) {
    try {
      await RevenueModel.delete(req.params.id, req.user.id, req.params.teamId);

      res.status(204).end();
    } catch (error: unknown) {
      return handleError(error, res, "Revenue.deleteTeamRevenue");
    }
  }

  public async deleteTeamRevenuesByBatch(req: Request, res: Response) {
    try {
      await RevenueModel.deleteByBatch(
        req.params.batchId,
        req.user.id,
        req.params.teamId
      );

      res.status(204).end();
    } catch (error: unknown) {
      return handleError(error, res, "Revenue.deleteTeamRevenuesByBatch");
    }
  }
}
