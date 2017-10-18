<template lang="pug">
    section.add-education
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
                    label.label School
                .field-body
                    .field.is-grouped
                        .control.is-expanded
                            input(class='input' type='text'  v-model="row.school")
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
        rows: this.education
      }
    },
    components: {
      Datepicker
    },
    props: ['education'],
    watch: {
      education: {
        handler (newData, oldData) {
          if (newData.length <= 1) {
            this.rows = newData
          }
        }
      }
    },
    mounted () {
      this.oldRowsValue = { ...this.education }
    },
    methods: {
      addRow () {
        this.rows.push({from: '', to: '', school: ''})
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
