import { ExpenseCategory } from "./expense-category";
import { type User } from "./user";

export type Expense = {
  user: User;
  id: string;
  title: string;
  description?: string;
  date: string;
  recurrence: "monthly" | "weekly" | "daily" | "once";
  amountInCents: number;
  status: "pending" | "paid" | "overdue";
  category: ExpenseCategory;
};
