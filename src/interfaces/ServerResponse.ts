import { AxiosResponse } from 'axios'

export default interface ServerResponse<S> {
  data?: S
  response?: any
  status: number
}

export function asServerResponse(object: AxiosResponse): ServerResponse<any> {
  return {
    data: object.data,
    status: object.status
  }
}
