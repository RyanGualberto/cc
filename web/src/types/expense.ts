import { type ExpenseCategory } from "./expense-category";
import { type ExpensePaymentMethod } from "./expense-payment-method";
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
  paymentMethod?: ExpensePaymentMethod;
  until: string | null;
};
