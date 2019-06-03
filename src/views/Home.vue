<template lang='pug'>
  .content
    main(class='Home')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Presence from '@/store/modules/Presence'
import { getModule } from 'vuex-module-decorators'
import store from '@/store/store'
import registerModule from '@/store/modules/register'
import * as firebase from 'firebase'

export default class Home extends Vue {
  beforeRouteEnter(to: any, from: any, next: any) {
    next()
  }

  public mounted(): void {
    /* registerModule('parser')
    firebase
      .database()
      .ref('/messages/')
      .push({
        post: 'Проверка fpfpfp',
      }) */
  }
}
/*

@(!.*?)@  - matches closing tag
@([^!].*?)@ - matches opening tag

*/
</script>


<style lang='sass'>

.xbbcode-b //SPAN BOLD

.xbbcode-center //SPAN CENTER

.xbbcode-code //SPAN CODE

.xbbcode-a


</style>
