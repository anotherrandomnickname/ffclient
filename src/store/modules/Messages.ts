import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import vuexStore from '@/store/store'
import Websocket from '@/store/modules/Websocket'
import * as firebase from 'firebase'

type messageTypes = 'registration'

const REGISTER: messageTypes = 'registration'

interface Message {
  post: string
}

@Module({ dynamic: true, store: vuexStore, name: 'messages', namespaced: true })
export default class Messages extends VuexModule {
  public messageList: Message[] = []

  @Action
  public SUBSCRIBE(): void {
    Websocket.send(JSON.stringify({ action: 'SUBSCRIBE_ON_MESSAGES' }))
  }

  @Action
  public UNSUBSCRIBE(): void {
    Websocket.send(JSON.stringify({ action: 'UNSUBSCRIBE_FROM_MESSAGES' }))
  }

  @Action({ commit: 'MOUNT' })
  public RECEIVE_ONSUBSCRIBE(payload: { wsResponse: any }): Message[] {
    const { wsResponse } = payload
    const state: Message[] = []

    /* Check if null values exists. Temporal method */
    Object.values(wsResponse).forEach((value: any, index: number) => {
      if (value !== null) {
        state.push(value.post)
      }
    })
    return state
  }

  @Action({ commit: 'ADMIT' })
  public RECEIVE(payload: { wsResponse: any }): Message {
    const { wsResponse } = payload
    /* console.log('ADMIN PAYLOAD', payload) */
    const state = wsResponse.post
    return state
  }

  @Action
  public TRANSMIT_MESSAGE(payload: {
    type: messageTypes
    args: string[]
  }): void {
    const message = MessagesList.getMessageByType(payload.type, ...payload.args)
    firebase
      .database()
      .ref('/messages/')
      .push({ post: message })
  }

  @Mutation
  public MOUNT(messages: Message[]): void {
    const newState = messages.slice(0, -1)
    /* console.log('SLICED STATE:', newState) */
    this.messageList = newState
  }

  @Mutation
  public ADMIT(newMessage: Message): void {
    /* console.log('NEWE MESSAGE: ', newMessage) */
    if (newMessage !== undefined) {
      this.messageList.push(newMessage)
    }
    /* console.log('MESSAGES LIST IN RESULT:', this.messageList) */
  }
}

class MessagesList {
  public static getMessageByType(
    type: string,
    ...args: string[]
  ): string | null {
    switch (type) {
      case REGISTER:
        const conditionalArgs = args.join(' ')
        return (
          'Повый пользователь зарегистрировался! Приветствуем ' +
          conditionalArgs
        )
      default:
        return null
    }
  }
}
