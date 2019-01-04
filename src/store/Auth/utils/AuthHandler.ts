import {
  IValidator,
  IAuthHandler,
  ILogin,
  IError,
  IReg,
  AxiosPromise,
  IUser,
  ServerResponse,
} from '@/interfaces/_index'
import Validator from './Validator'
import axios, { AxiosResponse } from 'axios'
import Axios from 'axios'

class AuthHandler implements IAuthHandler {
  public validator: IValidator = Validator

  public async fetchAuth(user: ILogin): Promise<ServerResponse> {
    console.log('START!')
    let isValidLogin
    let isValidPassword
    let error: IError | null = null

    try {
      isValidLogin = this.validator.login(user.login)
      isValidPassword = this.validator.password(user.password)
      if (!isValidLogin) {
        error = { isError: true, msg: 'Невалидный логин' }
      }
      if (!isValidPassword) {
        error = {
          isError: true,
          msg: 'Пароль должен содержать как минимум 6 символов',
        }
      }

      if (error as IError) {
        return await new Promise<Promise<any>>(() => {
          return error as IError
        })
      }
    } catch (e) {
      error = {
        isError: true,
        msg: 'Упс, что-то пошло не так. Попробуйте позже!',
      }
      if (error as IError) {
        return await new Promise<Promise<any>>(() => {
          return error as IError
        })
      }
    }

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Method': 'POST',
      },
    }

    console.log(JSON.stringify(user))

    return await axios
      .post('http://localhost:8010/login', user)
      .then((res) /* AxiosResponse<IUser> */ => {
        let data: IError | IUser
        res.data.error
          ? (data = { isError: true, msg: res.data.error })
          : (data = {
              name: res.data.name,
              email: res.data.email,
              token: res.data.token,
            })
        return data
      })
      .catch(err => {
        return err
      })
  }

  public async fetchTokenAuth(token: string): Promise<ServerResponse> {
    console.log('TOKEN AUTH')
    return await axios
      .post('http://localhost:8010/logintoken', { token })
      .then(res => {
        let data: IError | IUser
        console.log('RESS!', res)
        res.data.error
          ? (data = { isError: true, msg: res.data.error })
          : (data = {
              name: res.data.name,
              email: res.data.email,
              token: res.data.token,
            })
        return data
      })
      .catch((err: any) => {
        return err
      })
  }

  public async fetchLogout(token: string): Promise<ServerResponse> {
    return await axios
      .post('http://localhost:8010/logout', { token })
      .then(res => {
        const { status } = res.data
        return status
      })
      .catch(err => {
        return err
      })
  }

  public async fetchReg(user: IReg): Promise<ServerResponse> {
    return await axios
      .post('http://localhost:8010/register', user)
      .then(res => {
        console.log(res)
        return res
      })
      .catch(err => {
        return err
      })
  }
}

export default new AuthHandler()
