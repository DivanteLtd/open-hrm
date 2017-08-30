<template lang="pug">

  footer#main-footer
    .container
      p &copy; {{ year }} - Open HRM

</template>

<script>
  export default {
    name: 'main-footer',
    data () {
      return {
        year: new Date().getFullYear()
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass">

  @import ~assets/sass/mixins

  #main-footer
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    border-top: 1px solid $color4
    padding: 15px 0 15px $main-nav-width
    +font-px-to-rem(12, 14)

</style>
