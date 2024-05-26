import { Router } from "express";
import { User as UserController } from "../controllers/user";

const router = Router();
const userController = new UserController();

router.get("/", userController.get);
router.get("/me", userController.getMe);
router.post("/", userController.post.bind(userController));
router.put("/", userController.put);
router.delete("/", userController.delete);

export { router as userRouter };
