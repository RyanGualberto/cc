import { userSerializer } from "./user";

export const expenseSerializer = {
  id: true,
  title: true,
  description: true,
  amountInCents: true,
  recurrence: true,
  user: {
    select: userSerializer,
  },
};
