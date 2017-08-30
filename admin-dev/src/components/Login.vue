<template lang="pug">

    #login-form
        header
            p {{ msg }}
        form(@submit.prevent='login')
            .field
                p.control
                    input(class='input' name='email' type='text' placeholder='Your email' v-model='user.email' required)
            .field
                p.control
                    input(class='input' name='password' type='password' placeholder='Your password' v-model='user.password' required)
            .field
                p.control
                    button(class='button is-primary') Login

</template>

<script>
  import User from '../api/User'

  export default {
    name: 'login',
    data () {
      return {
        msg: 'Login',
        user: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      login: function () {
        User.login(this.user)
          .then(res => {
            if (res.status === 202) {
              this.$router.push('/')
              this.$store.commit('isLoggedIn', true)
            }
          })
          .catch(() => {
            this.addErrorMessage('Wrong login or password')
          })
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>

@import ~assets/sass/variables

#login-form
  width: 500px
  max-width: 80%
  margin: 0 auto
  position: relative
  top: 30px
  background-color: #fff
  padding: 15px
  border-radius: 5px
  border: 1px solid $border-color

  header
    margin-bottom: 20px

</style>
