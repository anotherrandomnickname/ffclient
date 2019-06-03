<template lang='pug'>
  footer(class='footer' id='footer' :move='onMove')
    h1(class='text-subhead text-bright-theme') Привет
</template>

<script lang='ts'>
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {}
</script>

<style scoped lang='sass'>

.footer
  width: 100%
  height: $footer-height
  position: relative
  top: 0
  background: #1f1b34
  margin-top: 10em
  h1
    text-align: left

@keyframes hello

</style>