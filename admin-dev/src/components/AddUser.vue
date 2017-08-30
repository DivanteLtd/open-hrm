<template lang="pug">
    .container
        h1.box-header Add new user
        .box
            form(@submit.prevent='addNewUser')
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
                                            input(class='input' name='shortName' type='text' v-model='user.profile.shortname' v-validate="'required'" )
                                            p(class="help is-danger" v-show="errors.has('shortName')") {{ errors.first('shortName') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Email
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='email' type='email' v-model='user.email' v-validate="'required|email'" )
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
                                            input(class='input' name='password' type='password' v-model='user.password' v-validate="'required|confirmed:repassword'")
                                            p(class="help is-danger" v-show="errors.has('password')") {{ errors.first('password') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label Repeat
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='repassword' type='password' v-model='user.repassword' v-validate="'required|confirmed:password'")
                                            p(class="help is-danger" v-show="errors.has('repassword')") {{ errors.first('repassword') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label State
                                .field-body
                                    .field
                                        .control
                                            .select
                                                select(v-model='user.role')
                                                    option
                                                    option(v-for='role in roles'
                                                    :value='role') {{ role }}

                .field
                    .control
                        button.button.is-primary Submit
</template>

<script>

  import User from '../api/User'

  export default {
    name: 'addUser',

    data () {
      return {
        roles: '',
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
      this.getRoles()
    },
    methods: {
      getRoles: function () {
        this.roles = ['admin', 'user', 'recruiter']
      },
      addNewUser: function () {
        this.$validator.validateAll()
        if (!this.errors.any()) {
          User.add(this.user).then(res => {
            this.addSuccessMessage('User has been added!')
            Object.assign(this.$data, this.$options.data())
            this.$validator.clean()
          }, res => {
            this.addErrorMessage()
          }).catch(err => {
            console.error(err)
            this.addErrorMessage()
          })
        }
      }
    }
  }
</script>

