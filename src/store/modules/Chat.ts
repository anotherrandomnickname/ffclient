import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import * as firebase from 'firebase'
import Websocket from '@/store/modules/Websocket'
import vuexStore from '@/store/store'
import { AccessLevel } from '@/store/utils/RoleClaims'

interface ChatUser {
  pk: number
  name: string
  accessLevel: AccessLevel
}

interface ChatMessage {
  post: string
  date: Date
  user: ChatUser
}

interface WebsocketVuexModule<T> {
  SUBSCRIBE(): void
  UNSUBSCRIBE(): void
  RECEIVE_ONSUBSCRIBE(payload: { wsResponse: any }): T[]
  RECEIVE(payload: { wsResponse: any }): T
  TRANSMIT?(payload: any): void
  MOUNT(state: T[]): void
  ADMIT(state: T): void
}

@Module({ dynamic: true, store: vuexStore, name: 'chat', namespaced: true })
export default class Chat extends VuexModule
  implements WebsocketVuexModule<ChatMessage> {
  public chatList: ChatMessage[] = []

  @Action
  public SUBSCRIBE(): void {
    Websocket.send(JSON.stringify({ action: 'SUBSCRIBE_ON_CHAT' }))
    console.log('SUBSCRIBED!')
  }

  @Action
  public UNSUBSCRIBE(): void {
    Websocket.send(JSON.stringify({ action: 'UNSUBSCRIBE_FROM_CHAT' }))
    console.log('UNSUBSCRIBED!')
  }

  @Action({ commit: 'MOUNT' })
  public RECEIVE_ONSUBSCRIBE(payload: { wsResponse: any }): ChatMessage[] {
    const { wsResponse } = payload
    const state: ChatMessage[] = []

    Object.values(wsResponse).forEach((value: any, index: number) => {
      if (value !== null) {
        state.push(value)
      }
    })
    return state
  }

  @Action({ commit: 'ADMIT' })
  public RECEIVE(payload: { wsResponse: any }): ChatMessage {
    return payload.wsResponse
  }

  @Action
  public TRANSMIT(
    payload: {
      message: string
      user: { pk: number; name: string; accessLevel: number }
    },
    date = firebase.database.ServerValue.TIMESTAMP,
  ): void {
    firebase
      .database()
      .ref('/chat/')
      .push({ ...payload, date })
  }

  @Mutation
  public MOUNT(state: ChatMessage[]): void {
    console.log('MOUNTED:', state)
    this.chatList = state
  }

  @Mutation
  public ADMIT(state: ChatMessage): void {
    console.log('ADMITTED:', state)
    this.chatList.push(state)
  }
}
