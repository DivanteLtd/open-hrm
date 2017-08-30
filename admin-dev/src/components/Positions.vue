<template lang="pug">
  .container
    h1.box-header Positions
    .box
      .add-section
        form(@submit.prevent='addNewPosition')
          .field.is-grouped
            p.control.is-expanded
              input(v-model='newElement.name' class='input' v-validate="'required'" name="position" v-bind:class="{'is-danger': errors.first('position') }")
            p.control
              button.button.is-primary Add new position
      table.table.is-bordered.is-striped
        tbody
          tr(v-for='position in positions')
            td {{ position.name }}
            td
              a(@click='deletePosition(position._id)' class='button is-warning')
                span.icon.is-small
                  i.fa.fa-trash-o
                span Delete
</template>

<script>
import Positions from '../api/Positions'

export default {
  name: 'positions',

  data () {
    return {
      positions: null,
      newElement: {
        name: ''
      }
    }
  },
  mounted () {
    this.getPositions()
  },
  methods: {
    getPositions: function () {
      Positions.getAll().then(res => {
        this.positions = res.body.reverse()
      }, res => {
        this.addErrorMessage()
      }).catch(err => {
        console.error(err)
        this.addErrorMessage()
      })
    },
    deletePosition: function (positionId) {
      Positions.delete(positionId).then(res => {
        this.getPositions()
        this.addSuccessMessage('Position has been deleted!')
      }, res => {
        this.addErrorMessage()
      }).catch(err => {
        console.error(err)
        this.addErrorMessage()
      })
    },
    addNewPosition: function () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        Positions.add(this.newElement).then(res => {
          this.getPositions()
          this.newElement.name = ''
          this.$validator.clean()
          this.addSuccessMessage('New position has been added!')
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
