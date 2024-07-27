import { Router } from "express";
import { Expense as ExpenseController } from "../controllers/expense";

const router = Router();
const expenseController = new ExpenseController();

router.post("/", expenseController.createTeamExpense);
router.get("/:teamId", expenseController.listTeamExpenses);

export { router as expenseRouter };
