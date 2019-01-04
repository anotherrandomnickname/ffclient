<template lang='pug'>
    div hello
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import axios from 'axios'

axios.get('http://localhost:8010/forum').then((data: any) => {
  console.log('data', data.data.data)
})

@Component
export default class Ws extends Vue {}
</script>