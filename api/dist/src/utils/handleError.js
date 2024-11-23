"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const appError_1 = require("./appError");
const library_1 = require("@prisma/client/runtime/library");
const prismaError_1 = require("./prismaError");
function handleError(error, res, path) {
    if (error instanceof appError_1.AppError) {
        return res.status(error.statusCode).send({
            status: error.statusCode,
            message: error.message,
        });
    }
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        const prismaFormattedError = (0, prismaError_1.handlePrismaError)(error);
        return res.status(prismaFormattedError.status).send(prismaFormattedError);
    }
    if (error instanceof library_1.PrismaClientValidationError) {
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
exports.handleError = handleError;
