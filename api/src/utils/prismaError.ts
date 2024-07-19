import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function handlePrismaError(error: PrismaClientKnownRequestError) {
  if (error.code === "P2002") {
    const fields = (error.meta && (error.meta.target as string[])) || [];

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
