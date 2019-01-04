<template lang='pug'>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class Home extends Vue {
  public mounted() {
    this.$store.commit('DISCARD_SESSION', null)
    this.$router.push({ path: '/' })
  }
}
</script>
