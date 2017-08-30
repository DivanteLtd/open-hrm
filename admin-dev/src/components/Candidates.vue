<template lang="pug">

    .container
        h1 Candidates List
        router-link(
        :to="{ name: 'addCandidate' }"
        class='button is-primary is-pulled-right') Add Candidate
        search(:searchAction='searchCandidate')
        table.table.is-bordered.is-striped

            thead
                tr.sort-header
                    th(@click='sortDir = !sortDir; query.orderBy = {"contact.fullName": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["contact.fullName"]}, query.orderBy["contact.fullName"]]')
                        span Full name
                    th(@click='sortDir = !sortDir; query.orderBy = {"contact.email": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["contact.email"]}, query.orderBy["contact.email"]]')
                        span Email
                    th(@click='sortDir = !sortDir; query.orderBy = {"contact.phone": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["contact.phone"]}, query.orderBy["contact.phone"]]')
                        span Phone
                    th(@click='sortDir = !sortDir; query.orderBy = {"subtitle": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["subtitle"]}, query.orderBy["subtitle"]]')
                        span Position
                    th(@click='sortDir = !sortDir; query.orderBy = {"owner": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["owner"]}, query.orderBy["owner"]]')
                        span Recruiter
                    th(@click='sortDir = !sortDir; query.orderBy = {"registeredBy": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["registeredBy"]}, query.orderBy["registeredBy"]]')
                        span Registered by
                    th(@click='sortDir = !sortDir; query.orderBy = {"state": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["state"]}, query.orderBy["state"]]')
                        span State
                    th(@click='sortDir = !sortDir; query.orderBy = {"source": sortDir ? "asc" : "desc"}'
                      :class='[{"is-active": query.orderBy["source"]}, query.orderBy["source"]]')
                        span Source
                    th

                tr
                    th(v-for='n in 3')
                    th
                        span.select
                            select(v-model='filters.subtitle' @change='updateQueryFilter()')
                                option
                                option(v-for='position in $store.state.positions'
                                  :value='position._id') {{ position.name }}
                    th
                        span.select
                            select(v-model='filters.owner' @change='updateQueryFilter()')
                                option
                                option(v-for='user in $store.state.users'
                                  :value='user._id') {{ user.profile.name }}
                    th
                        span.select
                            select(v-model='filters.registeredBy' @change='updateQueryFilter()')
                                option
                                option(v-for='user in $store.state.users'
                                  :value='user._id') {{ user.profile.name }}
                    th
                        span.select
                            select(v-model='filters.state' @change='updateQueryFilter()')
                                option
                                option(v-for='state in $store.state.states'
                                  :value='state._id') {{ state.name }}
                    th
                        span.select
                            select(v-model='filters.source' @change='updateQueryFilter()')
                                option
                                option(v-for='source in $store.state.sources'
                                  :value='source._id') {{ source.name }}
                    th

            tbody
                tr(v-for='candidate in candidates')
                    td {{ candidate.contact.fullName }}
                    td {{ candidate.contact.email }}
                    td {{ candidate.contact.phone }}
                    td {{ $parent.$store.getters.getPositionName(candidate.subtitle) }}
                    td {{ $parent.$store.getters.getUserName(candidate.owner) }}
                    td {{ $parent.$store.getters.getUserName(candidate.registeredBy) }}
                    td {{ $parent.$store.getters.getStateName(candidate.state) }}
                    td {{ $parent.$store.getters.getSourceName(candidate.source) }}
                    td
                        router-link(
                        :to="{ name: 'profile', params: {id: candidate._id} }"
                        class='button is-primary') Details

        pagination(
        v-if='candidates.length'
          :totalItems='totalCandidates'
            :itemsToShow='query.candidatesToShow'
            :linkAction='linkAction'
            :itemsToShowUpdate='itemsToShowUpdate'
        )

</template>

<script>
  import Candidates from '../api/Candidates'
  import Pagination from './Pagination'
  import Search from './Search'

  export default {
    name: 'candidates-list',
    components: {
      Pagination,
      Search
    },
    data () {
      return {
        totalCandidates: null,
        candidates: [],
        sortDir: 0,
        filters: {
          subtitle: '',
          owner: '',
          registeredBy: '',
          state: '',
          source: ''
        },
        query: {
          candidatesToShow: 25,
          skipCandidates: 0,
          orderBy: {
            createdAt: this.sortDir ? 'asc' : 'desc'
          },
          where: {'$and': [{}]}
        }
      }
    },
    mounted () {
      this.getCandidates()
    },
    methods: {
      getCandidates: function () {
        let candidateQuery = {
          limit: this.query.candidatesToShow,
          skip: this.query.skipCandidates,
          orderBy: JSON.stringify(this.query.orderBy),
          where: JSON.stringify(this.query.where)
        }
        Candidates.getFiltered(candidateQuery)
          .then(res => {
            this.totalCandidates = res.body.total
            this.candidates = res.body.results
          })
          .catch(err => {
            // TODO Show candidates list error message
            console.log(err)
          })
      },
      getActiveFilters: function () {
        let filters = this.filters
        let activeFilters = {}
        for (let filter in filters) {
          if (filters[filter]) activeFilters[filter] = filters[filter]
        }
        return activeFilters
      },
      updateQueryFilter: function () {
        const filters = this.getActiveFilters()
        let queryFilterItems = this.query.where['$and']
        Object.keys(filters).length ? queryFilterItems[0] = filters : queryFilterItems[0] = {}
        this.getCandidates()
      },
      searchCandidate: function (val = '') {
        if (val.length) {
          const query = this.buildSearchQuery(val)
          this.updateSearchQuery(query)
        } else {
          this.clearSearchQuery()
          this.getCandidates()
        }
      },
      buildSearchQuery: function (val = '') {
        const searchAreas = ['contact.fullName', 'contact.email', 'contact.phone', 'experience', 'language', 'education']
        let searchQuery = {'$or': []}
        searchAreas.map((item) => {
          searchQuery['$or'].push({
            [item]: {
              '$regex': '.*' + val + '.*',
              '$options': 'i'
            }
          })
        })
        return searchQuery
      },
      updateSearchQuery: function (query) {
        this.clearSearchQuery()
        this.query.where['$and'].push(query)
      },
      clearSearchQuery: function () {
        this.query.where['$and'].splice(1, 1)
      },
      // Pagination actions
      linkAction: function (pageNum) {
        this.query.skipCandidates = (pageNum * this.query.candidatesToShow) - this.query.candidatesToShow
      },
      itemsToShowUpdate: function (toShow) {
        this.query.candidatesToShow = toShow
      }
    },
    watch: {
      query: {
        handler: function () {
          this.getCandidates()
        },
        deep: true
      }
    }
  }

</script>

<style lang="sass" rel="stylesheet/sass" scoped>

    h1
        margin-bottom: 30px

    th,
    td
        padding: 20px 10px
        width: 10%
        vertical-align: middle

    .sort-header th
        cursor: pointer
        text-align: center

        &.is-active,
        &:hover

            span:before,
            span:after
                opacity: 1

        &.asc

            span:before
                opacity: 1
                margin-top: -1px

            span:after
                opacity: 0

        &.desc

            span:before
                opacity: 0

            span:after
                opacity: 1
                margin-top: -1px

        span
            padding-right: 20px
            position: relative

            &:before,
            &:after
                content: ''
                right: 5px
                top: 50%
                position: absolute
                opacity: 0.3
                border-width: 0 4px 4px
                border-style: solid
                border-color: #000 transparent
                margin-top: -4px

            &:before
                margin-top: 2px
                border-bottom: 0
                border-left: 4px solid transparent
                border-right: 4px solid transparent
                border-top: 4px solid #000

    .select
        display: block

        select
            width: 100%

</style>
