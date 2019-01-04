import Vue from 'vue'
import Vuex from 'vuex'
import Login from './Auth/Login'
import Session from './Auth/Session'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    session: Session,
  },
})
