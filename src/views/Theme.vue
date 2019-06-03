<template lang='pug'>
  .content
    div(class='theme-page-container' v-if='!showSkeletonUI')
      div(class='header')
        h1(class='text-head') {{response.data.topic_name}}
        p(class='text-subhead text-bright-theme') {{response.data.topic_description}}
        .pages
          div(v-for='page in refinePages(response.data.topic_total_posts)') 
            router-link(:to='`/forum/1/th-${response.data.pk}-${page}`' v-if='Number.isInteger(page)')
              span {{page}} 
      .post
        .user-info-placeholder
          img(src='https://images-na.ssl-images-amazon.com/images/I/51t9vmOHOZL._SX425_.jpg' class='user-av')
          .user-info-container
            .user-info
              p(:class='response.data.ts_css') {{response.data.ts_name}}
              p(:class='response.data.ts_css') {{response.data.ts_role}}
              p(class='noguild') {{response.data.ts_group}}
              p(class='noguild') {{response.data.ts_current_title}}
            div(class='icons')
              img(src='@/assets/castle.svg')
              img(src='@/assets/knight.svg')
              img(src='@/assets/dragon.svg')
              img(src='@/assets/castle.svg')
        .post-body
          .post-date
            img(src='@/assets/writing.svg' v-on:click='openModalUpdateTheme()' v-if='user.user.pk === response.data.ts_pk || showAdminUI')
            img(src='@/assets/rubbish-bin.svg' v-on:click='deleteTheme()' v-if='user.user.pk === response.data.ts_pk || showAdminUI')
            p(class='offline') {{response.data.ts_is_online ? 'Online' : 'Offline'}}
            p(class='noguild') {{response.data.ts_group}}
            .small-buttons
              button-chan
                span Награды
              button-chan
                span Список титулов
            p Cообщений {{response.data.ts_total_posts}}
            p {{response.data.created_on.baked}}
          div(class='theme-post' v-html='response.data.topic_body')
          .under-post
            .medals
              img(src='@/assets/medal.svg')
              img(src='@/assets/medal.svg')
              img(src='@/assets/medal.svg')
              img(src='@/assets/medal.svg')
            .likes
              p Мне нравится
              img(src='@/assets/like.svg')
              p 0
      div(class='post' v-for='post in response.data.data')
        .user-info-placeholder
          img(src='https://images-na.ssl-images-amazon.com/images/I/51t9vmOHOZL._SX425_.jpg' class='user-av')
          .user-info-container
            .user-info
              p(:class='post.user_css' class='user-info-p1') {{post.user_name}}
              p(:class='post.user_css' class='user-info-p2') {{post.user_role}}
              p(class='noguild' class='user-info-p3') {{post.user_group}}
              p(class='noguild' class='user-info-p4') No details yet
            div(class='icons')
              img(src='@/assets/castle.svg')
              img(src='@/assets/knight.svg')
              img(src='@/assets/dragon.svg')
              img(src='@/assets/castle.svg')
        .post-body
          .post-date
            .post-date-left-container
              img(src='@/assets/writing.svg' v-if='user.user.pk === post.user_pk || showAdminUI' v-on:click='openModal(post.post_body, post.post_pk)')
              img(src='@/assets/rubbish-bin.svg' v-if='user.user.pk === post.user_pk || showAdminUI' v-on:click='deletePost(post.post_pk)')
              p(:class='addUserStatusClass(post.user_is_online)') {{post.user_is_online ? 'Online' : 'Offline'}}
              p(class='noguild' v-if='post.user_current_title') {{post.user_current_title}}
            .post-date-right-container
              p Cообщений {{post.user_posts}}
              p {{post.post_date.baked}}
          div(class='theme-post' v-html='processPost(post.post_body)')
          .under-post
            .small-buttons
              button-chan
                span Награды
              button-chan
                span Список титулов
            .medals
              img(src='@/assets/medal.svg')
              img(src='@/assets/medal.svg')
              img(src='@/assets/medal.svg')
              img(src='@/assets/medal.svg')
            .likes
              p Мне нравится
              img(src='@/assets/like.svg')
              p {{post.post_likes}}
      div(class='text-editor-theme' v-if='accessLevel >= 2')
        .text-editor-header
          h1(class='text-head') Написать сообщение
          div(class='post-preview' v-if='isPreviewed' v-html='processPost(previewPost)')
          button-chan(@click.native='textcodes')
            span Разметка
          button-chan(@click.native='openPreview' v-if='!isPreviewed')
            span Превью
          button-chan(@click.native='closePreview' v-if='isPreviewed')
            span Закрыть превью
        text-editor-san(:props = "{submitfunc: createPost, postState: postCreatedSwitcher, id: 'editor', listener: previewListener}")
          .button-sama-wrapper
            button-sama(@click.native='submit')
              span НАХУЙ


    div(v-if='showSkeletonUI' class='theme-page-container')
      div(class='header header-skeleton')
      div(class='post' v-for='post in 5')
          .user-info-placeholder
            div(class='user-av-skeleton user-av')
            .user-info-container
              .user-info
                p(class='text-skeleton')
                p(class='text-skeleton')
                p(class='text-skeleton')
                p(class='text-skeleton')
              div(class='icons')
                .icons-skeleton
                .icons-skeleton
                .icons-skeleton
          .post-body
            .post-date
              .small-buttons
                button(class='skeleton-button')
                button(class='skeleton-button')
            div(class='theme-post' v-html='post.post_body')


    modal-kun(:onClose='closeModal' :modalProp='{modalTextProp: modalTextProp, submitfunc: updatePost}'  v-if='modalTextEditor')
      template(slot-scope="props")
        text-editor-san(:props='props')

    modal-kun(:onClose='closeModalUpdateTheme' :modalProp='{modalTextProp: modalTextThemeUpdateProp, id: "updatethemeid", submitfunc: () => {}}' v-if='modalUpdateThemeEditor' )
      template(slot-scope='props')
        form-placeholder(:onSubmit='handleSubmitUpdateTheme')
          input-chan(title='Название' :contentProp='response.data.topic_name')
          input-chan(title='Описание' :contentProp='response.data.topic_description')
          text-editor-san(:props='props')
</template>


<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import store, { importModule } from '@/store/store'
import registerComponent, { register } from '@/components/register'
import xbbcode from '@/components/xbbcode'
import Parser from '@/store/utils/Parser'

interface AccessPolicy {
  sessionAccessLevel: number
  accessRules: number
  specificSessionAccessLevel?: number[]
  specificSessionAccess?: number
}

@Component({
  components: register([
    'button-chan',
    'button-sama',
    'text-editor-san',
    'modal-kun',
    'input-chan',
    'form-placeholder'
  ]),
})
export default class Theme extends Vue {
  public PERMANENT_DISABLE: boolean = true
  public modalTextEditor: boolean = false
  public modalUpdateThemeEditor: boolean = false
  public modalTextProp: { post: string; pk: number } = {
    post: '',
    pk: 0,
  }
  public modalTextThemeUpdateProp: {post: string, pk: number} = {
    post: 'dasdasdas',
    pk: 0
  }
  public isPreviewed: boolean = false
  public previewPost: string = ''
  public showSkeletonUI: boolean = true
  public showAdminUI: boolean = false
  public postCreatedSwitcher: boolean = false
  public watched: AccessPolicy = {
    sessionAccessLevel: 0,
    specificSessionAccess: 0,
    accessRules: 0,
  }

  public processPost(post: string): string {
    return Parser.process(post)
  }

  public addUserStatusClass(userOnlineStatus: boolean): string {
    if(userOnlineStatus) {
      return 'online'
    } else {
      return 'offline'
    }
  }

  public closeModalUpdateTheme() {
    this.modalUpdateThemeEditor = false
  }

  public openModalUpdateTheme() {
    this.modalUpdateThemeEditor = true
  }

  public handleSubmitUpdateTheme(event: Event) {
    const inputValues: string[] = []

    for(let i = 0; i < 3; i++) {
      const inputValue = event.srcElement[i].value
      inputValues.push(inputValue)
    }
    console.log(this.$route.params)

    this.$store.dispatch('theme/UPDATE_THEME', {
      body: inputValues[2],
      name: inputValues[0],
      description: inputValues[1],
      pk: parseInt(this.$route.params.id, 10),
    })
  }

  public beforeRouteEnter(to: Route, from: Route, next: any) {
    importModule('Theme').then(() => {
      store.dispatch('theme/FETCH', {
        id: to.params.id,
        page: to.params.page,
      })
      next((vm: any) => {
        vm.showSkeletonUI = true
      })
    })
  }

  public openPreview(): void {
    /* let editor: HTMLTextAreaElement = document.getElementById(
      'editor',
    ) as HTMLTextAreaElement
    this.previewPost = editor.value */
    this.isPreviewed = true
  }

  public closePreview(): void {
    this.isPreviewed = false
  }

  public previewListener(val: string): void {
    this.previewPost = val
    console.log('VALUE FROM THEME.VUE!', val)
  }

  public textcodes(): void {
    let textComponent: HTMLTextAreaElement = document.getElementById(
      'editor',
    ) as HTMLTextAreaElement
    let selectedText
    let docsel = document.getSelection()
    if (textComponent.selectionStart !== undefined) {
      // Standards Compliant Version
      var startPos: any = textComponent.selectionStart
      var endPos: any = textComponent.selectionEnd
      selectedText = textComponent.value.substring(startPos, endPos)
    }

    alert('You selected: ' + selectedText)
  }

  public beforeRouteUpdate(to: Route, from: Route, next: any) {
    /* this.showSkeletonUI = true */
    const requestedPage: number = parseInt(to.params.page, 10)
    const totalPages =
      this.response.topic_total_posts === null
        ? 0
        : this.response.topic_total_posts
    let params: { id: string; page: string }
    if (requestedPage <= totalPages) {
      params = {
        id: to.params.id,
        page: to.params.page,
      }
    } else {
      params = {
        id: to.params.id,
        page: '1',
      }
    }
    store.dispatch('theme/FETCH', params)
    next()
  }

  public openModal(post: string, pk: number): void {
    this.modalTextEditor = true
    this.modalTextProp.post = post
    this.modalTextProp.pk = pk
  }

  public closeModal(): void {
    this.modalTextEditor = false
  }

  public refinePages(totalPosts: number): any {
    let currentPage = parseInt(this.$route.params.page, 10)
    let displayed: any[] = []
    console.log('TOTAL POSTS', totalPosts)
    const pages: number = Math.ceil(totalPosts / 15)

    if (currentPage < 3) {
      for (let i = 0; i < pages; i++) displayed.push(i + 1)
      if (pages >= 4) {
        displayed.push('...')
        displayed.push(pages)
      }
    } else if (currentPage >= 3 && currentPage + 2 < pages) {
      if (currentPage !== 3) {
        displayed.push(1)
        displayed.push('...')
      }
      for (let i = currentPage; i < currentPage + 5; i++) {
        displayed.push(i - 2)
      }
      if (currentPage + 3 !== pages) displayed.push('...')
      displayed.push(pages)
    } else {
      displayed.push(1)
      if (currentPage + 3 !== pages) displayed.push('...')
      for (let i = currentPage; i < pages + 3; i++) {
        displayed.push(i - 2)
      }
    }

    return displayed
  }

  @Watch('watched', { immediate: true, deep: true })
  public $WatchAccess(accessPolicy: any): void {
    let grantSpecificAccess: boolean = false
    const {
      sessionAccessLevel,
      specificSessionAccess,
      accessRules,
    } = accessPolicy

    if (this.specificAccessLevel) {
      for (let access of this.specificAccessLevel) {
        if (access === specificSessionAccess) grantSpecificAccess = true
      }
    }

    if (sessionAccessLevel >= 6 || grantSpecificAccess) {
      this.showAdminUI = true
    } else if (sessionAccessLevel >= accessRules) {
    } else {
      console.log('SESSION ACCESS LEVEL', sessionAccessLevel)
      this.$router.go(-1)
    }
  }

  public deleteTheme() {
    if(confirm('Точно хотите удалить тему? Обратного пути нет!')) {
      console.log(this.$route.params)
      const { fid, id } = this.$route.params
      this.$store.dispatch('theme/DELETE_THEME', {
        forumId: parseInt(fid, 10),
        themeId: parseInt(id, 10)
      })
    }
  }

  public createPost(payload: { post: string }) {
    let content = payload.post
    let element = document.createElement('div')
    element.innerHTML = content
    let postContent = element.textContent || element.innerText || ''
    if (postContent.length >= 10) {
      console.log('SUBMITTED!')
      this.$store.dispatch('theme/CREATE_POST', {
        post: payload.post,
        tid: this.$route.params.id,
        page: this.$route.params.page,
        fid: this.$route.params.fid,
      })
    }
  }

  public updatePost(payload: { post: string }) {
    console.log('UPDATED POST', payload.post)
    this.$store.dispatch('theme/UPDATE_POST', {
      ppk: this.modalTextProp.pk,
      post: payload.post,
      id: this.$route.params.id,
      page: this.$route.params.page,
    })
  }

  public deletePost(pk: number) {
    if (confirm('Точно хотите удалить?')) {
      this.$store.dispatch('theme/DELETE_POST', {
        pk,
        tid: this.$route.params.id,
        page: this.$route.params.page,
        fid: this.$route.params.fid,
      })
    }
  }

  @Watch('isFetched')
  public $WatchFetch(isFetched: boolean): void {
    /* this.showSkeletonUI = !isFetched */

    console.log('isFETCHED?', isFetched)
    if (isFetched) {
      this.showSkeletonUI = false
    }
  }

  @Watch('isFetching')
  public $WatchFetching(isFetching: boolean): void {}

  @Watch('postCreatedState')
  public $WatchPostCreatedState(postCreated: boolean): void {
    if (postCreated) {
      this.$store.commit('theme/MOUNT_POST_CREATED_STATE', { success: false })
    }
    setTimeout(() => (this.postCreatedSwitcher = postCreated), 100)
  }

  @Watch('accessLevel', { immediate: true })
  public $WatchAccessLevel(accessLevel: number): void {
    console.log('ACCESS LEVEL:', accessLevel)
    this.watched.sessionAccessLevel = accessLevel
  }

  @Watch('response', {immediate: true})
  public $WatchResponse(response: any): void {
    console.log('RRRESPONSE!!!!', response.data.topic_body)
    if(response.status === 200) {
        this.modalTextThemeUpdateProp = {
        post: response.data.topic_body,
        pk: response.data.pk
      }
    }
  }

  get postCreatedState(): boolean {
    return this.$store.state.theme.postCreated
  }

  get response(): any {
    return this.$store.state.theme.response
  }

  get isFetched(): boolean {
    return this.$store.state.theme.isFetched
  }

  get isFetching(): boolean {
    return this.$store.state.theme.isFetching
  }

  get user() {
    return this.$store.getters['session/responseGetter']
  }

  get accessLevel() {
    return this.$store.state.session.session.accessLevel
  }

  get specificAccessLevel(): number[] {
    return this.$store.getters['session/specificAccessLevelGetter']
  }

  get accessRules(): number {
    return this.$store.getters['theme/accessRulesGetter']
  }
}
</script>

<style lang='sass' scoped>

.personal-spoiler


$admin-color: #FFD300
$user-color: white
$moder-color: white
$user-color: white
$guild-fairy-color: rgba(198, 147, 242, 1)
$noguild-color: white 

.offline
  color: red !important

.online
  color: green !important

.admin
  color: $admin-color
  font-weight: bold

.post-preview
  color: white
  width: 100%
  height: 300px
  background: #130d26
  margin-bottom: 10px

.role-admin

.guild-fairy-tail

.title-test

.noguild
  color: lightgrey


.pages
  display: flex
  flex-wrap: nowrap
  width: 97%
  justify-content: flex-end
  padding-top: 30px
  a
    color: white
    text-decoration: none
  div
    margin-left: .5em
    color: white
  .router-link-exact-active
    color: red !important

.header-skeleton
  height: 100px

.skeleton-button
  border: 0
  background: #1F1B34
  width: 100px
  outline: none 

.user-av-skeleton
  min-width: 125px !important
  min-height: 125px !important
  background: #1F1B34
  border: 0 !important

.icons-skeleton
  width: 50px
  height: 50px
  background: #151226
  margin: .3em

.text-skeleton
  background: #1F1B34
  min-width: 100px


.text-editor-theme
  border: 0px solid #1F1B34
  margin-top: 1em

.text-editor-header
  background: #1F1B34
  text-align: left
  padding: .5em
  margin: 0


.small-buttons
  display: flex
  flex-wrap: nowrap
  justify-content: space-around
  padding: .5em
  button
    margin-left: .5em

.button-chan
  height: 50%
  

.header
  height: 100px
  text-align: left
  background: #1F1B34
  margin-bottom: 1em
  display: grid
  grid-template-columns: 50% 50%
  grid-template-rows: 50% 50%
  h1
    grid-column-start: 1
    grid-column-end: 2
    grid-row-start: 1
    grid-row-end: 2
  p
    grid-column-start: 1
    grid-column-end: 2
    grid-row-start: 2
    grid-row-end: 3
  .pages
    grid-column-start: 2
    grid-column-end: 3
    grid-row-start: 2
    grid-row-end: 3

.subforum-header-text
  margin-left: 2em
  p
    color: white
    margin: 0
    padding-top: .5em
    &:last-of-type
      padding-bottom: .5em

.icons
  display: flex
  flex-wrap: nowrap
  justify-content: space-around

.theme-page-container
  width: 80%
  min-height: 100%
  margin: 0 auto
  padding-top: 175px

.post
  width: 100%
  min-height: 450px
  background: #1F1B34
  display: grid
  grid-template-rows: auto
  grid-template-columns: 225px auto

.post-body
  background: #130d26
  border: 5px solid #1F1B34
  border-left: 0px
  grid-row-start: 1
  grid-row-end: 2
  grid-column-start: 2
  grid-column-end: 3
  color: white
  font-family: 'RobotoMedium'
  text-align: left
  display: grid
  grid-template-columns: auto
  grid-template-rows: 3em auto auto

.theme-post
  padding: 1em
  border-top: 2px solid #1F1B34
  grid-row-start: 2
  grid-row-end: 3
  grid-column-start: 1
  grid-column-end: 2
  border-bottom: 2px solid #1F1B34
  min-height: 300px

.under-post
  grid-column-start: 1
  grid-column-end: 2
  grid-row-start: 3
  grid-row-end: 4
  display: flex
  justify-content: flex-end
  min-height: 50px

.post-date
  grid-row-start: 1
  grid-row-end: 2
  grid-column-start: 1
  grid-column-end: 2
  width: 100%
  display: flex
  justify-content: space-between
  p
    margin: 0
    text-align: right
    padding: 1em

.post-date-left-container
  display: flex
  flex-wrap: nowrap
  width: 49%
  justify-content: flex-start
  padding-left: 1em

.post-date-right-container
  display: flex
  flex-wrap: nowrap
  width: 49%
  justify-content: flex-end
  p
    white-space: nowrap


.user-info-placeholder
  grid-rows-start: 1
  grid-rows-end: 2
  grid-column-start: 1
  grid-column-end: 2
  display: grid
  grid-template-rows: 35% 65%
  grid-template-columns: auto
  background: #151226
  border: 5px solid #1F1B34
  max-height: 450px

.user-info-container
  grid-rows-start: 2
  grid-rows-end: 3
  grid-column-start: 1
  grid-column-end: 3
  width: 90%
  height: 90%
  background: #1F1B34
  justify-self: center
  align-self: center
  display: flex
  flex-wrap: wrap
  justify-content: space-around
  display: grid
  grid-template-rows: 70% 30%
  grid-template-columns: auto



.user-info
  display: grid
  grid-template-rows: 20% 20% 20% 20% 20%
  grid-template-columns: auto
  grid-rows-start: 1
  grid-rows-end: 2
  grid-column-start: 1
  grid-column-end: 2
  p
    align-self: center
    min-height: 20px
    padding: auto
    margin: 3px auto
    background: #151226
    width: 90%

.user-info-p1
  grid-rows-start: 1
  grid-rows-end: 2

.user-info-p2
  grid-rows-start: 2
  grid-rows-end: 3

.user-info-p3
  grid-rows-start: 3
  grid-rows-end: 4

.user-info-p4
  grid-rows-start: 4
  grid-rows-end: 5

.user-info-p5
  grid-rows-start: 4
  grid-rows-end: 5


.user-av
  max-width: 125px
  max-height: 125px
  border: 2px inset rgba(218,53,53, .5)
  border-radius: 50%
  justify-self: center
  align-self: center
  grid-rows-start: 1
  grid-rows-end: 2
  grid-column-start: 1
  grid-column-end: 3


.medals
  width: 300px
  display: flex
  flex-wrap: nowrap
  justify-content: space-around
.likes
  /* background: red */
  display: flex
  flex-wrap: nowrap
  justify-content: flex-end
  width: calc(60%)
  p
    margin-left: 1em
    &:last-of-type
      margin-right: 1em
  img
    margin-left: 1em
</style>