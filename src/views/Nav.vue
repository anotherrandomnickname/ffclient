<template lang='pug'>
    nav(id="nav")
      div(class='nav-links-wrapper text-subhead')
        router-link(to="/login" v-if='!isAuthed')  Логин 
        router-link(to="/register" v-if='!isAuthed')  Регистрация 
        router-link(to="/logout" v-if='isAuthed')  Выйти 
        router-link(to="/")  Домашняя страница 
        router-link(to="/about")  Форум 
        b(v-if='user') {{user.name}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Nav extends Vue {
  @Prop() private isAuthed!: boolean
  @Prop() private user!: any
}
</script>

<style lang="sass">
nav
  margin: 0
  padding: 0
  background: linear-gradient(90deg, rgba(207,217,223,1) 0%, rgba(226,235,240,1) 99%, rgba(226,235,240,1) 100%)
  border: 1px solid rgba(0, 0, 0, 0.2)
  width: 100%

.nav-links-wrapper
  margin: 0
  padding: 0
  display: flex
  width: 30%
  justify-content: space-between
  a
    text-decoration: none
    underline: none
</style>