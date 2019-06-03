<template lang="pug">
  .content
    div(class='subforum-page-container' v-if='response.status !== 0')
      div(class='subforum-header')
        div(class='subforum-header-text')
          p(class='text-head') {{response.data.forumName}}
          p(class='text-subhead') {{response.data.forumDesc}}
        .subforum-control-panel
          .cp-button-wrapper
            button-sama(@click.native='openModal()' v-if='session.accessLevel >= 2')
              span создать
      .subforum-themes-container
        div(v-for='theme in response.data.data' class='theme')
          .palka-sama
          .desc-and-name
            router-link(:to='`/forum/${response.data.pk}/th-${theme.pk}-1`')
              h1(class='text-subhead link') {{theme.topicName}}
            p(class='text') {{theme.description}}
          .total-answers
            h1(class='text-subhead') Ответов
            div(class='total total-marked') {{theme.totalPosts}}
          .total-watches
            h1(class='text-subhead') Просмотров
            div(class='total total-marked') {{theme.totalViews}}
          .ts
            h1(class='text-subhead') Создатель
            div(class='total') 
              router-link(:to='`/profile/users/${theme.tsPk}`') 
                span(class='text' :class='theme.tsUserClaim') {{theme.tsName}}
          .last
            img(src='https://images-na.ssl-images-amazon.com/images/I/51t9vmOHOZL._SX425_.jpg' class='user-av last-userpic')
            h1(class='text-subhead last-head') Последнее
            p(class='text last-text') {{theme.lastPostdate.baked}} 
              span от 
              router-link(:to='`/profile/users/${theme.lastUserPk}`')
                span(:class='theme.lastUserClaim' class='text') {{theme.lastUsername}}
    modal-kun(:onClose='closeModal' :modalProp='{id: "createthemeid", submitfunc: () => {}}' v-if='modalTextEditor' )
      template(slot-scope='props')
        form-placeholder(:onSubmit='handleSubmit')
          input-chan(title='Название')
          input-chan(title='Описание')
          text-editor-san(:props='props')
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { getModule } from 'vuex-module-decorators'
import SubforumModule from '@/store/modules/Subforum'
import store from '@/store/store'
import registerComponent, { register } from '@/components/register'

@Component({
  components: register(['button-sama', 'modal-kun', 'text-editor-san', 'input-chan', 'form-placeholder']),
})
export default class Subforum extends Vue {

  public themeModel = {
    name: '',
    description: '',
    topicBody: ''
  }

  public modalTextEditor: boolean = true

  public handleSubmit(event: Event) {
    let formValues: string[] = []
    console.log('CREATE THEME SUBMIT VAL: ', formValues)
    console.log('OUR SESSION: ', this.session)
    for(let i = 0; i < 3; i++) {
      formValues.push(event.srcElement[i].value)
    }

    if(this.session.accessLevel >= 2) {
      this.$store.dispatch('subforum/CREATE_NEW_THEME', {
        name: formValues[0],
        description: formValues[1],
        body: formValues[2],
        userpk: this.session.user.pk,
        fid: parseInt(this.$route.params.id, 10),
      })
    }
  }

  beforeRouteEnter(to: Route, from: Route, next: () => any) {
    getModule(SubforumModule)
    store
      .dispatch('subforum/FETCH_SUBFORUM_THEMES', { id: to.params.id })
      .then(() => {
        next()
      })
  }

  public closeModal(): void {
    this.modalTextEditor = false
  }

  public openModal(): void {
    this.modalTextEditor = true
  }

  @Watch('response')
  public $WatchResponse(val: any) {
    console.log('VALLL?', val)
  }

  get session() {
    return this.$store.getters['session/responseGetter']
  }

  get response() {
    return this.$store.state.subforum.response
  }
}
</script>

<style lang="sass" scoped>

.user-av
  width: 40px
  height: 40px
  border-radius: 50%
  border: 2px inset rgba(218,53,53, .5)


@mixin local-grid-template
  display: grid
  grid-template-columns: auto
  grid-template-rows: 50% 50%

@mixin local-grid($loc)
  grid-row-start: $loc
  grid-row-end: $loc + 1
  grid-column-start: 1
  grid-column-end: 2



.last
  width: 15em
  display: grid
  grid-template-columns: 100px auto
  grid-template-rows: 40% 60%

.last-userpic
  place-self: center end
  grid-column-start: 1
  grid-column-end: 2
  grid-row-start: 1
  grid-row-end: 3

.last-head
  grid-column-start: 2
  grid-column-end: 3
  grid-row-start: 1
  grid-row-end: 2

.last-text
  grid-column-start: 2
  grid-column-end: 3
  grid-row-start: 2
  grid-row-end: 3

.subforum-page-container
  width: 85%
  margin: 0px auto
  padding-top: 175px
  min-height: 300px
  color: white

.palka-sama
  width: 0
  border: 3px solid #DA3535
  box-shadow: 0px 0px 50px 0px rgba(218,53,53,1)


a
  text-decoration: none
  .link
    color: #DA3535
    cursor: pointer
    text-decoration: none
    &:hover
      text-decoration: underline

.subforum-header
  text-align: left
  background: #1F1B34
  display: grid
  grid-template-columns: 50% 50%


.subforum-control-panel
  width: 100%
  display: flex
  justify-content: flex-end

.cp-button-wrapper
  padding-top: 25px
  padding-right: 25px

.subforum-header-text
  margin-left: 2em
  p
    margin: 0
    padding-top: .5em
    &:last-of-type
      padding-bottom: .5em

.subforum-themes-container
  margin-top: .2em
  width: 100%
  background: #19162C

.theme
  padding-bottom: 2px
  height: 75px
  display: flex
  width: 100%
  justify-content: space-between
  transition: all .3s
  background: #19162C
  &:hover
    transform: scale(1.03)
    box-shadow: 10px 10px 20px -8px rgba(0,0,0,0.4)
  p
    margin: 0
    padding: 0


.total
  border-radius: 50px
  width: 70%
  height: 65%
  justify-self: center
  align-self: start
  line-height: 25px

.total-marked
  background: #1F1B34

.desc-and-name,
.total-answers,
.total-watches,
.ts
  @include local-grid-template

.desc-and-name,
.total-answers,
.total-watches,
.ts,
  h1
    margin: 0
  .text
    padding-top: 0px

.last
  h1
    margin: 0

.desc-and-name
  
  width: 30%
  a
    @include local-grid(1)
  p
    @include local-grid(2)

.total-answers, .total-watches
  p
    &:first-of-type
      @include local-grid(1)
    &:last-of-type
      @include local-grid(2)

.ts
  p
    @include local-grid(1)
  a
    @include local-grid(2)
</style>

