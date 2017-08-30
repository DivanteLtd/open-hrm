<template lang="pug">
    .container
        h1.box-header Sources
        .box
            .add-section
                form(@submit.prevent='addNewSource')
                    .field.is-grouped
                        p.control.is-expanded
                            input(v-model='newElement.name' class='input' v-validate="'required'" name="source" v-bind:class="{'is-danger': errors.first('source') }")
                        p.control
                            button.button.is-primary Add new source
            table.table.is-bordered.is-striped
                tbody
                    tr(v-for='source in sources')
                        td {{ source.name }}
                        td
                            a(@click='deleteSource(source._id)' class='button is-warning')
                                span.icon.is-small
                                    i.fa.fa-trash-o
                                span Delete
</template>

<script>

  import Sources from '../api/Sources'

  export default {
    name: 'sources',
    data () {
      return {
        sources: null,
        newElement: {
          name: ''
        }
      }
    },
    mounted () {
      this.getSources()
    },
    methods: {
      getSources: function () {
        Sources.getAll().then(res => {
          this.sources = res.body.reverse()
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      },
      deleteSource: function (sourceId) {
        Sources.delete(sourceId).then(res => {
          this.getSources()
          this.addSuccessMessage('Source has been deleted!')
        }, res => {
          this.addErrorMessage()
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      },
      addNewSource: function () {
        this.$validator.validateAll()
        if (!this.errors.any()) {
          Sources.add(this.newElement).then(res => {
            this.getSources()
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
