import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import SessionHandler from '@/store/Auth/utils/SessionHandler'
import AuthHandler from '@/store/Auth/utils/AuthHandler'
import {
  ILogin,
  ISession,
  IError,
  IValidator,
  IReg,
  IAuthHandler,
  IFetch,
  IUser,
  AxiosPromise,
  ServerResponse,
} from '@/interfaces/_index'
import { DefineError } from '@/store/Auth/utils/ErrorHandler'
import axios, { AxiosResponse } from 'axios'

@Module
export default class Session extends VuexModule {
  public s: ISession = SessionHandler
  public user: IUser | null = null
  public err: IError = {
    isError: false,
    msg: '',
  }
  public f: IFetch = {
    isFetching: false,
    isFetched: false,
  }
  public isReg: boolean = false
  public regError: number | null = null
  public auth: IAuthHandler = AuthHandler

  constructor(props: any) {
    super(props)
  }

  @Mutation
  public async INIT_SESSION(payload: any, ...args: string[]) {
    const form: ILogin = {
      login: payload.login,
      password: payload.password,
      token: this.s.init(),
    }
    this.f.isFetching = true
    await this.auth
      .fetchAuth(form)
      .then((data: any) => {
        if (data.isError) {
          this.f.isFetched = false
          console.log(data)
          this.err = {
            isError: true,
            msg: DefineError(data.msg),
          }
        } else {
          console.log(data)
          this.s.setCookie(form.token)
          this.user = data
          this.f.isFetched = true
        }
        this.f.isFetching = false
      })
      .catch((err: any) => {
        this.err = err
        this.f.isFetching = false
      })
  }

  @Mutation
  public async INIT_TOKEN_SESSION(): Promise<void> {
    console.log('COOKIE', document.cookie)
    const token: string = this.s.tryCatchToken()
    if (token) {
      this.f.isFetching = true
      this.auth
        .fetchTokenAuth(token)
        .then((data: any) => {
          console.log(data)
          if (data.isError) {
            this.err = data
          }
          if (data.name !== 'Error') {
            console.log(data.name)
            this.user = data
            this.f.isFetched = true
          } else {
            this.err = {
              isError: true,
              msg: 'Ошибка доступа к серверу. Повторите позже.',
            }
          }
          this.f.isFetching = false
        })
        .catch((err: any) => {
          console.log('err', err)
          this.err = err
          this.f.isFetching = false
        })
    }
  }

  @Mutation
  public CLEAR_ERROR_HANDLER(): void {
    this.err = {
      isError: false,
      msg: '',
    }
  }

  @Mutation
  public async DISCARD_SESSION(): Promise<void> {
    this.f.isFetched = false
    const token: string = this.s.tryCatchToken()
    this.user = null
    this.f.isFetched = false

    await this.auth.fetchLogout(token).then((status: any) => {
      this.s.deleteCookie()
    })
  }

  @Mutation
  public async HANDLE_REGISTER(
    payload: IReg,
    ...args: string[]
  ): Promise<void> {
    this.f.isFetching = true
    this.auth.fetchReg(payload).then((res: any) => {
      this.f.isFetching = false
      if (res.data.status === 1) {
        this.isReg = true
      } else {
        console.log('ERROR!!')
        console.log(res.data.status)
        this.regError = null
        setTimeout(() => {
          this.regError = res.data.status
        }, 100)
      }
    })
  }
}
