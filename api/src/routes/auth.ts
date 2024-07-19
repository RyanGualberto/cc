import { Router } from "express";
import { Auth as AuthController } from "../controllers/auth";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);

export { router as authRouter };
