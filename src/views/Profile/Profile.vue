<template lang='pug'>
  .content
    .text-bright-theme
      img.user-av(:src='handleNonExistAvatar(currentProps.photourl)')
      p.text Имя: {{currentProps.name}}
      p.text Пол: {{currentProps.gender}}
      p.text Статус: {{currentProps.is_online}}
      p.text Количество постов: {{currentProps.total_posts}}
      button-sama(v-if='isEditRights')
        router-link(to='/profile/edit')
          span ИЗМЕНИТЬ
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import registerComponent, { register } from '@/components/register'

@Component({
  components: register(['button-sama']),
  name: 'profile-main'
})
export default class ProfileMain extends Vue {
  @Prop({ default: null })
  public currentProps!: any
  @Prop({ default: false })
  public isEditRights!: boolean

  @Watch('currentProps')
  public $WatchProps(props: any) {
    console.log('PROPS213: ', props)
  }

  handleNonExistAvatar(url: string) {
    if(url) {
      return url
    } else {
      return 'https://images-na.ssl-images-amazon.com/images/I/51t9vmOHOZL._SX425_.jpg'
    }
  }

  
}
</script>

<style lang='sass'>
.user-av
  max-width: 125px
  max-height: 125px
  border: 2px inset rgba(218,53,53, .5)
  border-radius: 50%
</style>