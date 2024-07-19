import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "colorless",
});

export default prisma;
