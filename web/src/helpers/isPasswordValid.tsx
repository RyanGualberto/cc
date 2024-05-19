export default function isPasswordValid(password: string): boolean {
  const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&*\(\)_+\-=\[\]\{\}\'\";:\./\<\>,.\?]).{8,}$/)
  return regex.test(password)
}