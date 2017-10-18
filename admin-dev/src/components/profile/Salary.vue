<template lang="pug">
    section.profile-box(v-if="salary.length > 0")
        header.profile-box-header Salary
        div.profile-box-content
           table.table.salary-table
                tr
                    td Contract
                    td Net
                    td Gross
                    td Cost
                    td Currency
                tr
                    td {{ salary.contract }}
                    td {{ salary.net }}
                    td {{ salary.gross }}
                    td {{ salary.cost }}
                    td {{ salary.currency }}
</template>

<script>
  export default {
    props: ['salary']
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
    .salary-table
        margin-bottom: 0
        border-bottom: 0
        tr:hover
            background: none
        td:last-child
            text-align: inherit
</style>
