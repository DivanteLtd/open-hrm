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
                        td.actions
                            a(@click='deleteSource(source._id)' class='button is-warning')
                                span.icon.is-small
                                    i.fa.fa-trash-o
                                span Delete
        info(:infoText='infoText')
</template>

<script>

  import Sources from '../api/Sources'
  import Info from '@/components/common/Info'

  export default {
    name: 'sources',
    components: {
      Info
    },
    data () {
      return {
        sources: null,
        newElement: {
          name: ''
        },
        infoText: `It's key to have information about from where the profile has been acquired. Using this dictionary you can tag candidates with information if they came from Linkedin
        research, personal referrals from other employees or maybe they used Job Portal. In next version we plan to build some statistical features around this :)`
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
