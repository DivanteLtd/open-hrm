<template lang="pug">

  nav
    ul
      li
        span Main
      li
        router-link(to='/') Candidates
      li
        span Admin
      li
        router-link(to='/sources') Sources
      li
        router-link(to='/positions') Positions
      li
        router-link(to='/medium') Note mediums
      li
        router-link(to='/states') States
      li
        span Users
      li
        router-link(to='/userslist') User list
      li
        router-link(to='/editprofile') Edit profile
      li
        router-link(to='/logout') Logout

</template>

<script>

export default {
  name: 'main-nav',
  data () {
    return {
      msg: 'Main Navigation'
    }
  }
}

</script>

<style lang="sass" rel="stylesheet/sass" scoped>

  @import ~assets/sass/mixins

  nav
    li
      +font-px-to-rem(11, 13)
      text-transform: uppercase
      letter-spacing: 0.035em

      & > span
        display: block
        padding: 12px 15px

    a
      +font-px-to-rem(13, 15)
      letter-spacing:  0.025em
      color: $main-nav-color
      text-transform: none
      font-weight: $fw-semi-bold
      display: block
      padding: 12px 25px

      &:hover,
      &.router-link-exact-active
        color: $main-nav-color-hover
        background-color: $main-nav-bg-hover

</style>
