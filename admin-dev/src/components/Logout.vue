<template lang="pug">

    .container
        h1.box-header Logout
        .box

</template>

<script>
  import User from '../api/User'

  export default {
    name: 'logout',

    data () {
      return {}
    },
    mounted () {
      this.logout()
    },
    methods: {
      logout () {
        User.logout().then(res => {
          this.$router.push('/')
          this.$store.commit('isLoggedIn', false)
        }, res => {

        }).catch()
      }
    }
  }

</script>

<style lang="sass" rel="stylesheet/sass" scoped>
</style>
