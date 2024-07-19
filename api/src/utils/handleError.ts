import { Response } from "express";
import { AppError } from "./appError";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { handlePrismaError } from "./prismaError";

export function handleError(error: any, res: Response, path: string) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).send({
      status: error.statusCode,
      message: error.message,
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const prismaFormattedError = handlePrismaError(error);
    return res.status(prismaFormattedError.status).send(prismaFormattedError);
  }

  if (error instanceof PrismaClientValidationError) {
    const message = error.message.split("\n\n")[2];

    return res.status(400).send({
      status: 400,
      message,
    });
  }

  console.error(`Error in ${path}:`, error);
  res.status(500).send({
    message: `Internal server error - ${path}`,
    error: error,
  });
}
