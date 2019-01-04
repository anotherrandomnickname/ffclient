import Vue from 'vue'
import App from './App.vue'
import Button from '@/components/Button.vue'
import Form from '@/components/Form.vue'
import Input from '@/components/Input.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.component('button-sama', Button)
Vue.component('form-placeholder', Form)
Vue.component('input-chan', Input)

new Vue({
  components: {
    'button-sama': Button,
    'form-placeholder': Form,
    'input-chan': Input,
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
