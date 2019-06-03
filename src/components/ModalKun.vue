<template lang='pug'>
  div(class='modal')
    div(class='modal-view')
      slot(v-bind='modalProp')
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Modal extends Vue {
  @Prop(Function) onClose!: () => void
  @Prop() modalProp!: any

  public close($event: KeyboardEvent): void {
    if ($event.key === 'Escape') this.onClose()
  }

  public mounted(): void {
    console.log('MODAL PROP', this.modalProp)
    window.addEventListener('keyup', $event => this.close($event))
  }

  public destroyed() {
   window.removeEventListener('keyup', $event => this.close($event)) 
  }
}
</script>

<style lang='sass'>
.modal
  position: fixed
  top: 0
  width: 100vw
  height: 100vh
  z-index: 9000
  background: rgba(0, 0, 0, 0.7)
</style>