import { Response } from "express";
import { AppError } from "./appError";

export function handleError(error: any, res: Response, path: string) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).send({
      message: error.message,
    });
  }

  console.error(`Error in ${path}:`, error);

  res.status(500).send({
    message: `Internal server error - ${path}`,
    error: error,
  });
}
