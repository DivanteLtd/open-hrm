<template lang="pug">
    section.add-languages
        .field.is-horizontal(v-for="(row, index) in rows")
            .field-label.is-normal
                label.label Language
            .field-body
                .field
                    .control
                        input(class='input' type='text' v-model="row.language")
            .field-label.is-normal
                label.label Level
            .field-body
                .field.is-grouped
                    .control.is-expanded
                        input(class='input' type='text'  v-model="row.level")
                    .control(v-if="index > 0")
                        a.delete(@click.prevent="removeRow(index)")

        a.button(@click.prevent="addRow") +
</template>

<script>
  export default {
    oldRowsValue: [],
    data () {
      return {
        rows: this.language
      }
    },
    props: ['language'],
    watch: {
      language: {
        handler (newData, oldData) {
          if (newData.length <= 1) {
            this.rows = newData
          }
        }
      }
    },
    mounted () {
      this.oldRowsValue = { ...this.language }
    },
    methods: {
      addRow () {
        this.rows.push({language: '', level: ''})
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
