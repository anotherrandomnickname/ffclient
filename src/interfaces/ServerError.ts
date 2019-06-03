import { AxiosRequestConfig } from 'axios'

export default interface ServerError {
  config: AxiosRequestConfig
  code?: string
  request?: any
}

export function isServerError(object: any): object is ServerError {
  return 'config' in object
}
