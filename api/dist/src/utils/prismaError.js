"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = void 0;
function handlePrismaError(error) {
    if (error.code === "P2002") {
        const fields = (error.meta && error.meta.target) || [];
        return {
            status: 400,
            message: `The ${fields.join(",")} is already in use`,
        };
    }
    console.error("Prisma error: ", error);
    return {
        status: 500,
        message: error.message,
    };
}
exports.handlePrismaError = handlePrismaError;
