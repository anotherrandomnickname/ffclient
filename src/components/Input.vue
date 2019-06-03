<template lang="pug">
  .container
    div(class='input-container' v-bind:class='{active2: isActive, inactive2: !isActive}')
      p(v-bind:class='{active: isActive, inactive: !isActive}' class='input-p') {{title}}
      input(@focus='onFocus' @blur='onBlur' v-model='content' :type='$props.type' @input='handleInput')
    p(class='error-msg') {{err}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { MouseEvent } from '@/interfaces/_index'

@Component
export default class Input extends Vue {
  @Prop({default: ''}) public contentProp!: string
  public content: string = ''
  public isActive: boolean = false
  @Prop() public middleware?: (content: any) => any
  @Prop() public err!: string
  @Prop({ default: 'text' })
  private type!: string
  @Prop() private title!: string

  @Emit('input')
  public handleInput(e: MouseEvent): string {
    this.content = e.currentTarget.value as string
    if (this.$props.middleware) {
      for (let middleware of this.$props.middleware) {
        middleware(this.content)
      }
    }
    return this.content
  }
  public onFocus(): void {
    this.isActive = true
  }

  public onBlur(): void {
    console.log(this.content, this.contentProp)
    this.content.length === 0 ? (this.isActive = false) : (this.isActive = true)
  }

  public mounted(): void {
    if(this.contentProp.length >= 1) {
      this.isActive = true
      this.content = this.contentProp
    }
  }
}
</script>

<style scoped lang='sass'>

.container
  width: 100%


.error-msg
  height: .8em
  font-family: 'RobotoMedium'
  font-size: .8em
  color: red
  text-align: right
  position: relative
.input-container
  width: 100%
  border: 1px solid rgba(85, 132, 255, 0.6)
  border-radius: 5px
  display: grid
  grid-template-columns: auto
  grid-template-rows: 0.75em 1.5em 0.75em
  transition: all .3s
input
  color: white
  z-index: 100
  background: transparent
  grid-column-start: 1
  grid-column-end: 2
  grid-row-start: 2
  grid-row-end: 3
  width: calc(100% - 10px)
  height: 100%
  border: none
  padding-left: 10px
  outline: none
  font-family: 'Roboto'
  font-size: 1em
  letter-spacing: .3px
.input-p
  z-index: 0
  grid-column-start: 1
  grid-column-end: 2
  grid-row-start: 2
  grid-row-end: 3
  font-family: 'RobotoBlack'
  letter-spacing: 2px
  font-weight: bold
  margin-left: 10px
  position: absolute
  transition: all .3s


.active2
  border: 1px solid rgba(85, 132, 255, 1)

.inactive2
  border: 1px solid rgba(85, 132, 255, 0.6)

.active
  color: white
  margin-top: -10px
  background: #19162C
  border-radius: 100px

.inactive
  color: rgba(255, 255, 255, 0.6)
</style>

