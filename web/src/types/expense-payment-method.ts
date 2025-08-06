export type ExpensePaymentMethod = {
  id: string;
  name: string;
  teamId: string | null;
  _count?: {
    expenses: number;
  };
  createdAt: string;
  updatedAt: string;
};
