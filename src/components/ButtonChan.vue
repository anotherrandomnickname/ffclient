<template lang='pug'>
  button(
    :class='[$props.color]' 
    class='button text-bright-theme'
  )
    slot
</template> 

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class SmallButton extends Vue {
  @Prop({ default: 'blue' })
  public color!: string
}
</script>

<style scoped lang='sass'>

$blue: rgba(85, 132, 255, 1)
$red: rgba(218, 53, 53, 1)
$admin: rgba(255, 211, 0, 1)

.button 
  white-space: nowrap
  cursor: pointer
  outline: none
  font: 1em
  border: 1px solid transparent
  border-radius: 10px
  transition: all .1s
  &:hover
    background: transparent
    border: 1px solid #5584FF
    box-shadow: none

.blue
  background: $blue
  box-shadow: -0px -0px 50px -8px $blue
  &:hover
    border: 1px solid $blue

.red
  background: $red
  box-shadow: 0px 0px 50px -8px $red
  &:hover
    border: 1px solid $red

.admin
  background: $admin
  box-shadow: 0px 0px 50px -8px $admin
  color: black
  &:hover
    border: 1px solid $admin
    color: white
</style>