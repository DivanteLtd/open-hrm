<template lang="pug">
  .container
    header.is-clearfix
      h1.box-header.is-pulled-left Users list
      router-link(
        :to="{ name: 'addUser' }"
        class='button is-primary is-pulled-right') Add User
    .box
      table.table.is-bordered.is-striped
        tbody
          tr(v-for='(user, key, index) in users')
            td
              input(v-model="users[key].profile.name" class="input" v-validate="'required'"  :name="getInputName(key).name" v-bind:class="{'is-danger': errors.first(getInputName(key).name)}")
            td
              input(v-model="users[key].profile.shortname" class="input" v-validate="'required'" :name="getInputName(key).shortname" v-bind:class="{'is-danger': errors.first(getInputName(key).shortname) }")
            td {{ users[key].email }}
            td
              span.select
                select(v-model='users[key].role' )
                  option
                  option(v-for='role in roles'
                  :value='role') {{ role }}
            td.actions
              a(@click='updateUser(key)' class='button is-success')
                span.icon.is-small
                  i.fa.fa-send-o
                span Update
              a(@click='deleteUser(key)' class='button is-warning')
                span.icon.is-small
                  i.fa.fa-trash-o
                span Delete
</template>

<script>
import User from '../api/User'

export default {
  name: 'usersList',

  data () {
    return {
      users: null,
      roles: null
    }
  },
  mounted () {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    getUsers: function () {
      User.getAll().then(res => {
        this.users = res.body
      }, res => {
        this.addErrorMessage()
      }).catch(err => {
        console.error(err)
        this.addErrorMessage()
      })
    },
    deleteUser: function (key) {
      User.delete(this.users[key].id).then(res => {
        this.users.splice(key, 1)
        this.addSuccessMessage('User has been deleted!')
      }, res => {
        this.addErrorMessage()
      }).catch(err => {
        console.error(err)
        this.addErrorMessage()
      })
    },
    updateUser: function (key) {
      const inputNames = this.getInputName(key)
      this.errors.collect(inputNames.name)
      this.errors.collect(inputNames.shortname)
      if (!this.errors.has(inputNames.name) && !this.errors.has(inputNames.shortname)) {
        User.put(this.users[key]).then(res => {
          this.addSuccessMessage('User has been updated!')
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      }
    },
    getInputName: function (key) {
      return {
        'name': 'name[' + key + ']',
        'shortname': 'shortname[' + key + ']'
      }
    },
    getRoles: function () {
      this.roles = ['admin', 'user', 'recruiter']
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
.actions .button:not(:last-child)
    margin-right: 5px
</style>
