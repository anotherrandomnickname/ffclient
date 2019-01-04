<template lang="pug">
    form(class='form' @submit.prevent='$props.onSubmit')
      slot
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Form extends Vue {
  @Prop() public onSubmit!: (e: MouseEvent) => void
}
</script>

<style scoped lang='sass'>
.form
  background: #19162C
  display: flex
  justify-content: center
  flex-wrap: wrap
  height: 100%
  width: 100%
</style>

