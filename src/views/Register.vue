<template lang='pug'>
  .content
    .register-widget-wrapper
      h1(class='text-head widget-head') Регистрация
      .form-login-wrapper
        .submitted-placeholder(v-if='isSubmitted')
          p(class='text-head text-bright-theme text-submitted') Регистрация завершена! Пожалуйста, проверьте почтовый ящик
        form-placeholder(:onSubmit='handleSubmit' v-if='!isSubmitted')
          input-chan(title='Почтовый ящик' :err='email.err' type='email' v-model='email.value')
          input-chan(title='Пароль' :err='password.err' :middleware='[validatePassword, validatePassMatch]' type='password' v-model='password.value')
          input-chan(title='Повторите пароль' :err='passconf.err' :middleware='[validatePassMatch]' type='password' v-model='passconf.value')
          button-sama(classNames='button')
            span ОТПРАВИТЬ
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Input from '@/components/Input.vue'
import { MouseEvent } from '@/interfaces/_index'
import Validator from '@/store/utils/Validator'
import ErrorHandler from '@/store/utils/ErrorHandler'
import registerComponent, { register } from '@/components/register'

@Component({
  components: register(['form-placeholder', 'input-chan', 'button-sama']),
})
export default class Register extends Vue {
  public email: any = {
    value: '',
    err: '',
  }
  public password: any = {
    value: '',
    err: '',
  }
  public passconf: any = {
    value: '',
    err: '',
  }
  public isSubmitted: boolean = false

  public handleSubmit($event: MouseEvent): void {
    const isValidEmail = Validator.email(this.email.value)
    const isValidPass = Validator.password(this.password.value)
    const isValidPassConf = this.password.value === this.passconf.value

    console.log(isValidEmail)
    console.log(isValidPass)
    console.log(isValidPassConf)
    console.log('Hi', this.password.value, ' ', this.passconf.value)

    if (isValidEmail && isValidPass && isValidPassConf) {
      this.$store.dispatch('session/CREATE_USER', {
        pass: this.password.value,
        email: this.email.value,
      })
    } else {
      this.validatePassword(this.password.value)
      this.validatePassMatch(this.password.value)
    }
  }

  @Watch('errorResponse')
  public watchErrorResponse(res: number): void {
    if (res) {
      const status = this.errorResponse
      switch (status) {
        case 1:
          break
        case 33:
          this.email.err = 'Такая почта уже зарегистрирована'
          break
        default:
          break
      }
    }
  }

  @Watch('errorResponse')
  public watchRegSuccess(err: string): void {
    this.email.err = err
  }

  get errorResponse(): number {
    return this.$store.state.session.regError
  }

  @Watch('success')
  public $WatchSuccess(success: boolean): void {
    if (success) {
      console.log('YOU"RE AUTHORIZED!')
      this.$router.push({ name: 'forum', query: { redirect: '/forum' } })
    }
  }

  get success(): boolean {
    return this.$store.state.session.isFetched
  }

  public validatePassword(str: string): void {
    const res = Validator.password(str)
    this.password.err = res ? '' : 'Слабый пароль'
  }

  public validatePassMatch(str: string): void {
    console.log('STR', str)
    console.log('PASSWORD', this.password.value)
    if (this.password.value !== str && this.password.value.length >= 5) {
      this.passconf.err = 'Пароли должны совпадать'
    } else {
      this.passconf.err = ''
    }
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

.text-submitted
  grid-row-start: 2
  grid-row-end: 3
  grid-column-start: auto
  background: transparent
  margin: 0
  padding: 0

.submitted-placeholder
  display: grid
  grid-template-rows: 25% 50% 25%
  grid-template-columns: auto
  width: 100%
  height: 100%
  background: #19162C

.widget-head
  margin: 0
  padding: 0
  width: 100%
  text-align: center
  margin-top: 30px
  margin-bottom: 30px
</style>
