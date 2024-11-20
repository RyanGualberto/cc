import { type User } from "./user";

export type Expense = {
  user: User;
  id: string;
  title: string;
  description: string | null;
  date: string;
  recurrence: "monthly" | "weekly" | "daily" | "once";
  amountInCents: number;
  status: "pending" | "paid" | "overdue";
};
