export default function isCPFValid(cpf: string): boolean {

  // Remove special characters
  cpf = cpf.replace(/[^0-9]/g, '');
  
  // Check if every digit is the same
  if (cpf.split('').every((char) => char === cpf[0])) return false;

  // Check if the CPF has the correct length
  if (cpf.length !== 11) return false;

  // Calculate the first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]!) * (10 - i);
  }

  let remainder = sum % 11;
  if (remainder === 0 || remainder === 1) {
    remainder = 0;
  } else {
    remainder = 11 - remainder;
  }

  if (remainder.toString() !== cpf[9]) {
    return false;
  }

  // Calculate the second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]!) * (11 - i);
  }

  remainder = sum % 11;
  if (remainder === 0 || remainder === 1) {
    remainder = 0;
  } else {
    remainder = 11 - remainder;
  }

  if (remainder.toString() !== cpf[10]) {
    return false;
  }

  return true;
}
