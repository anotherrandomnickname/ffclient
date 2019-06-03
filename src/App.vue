<template lang='pug'>
  div(id='app' v-bind:class='{ animate: !isLoading }')
    Loading(v-if='isLoading')
    Nav
    transition(name='fade')
      router-view
    Footer
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import Nav from '@/views/Nav.vue'
import Footer from '@/views/Footer.vue'
import Loading from '@/views/Loading.vue'
import store from '@/store/store'
import Session from '@/store/modules/Session'
import Websocket from '@/store/modules/Websocket'
import Messages from '@/store/modules/Messages'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
])

@Component({
  components: {
    Nav,
    Loading,
    Footer,
  },
})
export default class App extends Vue {
  public isLoading: boolean = false
  public created(): void {
    getModule(Session)
    getModule(Messages)
  }

  public mounted(): void {
    Websocket.onopen = () => {
      console.log('CONNECTED TO WEBSOCKET!')
    }
    this.$store.dispatch('session/REGISTER_SESSION_OBSERVER', {})
  }

  @Watch('isFetching')
  public $WatchSessionLogin(fetch: boolean): void {
    console.log('FATCH FETCH', fetch)
    if (fetch) {
      this.isLoading = false
    } else {
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    }
  }

  get isFetching() {
    if (!this.$store.state.session.isFetching) {
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    } else {
      return this.$store.state.session.isFetching
    }
  }
}
</script>

<style lang="sass">
.fade-enter-active, .fade-leave-active
  transition: opacity .5s


.fade-enter-active
  position: relative

.fade-leave-active
  position: absolute
  top: calc(4em + 30px)
  left: 0


.fade-enter-active
  animation: content-enter .5s ease-out

.fade-leave-active
  animation: content-leave .5s ease-out

.fade-leave-to
  opacity: 0

.fade-enter-to
  opacity: 1

@keyframes content-leave
  0%
    left: 0px
  100%
    left: -50%

@keyframes content-enter
  0%
    opacity: 0
    left: 100%
  100%
    opacity: 1
    left: 0

    
</style>
