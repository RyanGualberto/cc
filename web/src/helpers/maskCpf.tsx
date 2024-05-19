export default function maskCpf(cpf: string): string {
  const value = cpf.replace(/\D/g, '')
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}