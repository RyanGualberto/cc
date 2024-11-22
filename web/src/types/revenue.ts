import { type RevenueCategory } from "./revenue-category";
import { type User } from "./user";

export type Revenue = {
  user: User;
  id: string;
  title: string;
  description?: string;
  date: string;
  batch: string;
  recurrence: "monthly" | "weekly" | "daily" | "once";
  amountInCents: number;
  status: "pending" | "paid" | "overdue";
  category: RevenueCategory;
  until: string | null;
};
