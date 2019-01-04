import {
  IError,
  ILogin,
  IReg,
  IValidator,
  IUser,
  ServerResponse,
} from '@/interfaces/_index'
import axios, { AxiosResponse } from 'axios'

export interface AxiosPromise<T> extends Promise<AxiosResponse<T>> {
  data: T
}

export interface ServerResponse {
  data?: IUser
  error?: IError
}

export interface IAuthHandler {
  validator: IValidator
  fetchAuth(user: ILogin): Promise<ServerResponse>
  fetchTokenAuth(token: string): Promise<ServerResponse>
  fetchReg(user: IReg): Promise<ServerResponse>
  fetchLogout(token: string): Promise<ServerResponse>
}
