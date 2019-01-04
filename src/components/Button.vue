<template lang='pug'>
    button(
            :class='[...$props.classNames]' 
            class='button text-head text-bright-theme' 
          	:type='$props.type'
          ) {{title}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Button extends Vue {
  @Prop() public title!: string | null
  @Prop({ default: '' })
  public classNames!: string[]
  @Prop({ default: 'submit' })
  public type!: string

  public mounted() {
    console.log(this.$props)
  }
}
</script>

<style scoped lang='sass'>
.button 
  cursor: pointer
  outline: none
  font: 20px
  width: 200px
  height: 50px
  border: 0
  background: #5584FF
  box-shadow: -0px -0px 50px -8px rgba(85,132,255,1)
  border-radius: 10px
  transition: all .1s
  /* &:active
    background: transparent
    border: 1px solid #5584FF
    box-shadow: none */
  &:hover
    background: transparent
    border: 1px solid #5584FF
    box-shadow: none

</style>

