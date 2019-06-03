import { TokenGenerator, TokenBase } from 'ts-token-generator'

class CookieHandler {
  private tokgen = new TokenGenerator({
    bitSize: 512,
    baseEncoding: TokenBase.BASE62,
  })

  public createCtrf(): string {
    const token = this.tokgen.generate()
    return this.setCookie(token)
  }

  public setCookie(token: string): string {
    document.cookie = 'ctrf' + '=' + token + '; path=/'
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)ctrf\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    )
  }

  public deleteCookie(): void {
    document.cookie =
      'ctrf' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
  }
}

export default new CookieHandler()
