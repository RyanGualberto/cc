export type ExpenseCategory = {
  id: string;
  name: string;
  teamId: string | null;
  _count?: {
    expenses: number;
  };
  createdAt: string;
  updatedAt: string;
};
