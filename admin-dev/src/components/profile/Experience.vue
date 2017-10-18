<template lang="pug">
    section.profile-box(v-if="experience.length > 0")
        header.profile-box-header Experience
        div.profile-box-content
            ul.experience-list
                li.experience-list-element(v-for='exp in experience')
                    span.experience-date {{ getFromDate(exp.from) }} - {{ getToDate(exp.to) }} {{ getDateMonthRange(exp.from, exp.to) }}
                    = ' '
                    span.experience-position {{ exp.position }}
                    = ' '
                    span.experience-company {{ exp.company }}

</template>

<script>
  import DateHelper from '@/helpers/Date'
  export default {
    props: ['experience'],
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
    .experience-list
        .experience-date
            font-weight: bold
</style>
