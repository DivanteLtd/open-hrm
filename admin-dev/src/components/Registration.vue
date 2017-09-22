<template lang="pug">
    div.main-box
        .logo
            img(src="./../assets/img/logo.png")
        #registration-form
            header
                p {{ msg }}
            form(@submit.prevent='login')
                .field
                    p.control
                        input(class='input' name='email' type='text' placeholder='Your email' v-model='user.email' v-validate="'required|email'")
                        p(class="help is-danger" v-show="errors.has('email')") {{ errors.first('email') }}
                .field
                    p.control
                        input(class='input' name='password' type='password' placeholder='Your password' v-model='user.password' v-validate="'required|confirmed:repassword'")
                        p(class="help is-danger" v-show="errors.has('password')") {{ errors.first('password') }}
                .field
                    p.control
                        input(class='input' name='repassword' type='password' placeholder='Repeat your password' v-model='user.repassword' v-validate="'required|confirmed:password'")
                        p(class="help is-danger" v-show="errors.has('repassword')") {{ errors.first('repassword') }}
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
        msg: 'Registration',
        user: {
          email: '',
          password: '',
          repassword: ''
        }
      }
    },
    methods: {
      login: function () {
        this.$validator.validateAll()
        if (!this.errors.any()) {
          User.addReg(this.user)
            .then(res => {
              this.$router.push('/')
            })
            .catch(() => {
              this.addErrorMessage()
            })
        }
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>

@import ~assets/sass/variables

#registration-form
  background-color: #fff
  padding: 15px
  border-radius: 5px
  border: 1px solid $border-color

  header
    margin-bottom: 20px

</style>
