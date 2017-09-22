<template lang="pug">
    .container
        h1.box-header Edit profile
        .box
            form(@submit.prevent='saveData')
                div.columns
                    div.column.is-half
                        fieldset
                            legend Add new user

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Full name
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='fullName' type='text' v-model='user.profile.name' v-validate="'required'")
                                            p(class="help is-danger" v-show="errors.has('fullName')") {{ errors.first('fullName') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Shortname
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='shortName' type='text' v-model='user.profile.shortname' v-validate="'required'")
                                            p(class="help is-danger" v-show="errors.has('shortName')") {{ errors.first('shortname') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Email
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='email' type='email' v-model='user.email' v-validate="'required|email'")
                                            p(class="help is-danger" v-show="errors.has('email')") {{ errors.first('email') }}

                        fieldset
                            legend Additional

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Location
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='location' type='text' v-model='user.profile.location' )

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Website
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='website' type='text' v-model='user.profile.website' )

                    div.column.is-half

                        fieldset
                            legend Password

                            .field.is-horizontal
                                .field-label.is-normal
                                    label Password
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='password' type='password' v-model='user.password')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label Repeat
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='repassword' type='password' v-model='user.repassword')

                .field
                    .control
                        button.button.is-primary Submit
</template>

<script>

  import User from '../api/User'

  export default {
    name: 'editProfile',
    data () {
      return {
        user: {
          profile: {
            name: '',
            shortname: '',
            location: '',
            website: ''
          },
          email: '',
          password: '',
          repassword: ''
        }
      }
    },
    mounted () {
      this.getUser()
    },
    methods: {
      getUser: function () {
        User.getActiveUser(this.getActiveUserId()).then(res => {
          this.user = res.body[0]
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      },
      getActiveUserId: function () {
        return this.$store.getters.getActiveUserInfo._id
      },
      saveData: function () {
        User.put(this.user).then(res => {
          this.addSuccessMessage('User has been added!')
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
    td
        padding: 20px 10px
        font-size: 1rem
        vertical-align: middle
</style>
