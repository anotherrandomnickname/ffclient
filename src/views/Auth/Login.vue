<template lang='pug'>
  .register-widget-wrapper
    h1(class='text-head widget-head') Авторизация
    .form-login-wrapper
      form-placeholder(:onSubmit='handleSubmit')
            input-chan(title='Почтовый ящик' type='text' v-model='login')
            input-chan(title='Пароль' type='password' v-model='password')
            div(v-bind:class='{active: test}')
              button-sama(title='ОТПРАВИТЬ' classNames='button')
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ILogin from '@/interfaces/ILogin'

@Component
export default class Login extends Vue {
  public login: string
  public password: string
  public loading: string
  public interval: number

  constructor() {
    super()
    this.login = ''
    this.password = ''
    this.loading = 'Валидация'
    this.interval = 0
  }

  public test: boolean = false

  @Watch('isFetching')
  public watchFetch(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.interval = setInterval(() => {
        if (this.loading.length >= 12) {
          this.loading = 'Валидация'
        }
        this.loading = this.loading + '.'
      }, 300)
    } else {
      clearInterval(this.interval)
      this.loading = 'Валидация'
    }
  }

  get isFetching() {
    return this.$store.state.session.f.isFetching
  }

  @Watch('success')
  public $WatchSuccess(val: boolean): void {
    if (val) {
      this.$router.push({ path: '/about' })
    }
  }

  get success() {
    return this.$store.state.session.f.isFetched
  }

  get error() {
    return this.$store.state.session.err
  }

  public handleSubmit(e: Event): void {
    console.log('HANDLE HANDLE')
    this.test = !this.test
    this.$store.commit('INIT_SESSION', {
      login: this.login,
      password: this.password,
    })
    setTimeout(() => {
      this.test = false
    }, 200)
  }

  public beforeDestroy() {
    this.$store.commit('CLEAR_ERROR_HANDLER', null)
  }
}
</script>

<style scoped lang='sass'>
.register-widget-wrapper
  margin: 100px auto
  height: 350px
  width: 400px
.form-login-wrapper
  height: 225px
  border: 30px solid #19162C
  border-radius: 15px
  box-shadow: 0px -0px 50px -10px rgba(85,132,255,0.3)
  width: 400px


.bttn-placeholder

.active
  animation: wait .2s ease-out

@keyframes wait
  0%
    margin-left: 25px
  50%
    margin-right: 25px
  100%
</style>
