<template lang="pug">
    section.add-experience
        .field(v-for="(row, index) in rows")
            .field.is-horizontal
                .field-label.is-normal
                    label.label From
                .field-body
                    .field
                        .control
                            Datepicker(:value="row.from" v-model="row.from")

                .field-label.is-normal
                    label.label To
                .field-body
                    .field
                        .control
                            Datepicker(:value="row.to" v-model="row.to")

            .field.is-horizontal
                .field-label.is-normal
                    label.label Position
                .field-body
                    .field.is-grouped
                        .control.is-expanded
                            input(class='input' type='text'  v-model="row.position")

            .field.is-horizontal
                .field-label.is-normal
                    label.label Company
                .field-body
                    .field.is-grouped
                        .control.is-expanded
                            input(class='input' type='text'  v-model="row.company")
                        .control(v-if="index > 0")
                            a.delete(@click.prevent="removeRow(index)")

        a.button(@click.prevent="addRow") +
</template>

<script>
  import Datepicker from 'vuejs-datepicker'
  export default {
    oldRowsValue: [],
    data () {
      return {
        rows: this.experience
      }
    },
    components: {
      Datepicker
    },
    props: ['experience'],
    watch: {
      experience: {
        handler (newData, oldData) {
          if (newData.length <= 1) {
            this.rows = newData
          }
        }
      }
    },
    mounted () {
      this.oldRowsValue = { ...this.experience }
    },
    methods: {
      addRow () {
        this.rows.push({from: '', to: '', position: '', company: ''})
      },
      removeRow (index) {
        this.rows.splice(index, 1)
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
    .add-languages .delete
        top: calc(50% - 10px)
</style>
