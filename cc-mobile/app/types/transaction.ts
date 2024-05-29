export type TransactionType = {
  id: string,
  type: "deposit" | "withdraw",
  title: string,
  value: number,
  date: string,
  user: string
}