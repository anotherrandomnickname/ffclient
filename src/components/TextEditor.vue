<template lang='pug'>
.post-template
  .post-editor
    textarea(v-model='newpost' :id='props.id')
  .button-sama-wrapper
    button-sama(@click.native='onSubmit(newpost, props)')
      span НАХУЙ
</template>

<script lang='js'>

import Vue from 'vue'
import wysiwyg from 'vue-wysiwyg'
import registerComponent, { register } from '@/components/register'
import store from  '@/store/store'
import xbbcode from '@/components/xbbcode'

/* Vue.use(wysiwyg, {}) */

/* wysiwyg(v-model='newpost' spellcheck='false' placeholder='' class='text') */

const component = Vue.component('text-editor', {
  components: register(['button-sama']),
  props: ['props'],
  data() {
    return {
      newpost: '',
      submitfunc: null
    }
  },
  watch: {
    props(props) {
      if(props.postState){
        this.newpost = ''
      }
    },
    newpost(val) {
      if(this.props.listener) {
        this.props.listener(val)
      }
    }
  },
  methods: {
    onSubmit(event) {
      this.props.submitfunc({post: this.newpost})
    }
  },
  mounted() {
    console.log(this.props)
    if(this.props.modalTextProp) this.newpost = this.props.modalTextProp.post
    if(this.props) this.submitfunc = this.props.submitfunc
  }
})

export default component

</script>

<style scoped lang='sass'>
/* @import '../styles/css/vueWysiwyg.css'; */

.button-sama-wrapper 
  padding: 2em 0.5em 0.5em 0.5em


.post-editor
  background: #130d26
  height: 301px
  width: inherit
  border: 5px solid #1f1b34
  padding: 1em


.post-editor textarea
  height: 100%
  width: 100%
  resize: none
  margin: 0
  background: transparent
  color: white
  border: 0
  outline: none


.post-editor .editr 
  border: 0


.post-editor .editr .editr--toolbar 
  position: absolute
  margin-top: -1px
  width: calc(80% - 10px)


.post-editor .editr .editr--content 
  padding-top: 2.5em
  border: 0
  text-align: left

</style>