import express from "express";
import morgan from "morgan";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(
  cors({
    exposedHeaders: ["Authorization"],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

export default app;
