interface IValidator {
  email(val: string, ...args: string[]): boolean
  login(val: string): string | boolean
  password(val: string, ...args: string[]): boolean
}

export default IValidator
