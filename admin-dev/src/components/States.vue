<template lang="pug">
  .container
    h1.box-header States
    .box
      .add-section
        form(@submit.prevent='addNewState')
          .field.is-grouped
            p.control.is-expanded
              input(v-model='newElement.code' class='input' placeholder='Code' v-validate="'required'" name="code" v-bind:class="{'is-danger': errors.first('code') }")
            p.control.is-expanded
              input(v-model='newElement.name' class='input' placeholder='Name' v-validate="'required'" name="name" v-bind:class="{'is-danger': errors.first('name') }")
            p.control
              button.button.is-primary Add new source
      table.table.is-bordered.is-striped
        tbody
          tr(v-for='state in states')
            td {{ state.code }}
            td {{ state.name }}
            td
              a(@click='deleteState(state._id)' class='button is-warning')
                span.icon.is-small
                  i.fa.fa-trash-o
                span Delete
</template>

<script>
import States from '../api/States'

export default {
  name: 'states',
  data () {
    return {
      states: null,
      newElement: {
        name: '',
        code: ''
      }
    }
  },
  mounted () {
    this.getStates()
  },
  methods: {
    getStates: function () {
      States.getAll().then(res => {
        this.states = res.body.reverse()
      }, res => {
        this.addErrorMessage()
      }).catch(err => {
        console.error(err)
        this.addErrorMessage()
      })
    },
    deleteState: function (stateId) {
      States.delete(stateId).then(res => {
        this.getStates()
        this.addSuccessMessage('State has been deleted!')
      }, res => {
        this.addErrorMessage()
      }).catch(err => {
        console.error(err)
        this.addErrorMessage()
      })
    },
    addNewState: function () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        States.add(this.newElement).then(res => {
          this.getStates()
          Object.assign(this.$data, this.$options.data())
          this.$validator.clean()
          this.addSuccessMessage('New state has been added!')
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
