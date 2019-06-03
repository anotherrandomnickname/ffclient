<template lang='pug'>
  div(class='chat')
    div(class='chat-header')
      h1(class='text-subhead text-bright-theme') Чат
      div(class='palka-sama')
    div(class='chat-body')
      div(class='chat-message' v-for='message in messages')
        div(class='chat-userinfo')
          router-link(:to='`/profile/users/${message.user.pk}/`')
            img(src='https://images-na.ssl-images-amazon.com/images/I/51t9vmOHOZL._SX425_.jpg' class='chat-user-av last-userpic')
        div(class='chat-content')
          p(class='text chat-text text-bright-theme')
            span(:class='message.user.type') {{message.user.name}}
            br
            span {{message.message}}
    div(class='chat-input')
      textarea(class='text text-bright-theme' v-if='session' v-model='msg' id='chat-input' @focus='addChatKeyboardEvent' @blur='removeChatKeyboardEvent')
      button-chan(@click.native='sendMessage')
        span Отправить
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import registerComponent, { register } from '@/components/register'
import { getModule } from 'vuex-module-decorators'
import registerModule from '@/store/modules/register'
import ChatModule from '@/store/modules/Chat'

@Component({
  components: register(['button-chan']),
})
export default class Chat extends Vue {
  public msg = ''

  public created(): void {
    getModule(ChatModule)
    registerModule('chat')
    this.$store.dispatch('chat/SUBSCRIBE', {})
  }

  public beforeDestroy() {
    this.removeChatKeyboardEvent()
    this.$store.dispatch('chat/UNSUBSCRIBE', {})
  }

  public sendMessage(): void {
    console.log('MESSAGE: ', this.msg)
    this.$store.dispatch('chat/TRANSMIT', {
      message: this.msg,
      user: {
        pk: this.session.user.pk,
        name: this.session.user.name,
        type: this.session.type,
      },
    })
    this.msg = ''
  }

  public chatKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.shiftKey === false) {
      this.sendMessage()
    }
  }

  public addChatKeyboardEvent(): void {
    document.addEventListener('keydown', this.chatKeyboardEvent)
  }

  public removeChatKeyboardEvent(): void {
    document.removeEventListener('keydown', this.chatKeyboardEvent)
  }

  @Watch('messages')
  public $WatchMessages(messages: any): void {
    console.log('MESSAGES IS: ', messages)
  }

  get messages(): any {
    console.log('CHAT IS: ', this.$store.state.chat)
    return this.$store.state.chat.chatList
  }

  @Watch('session')
  public $WatchUser(user: any): void {
    console.log('USER IS: ', user)
  }

  get session(): any {
    return this.$store.state.session.session
  }
}
</script>

<style lang='sass'>

.chat
  display: grid
  grid-template-columns: auto
  grid-template-rows: 55px auto 130px
  height: 100%


.chat-body
  grid-row-start: 2
  grid-row-end: 3
  overflow: auto

.chat-message
  display: flex
  justify-content: flex-start
  margin-top: 10px

.chat-content
  background: #1F1B34
  padding: 0 10px 0 10px
  text-align: left
  border-top-left-radius: 5px
  border-top-right-radius: 5px
  margin-left: 7px
  position: relative
  &:before
    content: ''
    position: absolute
    float: bottom
    width: 0
    height: 0
    border-left: 10px solid transparent
    border-right: 7px solid #1F1B34
    border-top: 10px solid transparent
    border-bottom: 10px solid #1F1B34
    left: -12px
    bottom: 0

.chat-userinfo
  width: 65px
  display: grid

.chat-user-av
  position: relative
  top: 5px
  width: 40px
  height: 40px
  border-radius: 50%
  border: 2px inset rgba(218,53,53, .5)
  align-self: end
  justify-self: center

.chat-text
  margin: 5px
  word-wrap: break-word
  overflow-wrap: break-word
  word-break: break-all

.chat-input
  grid-row-start: 3
  grid-row-end: 4
  border: 0
  display: flex
  flex-wrap: wrap
  justify-content: center
  position: relative
  textarea
    background: #1F1B34
    width: 100%
    height: 50px
    resize: none
    padding: 1em
  button
    position: absolute
    z-index: 1000
    height: 30px
    bottom: 10px

.palka-sama
  width: 0
  border: 3px solid #DA3535
  box-shadow: 0px 0px 50px 0px rgba(218,53,53,1)

.chat-header
  grid-row-start: 1
  grid-row-end: 2
  width: 100%
  display: flex
  flex-wrap: nowrap
  h1
    margin-right: 20px
    width: 100%
    text-align: right



</style>