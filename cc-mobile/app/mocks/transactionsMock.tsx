import { TransactionType } from "../types/transaction";

export const transactionsMock: TransactionType[] = [
  {
    id: '1',
    type: "deposit",
    title: "Salário",
    value: 2000,
    date: "2021-08-12",
    user: "Você"
  },
  {
    id: '2',
    type: "withdraw",
    title: "Mercado",
    value: 250,
    date: "2021-08-12",
    user: "Maria"
  },
  {
    id: '3',
    type: "withdraw",
    title: "Mercado",
    value: 250,
    date: "2021-08-12",
    user: "Maria"
  },
]