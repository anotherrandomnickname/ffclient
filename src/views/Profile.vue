<template lang='pug'>
  .content
    main.profile
      component(v-bind:is='currentView' :isEditRights='isEditRights' :currentProps='currentProps')
      


</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { getModule } from 'vuex-module-decorators'
import ProfileModule from '@/store/modules/Profile'
import store from '@/store/store'
import registerComponent, { register } from '@/components/register'
import registerModule from '@/store/modules/register'
import EditProfile from './Profile/EditProfile.vue'

function loadView(name: string, filename: string) {
  Vue.component(name, () =>
    import(/* webpackChunkName: "view-[request]" */ `./Profile/${filename}.vue`),
  )
}

function profileRouter(payload: {path: string, name: string}): string {
  const { path, name } = payload
  console.log('PAYLOAD', payload)
  if(path === 'edit' && name === 'userprofile') {
    loadView('edit-profile', 'EditProfile')
    return 'edit-profile'
  } else if(path === undefined && name === 'userprofile') {
    loadView('profile-main', 'Profile')
    return 'profile-main'
  } else {
    loadView('profile-main', 'Profile')
    return 'profile-main'
  }
}

@Component
export default class Profile extends Vue {
  public waitAuth: boolean = false
  public showSkeletonUI: boolean = false
  public currentView: string = ''
  public currentProps: any = ''
  public isEditRights: boolean = false

  beforeRouteEnter(to: Route, from: Route, next: (vm?: any) => any): void {
    getModule(ProfileModule)
    registerModule('profile')
    const currentComponent = profileRouter({path: to.params.path, name: to.name!})
    if (to.name === 'userprofile') {
      console.log('PATH', to)
      const session = store.getters['session/responseGetter']
      const isAuthed = store.getters['session/isAuthedGetter']
      if (isAuthed === null) {
        next((vm: any) => {
          vm.waitAuth = true
          vm.currentView = currentComponent
          return vm
        })
      } else if (isAuthed === false) {
        console.log('NOT AUTHED!!')
        next('/login')
      } else if (isAuthed === true) {
        console.log('IS AUTHED!!')
        store.dispatch('profile/FETCH_CURRENT_USER_PROFILE', {})
        next((vm: any) => {
          vm.currentView = currentComponent
          vm.isEditRights = true
          vm.showSkeletonUI = true
        })
      }
    } else {
      const isActiveSession = store.getters['session/responseGetter'].user ? true : false
      if(isActiveSession) {
        let userpk = store.getters['session/responseGetter'].user.pk
        let requestedUserPk = parseInt(to.params.pk, 10)
        if(userpk === requestedUserPk) {
          next((vm: any) => {
            vm.redirectToOwnProfile()
          })
        } else if (userpk !== requestedUserPk) {
          store.dispatch('profile/FETCH_USER_PROFILE', { pk: to.params.pk })
          next((vm: any) => {
          vm.currentView = currentComponent
          vm.showSkeletonUI = true
        })
        }
      } else {
        next((vm: any) => {
          vm.waitAuth = true
          vm.currentView = currentComponent
          return vm
        })
      }
    }
  }

  public redirectToOwnProfile(): void {
    this.$router.push({ name: 'userprofile' })
  }

  @Watch('isAuthed', {immediate: true})
  public $WatchAuth(isAuthed: boolean, pk?: number): void {
    console.log('REDIRECT TO LOGIN AND', this.$route)
    let userpk = this.isAuthed ? store.getters['session/responseGetter'].user.pk : null
    let requestedPk = this.$route.params.pk ? parseInt(this.$route.params.pk) : null
    console.log('AND USERPK IS', this.waitAuth, this.$route.name === 'profile', userpk === requestedPk)
    if (this.waitAuth && this.isAuthed && this.$route.name === 'userprofile') {
      store.dispatch('profile/FETCH_CURRENT_USER_PROFILE', {})
      this.waitAuth = false
      this.showSkeletonUI = true
      this.isEditRights = true
    } else if (this.waitAuth && isAuthed === false && this.$route.name === 'userprofile') {
      console.log('lolwhat')
      this.$router.push({ name: 'login', params: { path: 'profile' } })
    } else if (this.$route.name === 'profile' && userpk !== requestedPk) {
      console.log('FETCH USER PROFILE')
      store.dispatch('profile/FETCH_USER_PROFILE', { pk: this.$route.params.pk})
      this.waitAuth = false
    } else if (this.waitAuth && this.$route.name === 'profile' && userpk === requestedPk) {
      this.waitAuth = false
      this.redirectToOwnProfile()
    } else {
      console.log('WHATT')
    }
  }

  @Watch('profile')
  public $WatchUser(user: any): void {
    if (user !== null){ 
      console.log('OHOHOO', user)
      this.currentProps = user
    }
  }

  @Watch('userprofile')
  public $WatchUserProfile(userprofile: any): void {
    if(userprofile && this.$route.name === 'profile') {
      this.currentProps = userprofile
      this.isEditRights = false
    }
  }

  @Watch('errorCode')
  public $WatchError(error: number | null): void {
    if(error === 404) {
      this.$router.push({ name: 'forum' })
    }
  }

  get errorCode(): any {
    return this.$store.state.profile.errorCode
  }


  get userprofile(): any {
    return this.$store.state.profile.userprofile
  }

  get profile(): any {
    return this.$store.state.profile.profile
  }

  get isAuthed(): boolean | null {
    return this.$store.state.session.isAuthed
  }

  get currentViewComponent(): any {
    return 'view-' + this.currentView.toLowerCase()
  }
}
</script>

<style lang='sass'>

.profile
  margin: 100px auto
  width: 80%
  min-height: 75vh
  background: #19162C


</style>