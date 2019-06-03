<template lang='pug'>
    nav(id='nav')
      div(class='nav-content-wrapper')
        div(class='nav-links-wrapper text' v-if='!showSkeletonUI')
          router-link(to='/login' v-if='!isAuthed') 
            span Логин
            div(class='navlink-decor')
          router-link(to='/register' v-if='!isAuthed')
            span Регистрация
            div(class='navlink-decor')
          router-link(to='/forum' v-if='isAuthed')
            span(v-on:click='signout') Выйти
          router-link(to='/profile' v-if='isAuthed')
            span Профиль
            div(class='navlink-decor')
          router-link(to='/')  
            span Домашняя страница 
            div(class='navlink-decor')
          router-link(to='/forum')
            span Форум
            div(class='navlink-decor')
          router-link(to='/admin' v-if='accessLevel >= 7')
            span Админка
            div(class='navlink-decor')
      .bottom-bar
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Nav extends Vue {
  public showSkeletonUI: boolean = true
  public navContext: boolean = false

  @Watch('isAuthed')
  public $WatchAuth(isAuthed: boolean | null): void {
    if (isAuthed !== null) {
      this.showSkeletonUI = false
      this.navContext = isAuthed
    }
  }

  get isAuthed() {
    return this.$store.state.session.isAuthed
  }

  get accessLevel() {
    return this.$store.state.session.accessLevel
  }

  public signout(): void {
    this.$store.dispatch('session/SIGN_OUT', {})
  }
}
</script>

<style scoped lang="sass">
nav
  background: #1F1B34
  width: 100%
  position: relatrive
  z-index: 100

.bottom-bar
  width: 100%
  background: #19162C
  height: 30px

.nav-content-wrapper
  height: $nav-height
  margin: 0 auto
  width: 85%
  @media(max-width: 1024px)
    width: 100%

.router-link-exact-active
  .navlink-decor
    border: 2px solid #5584FF
    margin: 0 auto
    width: 30px
    position: relative
    bottom: -1em
    border-radius: 5px
    box-shadow: 0px 0px 15px -1px rgba(85,132,255,1)

.nav-links-wrapper
  width: 50%
  display: flex
  justify-content: space-around
  a
    padding-top: 2em
    color: white
    text-decoration: none
    underline: none
</style>