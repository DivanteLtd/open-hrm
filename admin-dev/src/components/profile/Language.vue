<template lang="pug">
    section.profile-box(v-if="languages.length > 0")
        header.profile-box-header Language
        div.profile-box-content
            ul.language-list
                li.language-list-element(v-for='language in languages')
                    span.language-name {{ language.language }}
                    = ' '
                    span.language-level {{ language.level }}

</template>

<script>
  export default {
    props: ['languages']
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
    .language-list
        .language-name
            font-weight: bold
</style>
