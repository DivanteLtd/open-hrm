<template lang="pug">
    article.message
        .message-body(v-html="infoText")
        img(src='~assets/img/info.png')
</template>

<script>
  export default {
    name: 'info',
    data () {
      return {}
    },
    props: {
      infoText: {
        type: String,
        required: true
      }
    },
    methods: {
    }
  }
</script>
<style lang="sass" rel="stylesheet/sass" scoped>
    .message
        position: relative
        .message-body
            font-size: 14px
            color: gray
        img
            position: absolute
            top: -10px
            left: -10px
</style>
