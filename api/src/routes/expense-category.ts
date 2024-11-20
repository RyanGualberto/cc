import { Router } from "express";
import { ExpenseCategory as ExpenseCategoryController } from "../controllers/expense-category";

const router = Router();
const expenseCategoryController = new ExpenseCategoryController();

router.post("/", expenseCategoryController.createTeamExpenseCategory);
router.get("/:teamId", expenseCategoryController.listTeamExpenseCategories);
router.put("/:teamId/:id", expenseCategoryController.updateTeamExpenseCategory);

export { router as expenseCategoryRouter };
