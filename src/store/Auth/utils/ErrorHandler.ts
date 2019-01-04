export function DefineError(error: number): string {
  let res: string
  switch (error) {
    case 20:
      res = 'Логин и/или пароль неправильный!'
      break
    default:
      res = ''
  }
  return res
}

export default class ErrorHandler {
  public registry(status: number): string | null {
    switch (status) {
      case 1:
        return null
      default:
        return null
    }
  }
}
