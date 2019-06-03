<template lang='pug'>
  .content
    div.edit-profile(v-if='currentProps.pk')
      form-placeholder(:onSubmit='handleSubmit')
        input-chan(title='Имя:' :contentProp='currentProps.name')
        input-chan(title='URL аватарки' :contentProp='checkAvatarExistance(currentProps.photourl)')
        input(type='radio' name='gender' id='genderMale' value=1 v-model='gender')
        label.text.text-bright-theme(for='genderMale') Мужчина
        input(type='radio' name='gender' id='genderFemale' value=2 v-model='gender')
        label.text.text-bright-theme(for='genderFemale') Женщина
        input(type='radio' name='gender' id='genderOther' value=3 v-model='gender')
        label.text.text-bright-theme(for='genderOther') Другое
        button-sama
          span НАХУЙ!
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import registerComponent, { register } from '@/components/register'
import { Route } from 'vue-router'

@Component({
  components: register(['input-chan', 'button-sama', 'form-placeholder']),
  name: 'edit-profile'
})
export default class EditProfile extends Vue {
  @Prop({ default: null })
  public currentProps!: any
  @Prop({ default: false })
  public isEditRights!: boolean
  public gender: number = 0

  public handleSubmit(event: Event): void {
    const inputValues: string = []
    for(let i = 0; i < 2; i++) {
      const inputValue = event.srcElement[i].value
      inputValues.push(inputValue)
    }

    this.$store.dispatch('profile/UPDATE_PROFILE', {
      name: inputValues[0],
      photourl: inputValues[1],
      gender: this.gender
    })
  }


  public checkAvatarExistance(photourl: null | string) {
    if (photourl) {
      return photourl
    } else {
      return ''
    }
  }

  public created() {
    console.log('VMVMVMVM', this.currentProps)
    this.gender = this.currentProps.gender
    if(!this.isEditRights) {
      this.$router.go(-1)
    }
  }
  /* changeProfileUserData():  */
}
</script>