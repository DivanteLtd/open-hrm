<template lang="pug">

  form.search-wrapper.is-clearfix(@submit.prevent='search')
    .field
      p.control.search-input
        input(class='input' type='text' placeholder='Search candidate' v-model='searchText')
      p.control
        button.button Search  
        button.button(type='button' @click.prevent='clearSearch') Clear

</template>

<script>

export default {
  name: 'search',
  data () {
    return {
      searchText: ''
    }
  },
  props: {
    searchAction: Function
  },
  methods: {
    search: function () {
      this.searchAction(this.searchText)
    },
    clearSearch: function () {
      if (this.searchText.length !== 0) {
        this.searchText = ''
        this.searchAction('')
      }
    }
  }
}

</script>

<style lang="sass" rel="stylesheet/sass">

.search-wrapper
  margin-bottom: 30px

  .control
    float: left
  
  .search-input
    width: 250px
    margin-right: 5px

  button
    margin-right: 5px

</style>
