import Vue from 'vue'
import Vuex, { Module } from 'vuex'
import SessionVuex from '@/store/modules/Session'
import ForumVuex from '@/store/modules/Forum'
import SubforumVuex from '@/store/modules/Subforum'
import { getModule, VuexModule } from 'vuex-module-decorators'
import ThemeVuex from '@/store/modules/Theme'
import PresenceVuex from '@/store/modules/Presence'
import WebsocketVuex from '@/store/modules/Websocket'
import MessagesVuex from '@/store/modules/Messages'
import ChatVuex from '@/store/modules/Chat'

Vue.use(Vuex)

type ModuleTypes =
  | typeof ThemeVuex
  | typeof ForumVuex
  | typeof SubforumVuex
  | typeof SessionVuex
  | typeof PresenceVuex
  | typeof WebsocketVuex
  | typeof MessagesVuex
  | typeof ChatVuex

export async function importModule(moduleName: string) {
  return import('@/store/modules/' + moduleName)
}

export default new Vuex.Store<ModuleTypes>({})
