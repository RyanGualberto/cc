import { type ExpenseCategory } from "./expense-category";
import { type User } from "./user";

export type Revenue = {
  user: User;
  id: string;
  title: string;
  description: string | null;
  date: string;
  batch: string;
  recurrence: "MONTHLY" | "WEEKLY" | "DAILY" | "ONCE";
  amountInCents: number;
  status: "PENDING" | "RECEIVED" | "OVERDUE";
  category?: ExpenseCategory;
  until: string | null;
};
