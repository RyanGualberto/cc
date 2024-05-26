import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
  errorFormat: "pretty",
});

export default prisma;
