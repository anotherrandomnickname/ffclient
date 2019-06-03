<template lang='pug'>
  .content
    .register-widget-wrapper
      h1(class='text-head widget-head') Авторизация
      .form-login-wrapper
        form-placeholder(:onSubmit='handleSubmit')
          input-chan(title='Почтовый ящик' type='text' v-model='email')
          input-chan(title='Пароль' :err='errMsg' type='password' v-model='password')
          button-sama(classNames='button')
            span ОТПРАВИТЬ
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Validator from '@/store/utils/Validator'
import registerComponent, { register } from '@/components/register'

@Component({
  components: register(['form-placeholder', 'input-chan', 'button-sama']),
})
export default class Login extends Vue {
  public email: string = ''
  public password: string = ''
  public errMsg: string = ''

  @Watch('isFetching')
  public watchFetch(val: boolean): void {}

  get isFetching() {
    return this.$store.state.session.isFetching
  }

  @Watch('success')
  public $WatchSuccess(val: boolean): void {
    if (val) {
      this.$router.push({ name: 'forum', query: { redirect: '/forum' } })
    }
  }

  get success() {
    return this.$store.state.session.isFetched
  }

  @Watch('error')
  public $WatchError(val: string | null) {
    if (val as string) {
      this.errMsg = val as string
    }
  }

  get error() {
    return this.$store.state.session.error
  }

  public handleSubmit(e: Event): void {
    this.errMsg = ''
    if (Validator.email(this.email) && Validator.password(this.password)) {
      this.$store.dispatch('session/SIGN_IN', {
        email: this.email,
        password: this.password,
      })
    } else {
      this.errMsg = 'Проверьте правильность ввода данных'
    }
  }

  public destroyed(): void {
    this.errMsg = ''
    this.$store.commit('session/CLEAR_ERROR_HANDLER', {})
  }
}
</script>

<style scoped lang='sass'>
.register-widget-wrapper
  margin: 0px auto
  padding-top: 100px
  width: 480px
.form-login-wrapper
  padding: 80px
  background: #1F1B34
  /* border: 60px solid #1A122C */
  border-radius: 15px
  /* box-shadow: 0px -0px 50px -10px rgba(85,132,255,0.3) */
  margin: 0 auto


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
