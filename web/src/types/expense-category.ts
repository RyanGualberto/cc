export type ExpenseCategory = {
  id: string;
  name: string;
  _count?: {
    expenses: number;
  };
  createdAt: string;
  updatedAt: string;
};
