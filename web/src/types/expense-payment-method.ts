export type ExpensePaymentMethod = {
  id: string;
  name: string;
  _count?: {
    expenses: number;
  };
  createdAt: string;
  updatedAt: string;
};
