<template lang="pug">

  aside#main-nav.menu

    .logo-wrapper
      router-link(to='/')
        img(src='~assets/img/logo.png')
        span Breez HRM

    hr

    .user-info
      h4 {{ getUserName }}
      p {{ getUserEmail }}

    hr

    main-nav

</template>

<script>
import MainNav from '@/components/MainNav'

export default {
  name: 'nav-panel',
  components: {
    MainNav
  },
  data () {
    return {
      msg: 'Navigation Panel'
    }
  },
  computed: {
    getUserName () {
      return this.$store.getters.getActiveUserInfo.name
    },
    getUserEmail () {
      return this.$store.getters.getActiveUserInfo.email
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/sass" scoped>

  @import ~assets/sass/mixins

  #main-nav
    width: $main-nav-width
    position: fixed
    min-height: 100%
    top: 0
    left: 0
    background-color: $main-nav-bg
    color: $main-nav-color
    z-index: 99

    hr
      margin: 0
      background-color: rgba(0, 0, 0, 0.15)

    a
      color: $main-nav-color

      &:hover
        color: $main-nav-color-hover

  .logo-wrapper
    text-align: center

    a
      display: block
      padding: 5px 15px 15px

    span
      +font-px-to-rem(17, 19)

    img
      height: 45px
      width: auto
      vertical-align: middle
      margin-right: 5px

  .user-info
    text-align: center
    padding: 20px 30px

    h4
      +font-px-to-rem(17, 19)
      font-weight: $fw-semi-bold
      margin-bottom: 2px

    p
      +font-px-to-rem(12, 14)

</style>
