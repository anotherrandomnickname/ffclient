import { IValidator } from '@/interfaces/_index'

class Validator implements IValidator {
  public email(val: string, ...args: string[]): boolean {
    return true
  }

  public login(val: string): string | boolean {
    const re = /(^[a-zA-Z\a-яА-Я]+[a-z0-9A-Z\ \-\a-яА-Я\_\-]+$)/
    const splitter: string[] = val.split(' ')
    let test: boolean = false
    test = re.test(val)

    if (splitter.length <= 2 && test && val.length > 3) {
      return true
    }
    if (splitter.length >= 3) {
      return 'Только один пробел разрешен между символами'
    }
    if (!test && val.length >= 3) {
      return 'Логин содержит недопустимые символы'
    }
    if (val.length <= 3) {
      return 'Логин слишком короткий'
    }

    return ''
  }

  public password(val: string, ...args: string[]): boolean {
    if (val.length <= 5) {
      return false
    } else {
      return true
    }
  }
}

export default new Validator()
