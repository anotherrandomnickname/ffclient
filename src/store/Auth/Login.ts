import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import ILogin from '@/interfaces/ILogin'
import IError from '@/interfaces/IError'
import axios from 'axios'

function validateLogin(login: ILogin) {
  const regxpLogin = new RegExp('[a-zA-Z][a-zA-Z0-9.-_$@*!]{3,30}$')
  const isValid = regxpLogin.test(login.login)
  return isValid
}

@Module
export default class Login extends VuexModule {
  public isFetching = false
  public isFetched = false
  public user = ''
  public error: IError = {
    isError: false,
    msg: '',
  }

  public validateLogin(login: ILogin) {
    return true
  }

  @Mutation
  public async FETCH_LOGIN_FORM(login: ILogin) {
    const isValid = validateLogin(login)
    if (isValid) {
      console.log('valid!')
      this.error.isError = false
      this.isFetching = true

      return await axios.get('http://localhost:8010/').then(res => {
        if (res.data.err) {
          this.error = {
            isError: true,
            msg: res.data.err,
          }
        } else {
          setTimeout(() => {
            this.isFetching = false
            this.isFetched = true
            this.user = res.data.user
          }, 1000)
        }

        return res
      })
    } else {
      this.error = {
        isError: true,
        msg: 'Вы ввели неправильный логин и/или пароль',
      }
    }
  }

  @Mutation
  public HANDLE_LOGOUT(): void {
    const { isFetching, isFetched } = this

    if (this.isFetching) {
      return
    }

    if (isFetched) {
      this.isFetched = false
      this.user = ''
      this.error = {
        isError: false,
        msg: '',
      }
    }
  }

  @Mutation
  public CLEAR_ERROR_HANDLER(): void {
    this.error = {
      isError: false,
      msg: '',
    }
  }
}
