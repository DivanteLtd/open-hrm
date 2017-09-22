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
                        td.actions
                            a(@click='deletePosition(position._id)' class='button is-warning')
                                span.icon.is-small
                                    i.fa.fa-trash-o
                                span Delete
        info(:infoText='infoText' v-show="positions.length < 2")
</template>

<script>
  import Positions from '../api/Positions'
  import Info from '@/components/common/Info'

  export default {
    name: 'positions',
    components: {
      Info
    },
    data () {
      return {
        positions: null,
        newElement: {
          name: ''
        },
        infoText: `Open positions are the professions you're searching candidates for. It's necessary to have at least one open position to make features like <a href='#/addcandidate'>Add candidate</a> working`
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
          if (res.data.error) {
            this.addErrorMessage(res.data.error)
          } else {
            this.addErrorMessage()
          }
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
