import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import * as firebase from 'firebase'
import './registerServiceWorker'

Vue.config.productionTip = false

const config = {
  apiKey: 'AIzaSyAME59BCbXhN1JvlM_dz7bcqgc8QveKocA',
  authDomain: 'fairy-db978.firebaseapp.com',
  databaseURL: 'https://fairy-db978.firebaseio.com',
  projectId: 'fairy-db978',
  storageBucket: 'fairy-db978.appspot.com',
  messagingSenderId: '429653183723',
}

firebase.initializeApp(config)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
