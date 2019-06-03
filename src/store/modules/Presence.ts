import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import vuexStore from '@/store/store'
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'
import { ServerResponse, ServerError } from '@/interfaces/_index'
import {
  RoleClass,
  AccessLevel,
  Groups,
  replaceClaimText,
  GroupClass,
  defineNicknameColor,
} from '@/store/utils/RoleClaims'
import Websocket from '@/store/modules/Websocket'

interface UserPresence {
  data: any
}

interface UsersOnline {
  accesslevel: number
  name: string
  css: string
  pk: number
  gender: number
}

@Module({ dynamic: true, store: vuexStore, name: 'presence', namespaced: true })
class Presence extends VuexModule {
  public onlineUsers: UsersOnline[] = []

  @Action
  public SUBSCRIBE(): void {
    console.log('SUBSCRIBED ON USER PRESENCE')
    Websocket.send(JSON.stringify({ action: 'SUBSCRIBE_ON_USER_PRESENCE' }))
  }

  @Action
  public UNSUBSCRIBE(): void {
    Websocket.send(
      JSON.stringify({
        action: 'UNSUBSCRIBE_FROM_USER_PRESENCE',
      }),
    )
  }

  @Action({ commit: 'MOUNT' })
  public RECEIVE_ONSUBSCRIBE(payload: { wsResponse: any }): UsersOnline[] {
    console.log('START USER PRESENCE FETCHING...', payload.wsResponse)
    return PresenceHandler.bake(payload.wsResponse)
  }

  @Action({ commit: 'ADD_ONLINE' })
  public RECEIVE_ONLINE(payload: { wsResponse: any }) {
    console.log('ADD ONLINE: ', payload)
    return payload.wsResponse
  }

  @Action({ commit: 'ADD_OFFLINE' })
  public RECEIVE_OFFLINE(payload: { wsResponse: any }) {
    console.log('RECEIVE OFFLINE: ', payload)
    console.log('CURRENT STATE: ', this.onlineUsers)
    return payload.wsResponse
  }

  @Mutation
  public ADD_ONLINE(data: UsersOnline): void {
    const newUser = PresenceHandler.bake(data)
    console.log('USERS ONLINE DATA: ', newUser)
    /* Array.prototype.push.apply(this.onlineUsers, newUser) */
    this.onlineUsers.push(...newUser)
    /* this.onlineUsers.push(newUser as UsersOnline) */
  }

  @Mutation
  public ADD_OFFLINE(offlineUserPk: string): void {
    console.log('USER IS OFFLINE: ', offlineUserPk)
    const offlineUserPkNum = parseInt(offlineUserPk, 10)

    this.onlineUsers = this.onlineUsers.filter((user: UsersOnline) => {
      console.log('USER IN FILTER: ', user)
      console.log('HE IS OFFLINE?', user.pk === offlineUserPkNum)
      console.log('USER PK: ', user.pk)
      console.log('OFFLINE PK: ', offlineUserPk)
      return user.pk !== offlineUserPkNum
    })
  }

  @Mutation
  public MOUNT(data: UsersOnline[]): void {
    console.log('MOUNTED DATA: ', data)
    this.onlineUsers = data
  }
}

class PresenceHandler {
  public static bake(response: any): UsersOnline[] {
    const serverResponse = response
    const users: UsersOnline[] = []

    console.log('FUCKING RESPONSE FROMFROM bake: ', response)

    Object.values(serverResponse).forEach((user: any, index: number) => {
      const preparedUser = PresenceHandler.prepare(user)
      users.push(preparedUser as UsersOnline)
    })

    console.log('BAKED USERS', users)
    return users
  }

  public static prepare(user: any): UsersOnline | null {
    if (user !== null) {
      const group = Groups[0]
      const accessLevel = user !== null ? user.accessLevel : 0
      const userRole = AccessLevel[accessLevel]
      console.log('USER IN PREPARE: ', accessLevel, userRole)
      console.log('USERR', user)
      const result: UsersOnline = {
        ...user,
        css: defineNicknameColor(
          accessLevel,
          userRole,
          GroupClass[group as keyof typeof GroupClass],
        ),
      }
      return result as UsersOnline
    }
    return null
  }
}

export default Presence
