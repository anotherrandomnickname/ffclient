<template lang='pug'>
  div(class='forum-container-flexbox')
    div(class='administrative-container')
    div(class='forums')
      div(class='forum-element')
      div(class='forum-element')
      div(class='forum-element')
      div(class='forum-element')
      div(class='forum-element')
</template>

<style lang='sass'>
.forum-container-flexbox
  height: 100%
  width: 100%
  position: absolute
  display: grid
  grid-template-columns: 5% 60% auto
  grid-template-rows: 10% auto auto
  background: red

.administrative-container
  background: grey
  height: 100%
  width: 100%
  grid-column-start: 3
  grid-column-end: 4
  grid-row-start: 2
  grid-row-end: 3

.forums
  grid-column-start: 2
  grid-column-end: 3
  grid-row-start: 2
  grid-row-end: 3
  background: green
  display: flex
  justify-content: space-around
  flex-wrap: wrap

.forum-element
  width: 250px
  height: 300px
  background: yellow
  margin: 15px
</style>


