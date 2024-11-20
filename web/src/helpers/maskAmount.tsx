export default function maskAmount(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})$/, ",$1")
    .replace(/(?=(\d{3})+(\D))\B/g, ".");
}
