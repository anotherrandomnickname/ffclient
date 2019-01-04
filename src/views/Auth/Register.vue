<template lang='pug'>
  .register-widget-wrapper
    h1(class='text-head widget-head') Регистрация
    .form-login-wrapper
      .submitted-placeholder(v-if='isSubmitted')
        p(class='text-head text-bright-theme text-submitted') Регистрация завершена! Пожалуйста, проверьте почтовый ящик
      form-placeholder(:onSubmit='handleSubmit' v-if='!isSubmitted')
        input-chan(title='Логин' :err='login.err' :middleware='[validateLogin]' type='text' v-model='login.value')
        input-chan(title='Почтовый ящик' :err='email.err' type='email' v-model='email.value')
        input-chan(title='Пароль' :err='password.err' :middleware='[validatePassword, validatePassMatch]' type='password' v-model='password.value')
        input-chan(title='Повторите пароль' :err='passconf.err' :middleware='[validatePassMatch]' type='password' v-model='passconf.value')
        button-sama(title='ОТПРАВИТЬ' classNames='button')
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Input from '@/components/Input.vue'
import { MouseEvent, IReg } from '@/interfaces/_index'
import Validator from '@/store/Auth/utils/Validator'
import ErrorHandler from '@/store/Auth/utils/ErrorHandler'

@Component
export default class Register extends Vue {
  public email: any = {
    value: '',
    err: '',
  }
  public login: any = {
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
    const submit: IReg = {
      login: this.login.value,
      email: this.email.value,
      pass: this.password.value,
    }

    const isValidLogin: boolean | string = Validator.login(submit.login)
    const isValidEmail = Validator.email(submit.email)
    const isValidPass = Validator.password(submit.pass)
    const isValidPassConf = submit.pass === this.passconf.value ? true : false

    if (
      <boolean>isValidLogin === true &&
      isValidEmail &&
      isValidPass &&
      isValidPassConf
    ) {
      this.$store.commit('HANDLE_REGISTER', submit)
    } else {
      this.validatePassword(submit.pass)
      this.validateLogin(submit.login)
      this.validatePassMatch(submit.pass)
    }
  }

  @Watch('errorResponse')
  public watchErrorResponse(res: number): void {
    if (res) {
      const status = this.errorResponse
      switch (status) {
        case 1:
          break
        case 21:
          this.login.err = 'Пользователь с таким именем уже существует'
          break
        case 33:
          this.email.err = 'Такая почта уже зарегистрирована'
          break
        case 34:
          this.login.err = 'Необрабатываемая ошибка. Попробуйте еще раз!'
          break
        default:
          break
      }
    }
  }

  @Watch('regSuccess')
  public watchRegSuccess(flag: boolean): void {
    if (flag) {
      this.isSubmitted = true
    } else {
      this.isSubmitted = false
    }
  }

  get regSuccess(): boolean {
    return this.$store.state.session.isReg
  }

  get errorResponse(): number {
    return this.$store.state.session.regError
  }

  public validatePassword(str: string): void {
    const res = Validator.password(str)
    if (!res) {
      this.password.err = 'Слабый пароль'
    } else {
      this.password.err = ''
    }
  }

  public validatePassMatch(str: string): void {
    if (this.password.value !== str && this.password.value.length >= 5) {
      this.passconf.err = 'Пароли должны совпадать'
    } else {
      this.passconf.err = ''
    }
  }

  public validateLogin(str: string): void {
    const res = Validator.login(str)
    if (res !== true) {
      this.login.err = res
    } else {
      this.login.err = ''
    }
  }
}
</script>

<style lang='sass'>
.register-widget-wrapper
  margin: 100px auto
  height: 450px
  width: 400px
.form-login-wrapper
  height: 450px
  border: 30px solid #19162C
  border-radius: 15px
  box-shadow: 0px -0px 50px -10px rgba(85,132,255,0.3)
  width: 400px

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
  text-align: center
  margin-left: 50px
</style>
