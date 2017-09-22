<template lang="pug">
    .container
        h1.box-header Note type
        .box
            .add-section
                form(@submit.prevent='addNewMedium')
                    .field.is-grouped
                        p.control.is-expanded
                            input(v-model='newElement.name' class='input' v-validate="'required'" name="medium" v-bind:class="{'is-danger': errors.first('medium') }")
                        p.control
                            button.button.is-primary Add new medium
            table.table.is-bordered.is-striped
                tbody
                    tr(v-for='medium in mediums')
                        td {{ medium.name }}
                        td.actions
                            a(@click='deleteMedium(medium._id)' class='button is-warning')
                                span.icon.is-small
                                    i.fa.fa-trash-o
                                span Delete
        info(:infoText='emptyText' v-show="mediums.length == 0")
</template>

<script>
  import Mediums from '../api/Mediums'
  import Info from '@/components/common/Info'

  export default {
    name: 'mediums',
    data () {
      return {
        mediums: null,
        newElement: {
          name: ''
        },
        emptyText: `Note category is a dictionary used to categorize comments, notes, attachments
assigned to candidates. Using this categorization you can easily find specific resources assigned
to your profiles. To see it in action go to <a href='#/'>Profile</a> section and start editing one!`
      }
    },
    mounted () {
      this.getMediums()
    },
    components: {
      Info
    },
    methods: {
      getMediums: function () {
        Mediums.getAll().then(res => {
          this.mediums = res.body.reverse()
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      },
      deleteMedium: function (sourceId) {
        Mediums.delete(sourceId).then(res => {
          this.getMediums()
          this.addSuccessMessage('Source has been deleted!')
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      },
      addNewMedium: function () {
        this.$validator.validateAll()
        if (!this.errors.any()) {
          Mediums.add(this.newElement).then(res => {
            this.getMediums()
            this.newElement.name = ''
            this.$validator.clean()
            this.addSuccessMessage('New source has been added!')
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
