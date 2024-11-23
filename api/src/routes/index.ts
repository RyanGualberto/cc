import { authenticator } from "../middlewares/authenticator";
import { Router } from "express";
import { expenseCategoryRouter } from "./expense-category";
import { expenseRouter } from "./expense";
import { revenueCategoryRouter } from "./revenue-category";
import { revenueRouter } from "./revenue";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { teamRouter } from "./team";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/teams", authenticator, teamRouter);
router.use("/expenses", authenticator, expenseRouter);
router.use("/expense-categories", authenticator, expenseCategoryRouter);
router.use("/revenues", authenticator, revenueRouter);
router.use("/revenue-categories", authenticator, revenueCategoryRouter);

router.get("/", (req, res) => {
  res.send("All routes are working");
});

export { router as routes };
