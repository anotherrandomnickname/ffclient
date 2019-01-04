<template lang='pug'>
  div(id='app' v-bind:class='{ animate: !isLoading }')
    Loading(v-if='isLoading')
    Nav(:isAuthed='this.isAuthed' :user='this.user')
    router-view
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Nav from '@/views/Nav.vue'
import Loading from '@/views/Loading.vue'

@Component({
  components: {
    Nav,
    Loading,
  },
})
export default class App extends Vue {
  public isLoading: boolean = false

  constructor() {
    super()
  }
  get isAuthed() {
    return this.$store.state.session.f.isFetched
  }

  get user() {
    return this.$store.state.session.user
  }

  public beforeCreate(): void {
    this.$store.commit('INIT_TOKEN_SESSION', {})
  }

  public mounted(): void {
    setTimeout(() => {
      this.isLoading = false
    }, 10000)
  }
}
</script>

<style scoped lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background: -webkit-linear-gradient(360deg,#030303 10%,#1f1f1f 360%)
  background-blend-mode: multiply
  text-align: center
  color: #2c3e50
  opacity: 1

.animate
  animation: app-loaded-animate .5s ease-out

@keyframes app-loaded-animate
  0%
    opacity: 0
  100%
    opacity: 1

    
</style>
