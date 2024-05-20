import express from "express";
import morgan from "morgan";
import { userRouter } from "./routes/user";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

export default app;
