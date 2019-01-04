<template lang='pug'>
  main(class='Home')
    //img(alt='Vue Logo' src='../assets/logo.png')
    h1(class="text-head") Здарова бандиты!
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Component({
  components: {},
})
export default class Home extends Vue {}
</script>
