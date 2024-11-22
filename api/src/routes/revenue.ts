import { Router } from "express";
import { Revenue as RevenueController } from "../controllers/revenue";

const router = Router();
const revenueController = new RevenueController();

router.post("/", revenueController.createTeamRevenue);
router.get("/:teamId", revenueController.listTeamRevenues);
router.put("/:teamId/:id", revenueController.updateTeamRevenue);
router.delete("/:teamId/:id", revenueController.deleteTeamRevenue);
router.delete(
  "/:teamId/batch/:batchId",
  revenueController.deleteTeamRevenuesByBatch
);

export { router as revenueRouter };
