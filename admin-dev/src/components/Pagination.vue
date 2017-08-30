<template lang="pug">
  
  .pagination-wrapper.is-clearfix

    nav.pagination.is-centered

      button(
        type='button'
        class='button pagination-previous is-primary'
        @click.prevent='updatePagination(currentLink - 1)'
        :disabled='currentLink === 1'
      ) Previous

      button(
        type='button'
        class='button pagination-next is-primary'
        @click.prevent='updatePagination(currentLink + 1)'
        :disabled='currentLink === totalPages'
      ) Next

      ul.pagination-list

        li(v-if='paginationLinks.indexOf(1) < 0')
          a.pagination-link(@click.prevent='updatePagination(1)') 1

        li(v-if='paginationLinks.indexOf(1) < 0')
          span.pagination-ellipsis &hellip;

        li(v-for='pageNum in paginationLinks')
          a.pagination-link(
            @click.prevent='updatePagination(pageNum)'
            :class='{"is-current": currentLink === pageNum}'
          ) {{ pageNum }}

        li(v-if='paginationLinks.indexOf(totalPages) < 0')
          span.pagination-ellipsis &hellip;

        li(v-if='paginationLinks.indexOf(totalPages) < 0')
          a.pagination-link(
            @click.prevent='updatePagination(totalPages)'
            :class='{"is-current": currentLink === totalPages}'
          ) {{ totalPages }}

    .tabs.is-toggle(v-if='itemsToShowUpdate')
      ul
        li(
          v-for='count in visibleListItemsQty'
          :class='{"is-active": itemsToShow === count}')
          a(@click.prevent='itemsToShowUpdate(count); updatePagination(1)') {{ count }}

</template>

<script>

export default {
  name: 'pagination',
  data () {
    return {
      totalPages: 0,
      currentLink: 1,
      paginationLinks: [],
      visibleListItemsQty: [10, 25, 50, 100],
      visiblePaginationLinks: this.linksToShow
    }
  },
  props: {
    totalItems: Number,
    itemsToShow: Number,
    linkAction: Function,
    itemsToShowUpdate: Function,
    linksToShow: {
      default: 7,
      type: Number
    }
  },
  mounted () {
    this.getTotalPages()
  },
  methods: {
    getTotalPages: function () {
      const countPages = Math.ceil(this.totalItems / this.itemsToShow)
      this.totalPages = countPages
      if (countPages < this.visiblePaginationLinks) {
        this.visiblePaginationLinks = countPages
      }
      this.initPagintionLinks()
    },
    initPagintionLinks: function () {
      this.paginationLinks = []
      for (let i = 1; i <= this.visiblePaginationLinks; i++) {
        this.paginationLinks.push(i)
      }
    },
    updatePagination: function (pageNum) {
      // TODO Case when there is less pages than linksToShow
      // Update view
      this.linkAction(pageNum)
      this.currentLink = pageNum
      // check if paginationLinks needs to be updated
      if (pageNum > this.visiblePaginationLinks / 2) {
        this.paginationLinks = []
        // For each iteration add one link to the left and to the right of current link
        for (let i = 0; i < this.visiblePaginationLinks / 2; i++) {
          let nextLink = this.currentLink + i
          let prevLink = this.currentLink - i
          this.paginationLinks.unshift(prevLink)
          // Avoid doubling current link in pagination and adding unnecessary links at the end
          if (prevLink !== nextLink && !(nextLink > this.totalPages)) {
            this.paginationLinks.push(nextLink)
          }
        }
      } else if (pageNum === 1) {
        // If back to first page
        this.initPagintionLinks()
      }
    }
  },
  watch: {
    'totalItems': function () {
      this.getTotalPages()
    },
    'itemsToShow': function () {
      this.getTotalPages()
    }
  }
}

</script>

<style lang="sass" rel="stylesheet/sass">

.pagination
  float: left

.pagination-list
  margin: 0 15px

.pagination-previous[disabled],
.pagination-next[disabled]
  color: #fff  

.tabs
  float: right

</style>
