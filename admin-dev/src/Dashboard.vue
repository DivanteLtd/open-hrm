<template lang="pug">

  #app
    nav-panel(v-if='isLoggedIn')
    .page-content
      router-view
    main-footer(v-if='isLoggedIn')
    notifications

</template>

<script>
import NavPanel from '@/components/NavPanel'
import User from './api/User'
import States from './api/States'
import Sources from './api/Sources'
import Positions from './api/Positions'
import MainFooter from '@/components/Footer'

export default {
  name: 'dashboard',
  components: {
    NavPanel,
    MainFooter
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.getIsLogged
    }
  },
  mounted () {
    User.getAll()
      .then(res => {
        this.$store.commit('setUsers', res.body)
      })
    States.getAll()
      .then(res => {
        this.$store.commit('setStates', res.body)
      })
    Sources.getAll()
      .then(res => {
        this.$store.commit('setSources', res.body)
      })
    Positions.getAll()
      .then(res => {
        this.$store.commit('setPositions', res.body)
      })
  }
}
</script>

<style lang="sass" rel="stylesheet/sass">

  @import ~bulma
  
  $fa-font-path: '~font-awesome/fonts/'
  @import ~font-awesome/scss/font-awesome
  
  @import ~assets/sass/main


</style>
