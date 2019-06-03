<template lang='pug'>
  .content
    .forum-page-container
      div(v-for='forum in response.data' class='forum' :key='forum[0].section') 
        div(class='forum-description')
          div(class='palka-sama')
          div(class='forum-description-container') 
            p(class='text-head') {{forum[0].sectionName}}
        div(v-for='subforum in forum' class='subforum' :key='subforum.order')
          div(v-if='subforum.lastUsername' class='palka-sama')
          .subforum-image
          div(class='subforum-container')
            div(class='subforum-content')
              p(class='text-subhead')
                router-link(:to='`/forum/${subforum.fpk}`')
                  span {{subforum.forumName}}
              p(class='text')
                span {{subforum.forumDescription}}
            .total-posts
            .last-theme
              .last-user-avatar
                router-link(:to='`/profile/users/${subforum.lastUserPk}`' v-if='subforum.lastUsername')
                  img(v-if='subforum.lastUsername' src='https://images-na.ssl-images-amazon.com/images/I/51t9vmOHOZL._SX425_.jpg' class='user-av')
              .last-theme-info
                p
                  router-link(:to='`/forum/${subforum.fpk}-${subforum.lastTopicPk}`') 
                    span {{subforum.lastTopicName}}
                p
                  router-link(:to='`/profile/users/${subforum.lastUserPk}`' v-if='subforum.lastUsername') от 
                    span(:class='subforum.lu_css') {{subforum.lastUsername}}
                p {{compareDate(subforum.lastPostdate.baked)}}
      .sidebar
        .messages-container
          ul
            li(class='text text-bright-theme message' v-if='messages' v-for='message in refineMessages(messages)')
              span {{message}}
      .users-online
        .widget-header
          h1(class='text-subhead text-bright-theme') Пользователи онлайн
          .palka-sama
        .users-online-state
          div(class='users-online-list' v-if='usersOnline')
            span(v-for='(user, index) of usersOnline')
              router-link(:to='`/profile/users/${user.pk}/`' v-if='user !== null')
                span(v-if='user !== null' :class='user.css') {{user.name}}
                span(v-if='index !== usersOnline.length - 1 && user.name !== null') , 
      .chat-wrapper
        chat-kun

</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import axios from 'axios'
import Forum from '@/store/modules/Forum'
import Presence from '@/store/modules/Presence'
import Messages from '@/store/modules/Messages'
import * as firebase from 'firebase'
import store from '@/store/store'
import registerModule from '@/store/modules/register'
import { Route } from 'vue-router'
import registerComponent, { register } from '@/components/register'

/* fairy-db978 */

@Component({
  components: register(['chat-kun']),
})
export default class Ws extends Vue {
  beforeRouteEnter(to: any, from: any, next: any) {
    getModule(Forum)
    getModule(Presence)
    getModule(Messages)
    registerModule('presence')
    registerModule('messages')
    store.dispatch('forum/FETCH_FORUM_PAGE', {}).then(() => {
      next()
    })

    store.dispatch('messages/SUBSCRIBE', {})
    store.dispatch('presence/SUBSCRIBE', {})
  }

  public beforeRouteLeave(to: Route, from: Route, next: () => void) {
    console.log('UNSUBSCRIBED FROM WS')
    store.dispatch('messages/UNSUBSCRIBE', {})
    store.dispatch('presence/UNSUBSCRIBE', {})
    next()
  }

  public compareDate(val: string): string {
    return val
  }

  public refineMessages(messages: string[]): string[] {
    /* console.log('REFINE: ', messages) */
    let result: string[] = []
    for (let i = messages.length - 1; i > messages.length - 7; --i) {
      result.push(messages[i])
    }
    console.log('RESULT:', result)
    return result
  }

  @Watch('messages')
  public $WatchMessage(value: string[]): void {
    /* console.log('MESSAGES:', value) */
  }

  get messages() {
    return this.$store.state.messages.messageList
  }

  @Watch('usersOnline')
  public $WatchUsers(users: any): void {
    console.log('USERS ONLINE IN FORUM: ', users)
  }

  get usersOnline() {
    return this.$store.state.presence.onlineUsers
  }

  @Watch('isFetchingForum')
  public watchFetch(val: boolean): void {
    console.log('Is fetching?', val)
  }

  get isFetchingForum(): boolean {
    return this.$store.getters['forum/isFetchingGetter']
  }

  @Watch('isFetchedForum')
  public watchFetched(val: boolean): void {
    console.log('Is fetched?', val)
  }

  get isFetchedForum(): boolean {
    return this.$store.getters['forum/isFetchedGetter']
  }

  get response() {
    return this.$store.getters['forum/responseGetter']
  }
}
</script>

<style scoped lang='sass'>

.forum-page-container
  width: 85%
  margin: 0px auto
  padding-top: 100px
  min-height: 300px
  display: grid
  grid-template-rows: 200px auto 100px
  grid-template-columns: auto 30% 0px 400px
  grid-gap: 30px



.chat-wrapper
  grid-column-start: 4
  grid-column-end: 5
  grid-row-start: 1
  grid-row-end: 3
  background: #19162C

.forum
  /* border: 1px solid green */
  margin-bottom: .2em
  grid-column-start: 1
  grid-column-end: 3
  grid-row-start: 2
  grid-row-end: 3
  width: 100%

.sidebar
  grid-column-start: 1
  grid-column-end: 2
  display: flex
  flex-wrap: wrap

.users-online
  background: #19162C
  grid-column-start: 2
  grid-column-end: 3


.chat-messages-container
  display: block
  flex-wrap: wrap
  width: 100%
  min-height: 300px

.chat-message
  width: 100%
  display: flex
  border-bottom: 4px solid #151226
  &:first-of-type
    border-top: 4px solid #151226

.chat-message-info
  width: 25%
  display: grid

.chat-message-body
  width: 75%
  padding-top: .5em
  p
    text-align: left

.chat-nickname
  margin: 0

.chat-text
  margin: 0

.chat-user-av
  width: 60px
  height: 60px
  border-radius: 50%
  border: 2px inset rgba(218,53,53, .5)
  justify-self: center
  align-self: center

.messages-container
  width: 100%
  background: #151226
  border: 5px solid #1F1B34
  ul
    margin: 0
    padding: .3em
    text-decoration: none
    list-style-type: none

.message
  text-align: left
  font-size: .7em
  width: 100%
  background: #1F1B34
  margin-bottom: .5em
  padding: .5em 0 .5em
  span
    padding: 0 0 0 .5em 

.widget-header
  height: 70px
  width: 100%
  display: flex
  flex-wrap: nowrap
  h1
    line-height: 35px
    text-align: right
    margin-right: 1em
    width: 100%

.users-online-state
  width: 100%


.users-online-list
  width: 100%
  display: block
  text-align: left
  a
    text-decoration: none
    color: white

.palka-sama
  width: 0
  border: 3px solid #DA3535
  box-shadow: 0px 0px 50px 0px rgba(218,53,53,1)

.forum-description
  width: 100%
  display: flex
  justify-content: space-between
  height: 100px
  background: #1F1B34
  margin-bottom: .2em

.forum-description-container
  color: white
  text-align: left
  height: 100%
  width: 96%

.subforum
  background: #19162C
  height: 100px
  color: white
  margin-bottom: .2em
  display: flex

.subforum-container
  width: calc(100% - 3px - 125px)
  display: flex
  padding-top: 10px
  padding-bottom: 10px
  justify-content: space-between

.subforum-content
  display: flex
  width: 50%
  flex-wrap: wrap
  p
    text-align: left
    width: 100%
    margin: 0
    padding: 0
    &:first-of-type
      span
        cursor: pointer
    &:last-of-type
      line-height: 1em
    a
      text-decoration: none
      color: white

.total-posts
  height: 100%
  width: 100px

.last-theme
  height: 100%
  width: 300px
  display: flex
  flex-wrap: nowrap

.last-theme-info
  width: calc(100% - 80px)
  display: flex
  flex-wrap: wrap
  margin-left: 30px
  p
    white-space: nowrap
    margin: 0
    padding: 0
    text-align: left
    width: 100%
    a
      text-decoration: none
      color: white
    &:first-of-type
      span
        font-weight: bold
        color: #5584ff

.last-user-avatar
  width: 75px
  height: 100%

.user-av
  width: 60px
  height: 60px
  border-radius: 50%
  margin-top: 5px
  border: 2px inset rgba(218,53,53, .5)

.subforum-image
  width: 125px
  height: 100%
</style>