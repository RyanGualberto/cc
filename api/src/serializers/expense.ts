import { userSerializer } from "./user";

export const expenseSerializer = {
  id: true,
  title: true,
  description: true,
  amountInCents: true,
  recurrence: true,
  status: true,
  date: true,
  batch: true,
  user: {
    select: userSerializer,
  },
  category: true,
  until: true,
};
