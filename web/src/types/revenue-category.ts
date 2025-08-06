export type RevenueCategory = {
  id: string;
  name: string;
  teamId: string | null;
  _count?: {
    revenues: number;
  };
  createdAt: string;
  updatedAt: string;
};
