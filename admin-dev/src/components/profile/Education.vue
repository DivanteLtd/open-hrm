<template lang="pug">
    section.profile-box(v-if="education.length > 0")
        header.profile-box-header Education
        div.profile-box-content
            ul.education-list
                li.education-list-element(v-for='edu in education')
                    span.education-date {{ getFromDate(edu.from) }} - {{ getToDate(edu.to) }} {{ getDateMonthRange(edu.from, edu.to) }}
                    = ' '
                    span.education-name {{ edu.school }}

</template>

<script>
  import DateHelper from '@/helpers/Date'
  export default {
    props: ['education'],
    methods: {
      getFromDate (fromDate) {
        if (fromDate === '') return ''
        let date = new Date(fromDate)

        return DateHelper.getMonthAsString(date) + ' ' + date.getFullYear()
      },
      getToDate (toDate) {
        if (toDate === '') return 'Present'
        let date = new Date(toDate)

        return DateHelper.getMonthAsString(date) + ' ' + date.getFullYear()
      },
      getDateMonthRange (fromDate, toDate) {
        fromDate = new Date(fromDate)
        toDate = new Date(toDate)

        let monthRange = DateHelper.getDateMonthRange(fromDate, toDate)

        if (isNaN(monthRange)) return ''

        return '( ' + monthRange + ' months )'
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
    .education-list
        .education-date
            font-weight: bold
</style>
