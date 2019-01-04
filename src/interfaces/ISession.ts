interface ISession {
  token: string | null
  cookie: string | null
  generateToken(): void
  tryCatchToken(): string
  deleteCookie(): void
  setCookie(token: string): void
  init(): string
}

export default ISession
