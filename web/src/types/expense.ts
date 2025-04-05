import { type ExpenseCategory } from "./expense-category";
import { type User } from "./user";

export type Expense = {
  user: User;
  id: string;
  title: string;
  description: string | null;
  date: string;
  batch: string;
  recurrence: "MONTHLY" | "WEEKLY" | "DAILY" | "ONCE";
  amountInCents: number;
  status: "PENDING" | "PAID" | "OVERDUE";
  category?: ExpenseCategory;
  until: string | null;
};
