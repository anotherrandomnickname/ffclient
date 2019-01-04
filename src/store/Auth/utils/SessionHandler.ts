import { TokenGenerator, TokenBase } from 'ts-token-generator'
import ISession from '@/interfaces/ISession'

function generateToken(name: string, value: string, ...args: string[]): void {
  let cookie
  const tokgen = new TokenGenerator({
    bitSize: 512,
    baseEncoding: TokenBase.BASE62,
  })
  const token = tokgen.generate()
  cookie = name + '=' + value
  for (const propName of args) {
    cookie += '; ' + propName
  }

  document.cookie = cookie
}

class SessionHandler implements ISession {
  public token: string | null
  public cookie: string | null
  private tokgen = new TokenGenerator({
    bitSize: 512,
    baseEncoding: TokenBase.BASE62,
  })

  constructor() {
    this.token = null
    this.cookie = null
  }

  public init(): string {
    this.generateToken()
    return this.token as string
  }

  public generateToken(): void {
    const token = this.tokgen.generate()
    this.token = token
  }

  public setCookie(token: string): void {
    document.cookie = 'st' + '=' + token
  }

  public deleteCookie(): void {
    this.token = null
    document.cookie = 'st' + '=' + ''
  }

  public tryCatchToken(): string {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)st\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    )
    this.token = token
    return this.token
  }
}

export default new SessionHandler()
