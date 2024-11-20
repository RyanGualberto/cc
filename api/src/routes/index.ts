import { authenticator } from "../middlewares/authenticator";
import { Router } from "express";
import { expenseCategoryRouter } from "./expense-category";
import { expenseRouter } from "./expense";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { teamRouter } from "./team";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/teams", authenticator, teamRouter);
router.use("/expenses", authenticator, expenseRouter);
router.use("/expense-categories", authenticator, expenseCategoryRouter);

export { router as routes };
