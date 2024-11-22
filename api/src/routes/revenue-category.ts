import { Router } from "express";
import { RevenueCategory as RevenueCategoryController } from "../controllers/revenue-category";

const router = Router();
const revenueCategoryController = new RevenueCategoryController();

router.post("/", revenueCategoryController.createTeamRevenueCategory);
router.get("/:teamId", revenueCategoryController.listTeamRevenueCategories);
router.put("/:teamId/:id", revenueCategoryController.updateTeamRevenueCategory);

export { router as revenueCategoryRouter };
