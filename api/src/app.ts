import express from "express";
import morgan from "morgan";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";
import { teamRouter } from "./routes/team";
import { expenseRouter } from "./routes/expense";
import { authenticator } from "./middlewares/authenticator";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/teams", authenticator, teamRouter);
app.use("/expenses", authenticator, expenseRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;
