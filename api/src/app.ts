import express from "express";
import morgan from "morgan";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;
