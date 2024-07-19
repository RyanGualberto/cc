import { Router } from "express";
import { User as UserController } from "../controllers/user";

const router = Router();
const userController = new UserController();

router.post("/", userController.post);

export { router as userRouter };
