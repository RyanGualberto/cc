export default function maskPhone(phone: string): string {
  const value = phone.replace(/\D/g, '')
  return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}