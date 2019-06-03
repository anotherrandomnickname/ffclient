import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import vuexStore from '@/store/store'
import { isModuleRegistered, ModulesOptions } from '@/store/modules/register'

const PRESENCE: ModulesOptions = 'presence'
const MESSAGES: ModulesOptions = 'messages'
const CHAT: ModulesOptions = 'chat'

const MESSAGES_ONSUBSCRIBE: string = 'messages'
const NEW_MESSAGE_NOTIFY: string = 'new_message'

const PRESENCE_ONSUBSCRIBE: string = 'user_presence'
const PRESENCE_ONLINE_NOTIFY: string = 'user_is_online'
const PRESENCE_OFFLINE_NOTIFY: string = 'user_is_offline'

const CHAT_ONSUBSCRIBE: string = 'chat'
const NEW_CHAT_MESSAGE_NOTIFY: string = 'new_chat_message'

const websocket = new WebSocket('ws://127.0.0.1:7777/')

websocket.onmessage = (event: any) => {
  const response = JSON.parse(event.data)
  const eventType: ModulesOptions = response.type
  const wsResponse = response.data
  console.log('DATA FROM WEBSOCKET:', wsResponse)
  console.log('EVENT TYPE: ', eventType)

  switch (eventType) {
    case PRESENCE_ONSUBSCRIBE:
      if (isModuleRegistered(PRESENCE)) {
        vuexStore.dispatch('presence/RECEIVE_ONSUBSCRIBE', { wsResponse })
      }
      break
    case PRESENCE_ONLINE_NOTIFY:
      if (isModuleRegistered(PRESENCE)) {
        vuexStore.dispatch('presence/RECEIVE_ONLINE', { wsResponse })
      }
      break
    case PRESENCE_OFFLINE_NOTIFY:
      if (isModuleRegistered(PRESENCE)) {
        vuexStore.dispatch('presence/RECEIVE_OFFLINE', { wsResponse })
      }
      break
    case MESSAGES_ONSUBSCRIBE:
      if (isModuleRegistered(MESSAGES)) {
        vuexStore.dispatch('messages/RECEIVE_ONSUBSCRIBE', { wsResponse })
      }
      break
    case NEW_MESSAGE_NOTIFY:
      if (isModuleRegistered(MESSAGES)) {
        vuexStore.dispatch('messages/RECEIVE', { wsResponse })
      }
      break
    case CHAT_ONSUBSCRIBE:
      if (isModuleRegistered(CHAT)) {
        vuexStore.dispatch('chat/RECEIVE_ONSUBSCRIBE', { wsResponse })
      }
      break
    case NEW_CHAT_MESSAGE_NOTIFY:
      if (isModuleRegistered(CHAT)) {
        vuexStore.dispatch('chat/RECEIVE', { wsResponse })
      }
      break
    default:
      break
  }
}

export default websocket
