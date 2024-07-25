import { Router } from "express";
import { User as UserController } from "../controllers/user";
import { authenticator } from "../middlewares/authenticator";

const router = Router();
const userController = new UserController();

router.post("/", userController.post);
router.get("/me", authenticator, userController.get);

export { router as userRouter };
