<template lang="pug">

    .container
        header.is-clearfix
            h1.box-header.is-pulled-left Candidate profile
            router-link(
            :to="{ name: 'Edit profile' }"
            class='button is-primary is-pulled-right') Add User
        section.profile-main-info
            .columns.box
                .column.top-box
                    div.avatar-box
                        img(src='~assets/img/dummy.png')
                    h4.title.has-text-centered.is-4 {{ details.contact.fullName }}
                    p.has-text-centered {{ this.$store.getters.getPositionName(details.subtitle) }}
                    hr
                    p Assigned to:
                    p.has-text-weight-semibold {{ this.$store.getters.getUserName(details.owner) }}
                    p Registered by:
                    p.has-text-weight-bold {{ this.$store.getters.getUserName(details.createdBy)}}
                .column.profile-basic-info
                    p Added: {{ details.createdAt | formatDate }}
                    p State: {{ this.$store.getters.getStateName(details.state) }}
                    p Source: {{ this.$store.getters.getSourceName(details.source) }}
                    p Last company: {{ details.contact.companyName }}
                    p Last position: {{ details.contact.companyPosition }}
                .column.profile-basic-info
                    p City: {{ details.contact.city }}
                    p Country: {{ details.contact.country }}
                    p
                        span.icon
                            i.fa.fa-phone.fa-lg
                        a(:href="'tel:' + details.contact.phone") {{ details.contact.phone }}
                    p
                        span.icon
                            i.fa.fa-envelope.fa-lg
                        a(:href="'mail:' + details.contact.email") {{ details.contact.email }}

                    .div(v-show='hasSocialLinks()')
                        p(v-for='(link, key) in details.contact.social' v-if='link')
                            a(:href='link' target='_blank') <i class='fa fa-share-alt'></i> {{ key }}
                .column
                    p Tags: {{ details.tags }}

        .columns
            .column
                Experience(:experience="details.experience")
                Education(:education="details.education")
                Language(:languages="details.language")
                Salary(:salary="details.salary")
                Files
            .column bbb

        .columns(v-if='details')
            .column.is-3

                .box.top-box
                    h4.title.is-4.has-text-centered {{ details.contact.fullName }}
                    p {{ this.$store.getters.getPositionName(details.subtitle) }}
                    p Assigned to: {{ this.$store.getters.getUserName(details.owner) }}
                    p Registered by: {{ this.$store.getters.getUserName(details.createdBy)}}

                .box
                    <!-- TODO Add edit/delete profile functionality -->
                    p
                        a().button.is-white <i class='fa fa-edit'></i> Edit profile
                    p
                        a(@click='deleteCandidate(id)').button.is-white <i class='fa fa-trash'></i> Delete profile

                .box
                    .content
                        p City: {{ details.contact.city }}
                        p Country: {{ details.contact.country }}
                        p Phone: {{ details.contact.phone }}
                        p Email: {{ details.contact.email }}
                        p Added: {{ details.createdAt | formatDate }}

                .box
                    .content
                        p Last company: {{ details.contact.companyName }}
                        p Last position: {{ details.contact.companyPosition }}
                        p Tags: {{ details.tags }}
                        p State: {{ this.$store.getters.getStateName(details.state) }}
                        p Source: {{ this.$store.getters.getSourceName(details.source) }}
                        p Experience: {{ details.experience }}
                        p Language: {{ details.language }}
                        p Education: {{ details.education }}

                .box(v-show='hasSocialLinks()')
                    .content
                        p(v-for='(link, key) in details.contact.social' v-if='link')
                            a(:href='link' target='_blank') <i class='fa fa-share-alt'></i> {{ key }}

            .column.is-8.is-offset-1

                h3.title Notes

                .field.new-note
                    p.control
                        textarea(v-model='newNote' class='textarea' placeholder='New note')

                    button(@click='addNote' class='button is-primary') Save note

                .card(v-for='(note, index) in notes' v-if='notes')
                    header.card-header
                        p(@click='note.isVisible = !note.isVisible' class="card-header-title") {{ note.content }}
                        a.card-header-icon
                            span.icon
                                i(:class='["fa", note.isVisible ? "fa-angle-down" : "fa-angle-right"]')
                    .card-content(v-if='note.isVisible')
                        .content
                            textarea(v-model='note.content' class='textarea') {{ note.content }}
                            <!-- v-if is necessary to prevent app crash if note.owenr does not exists or has been removed. It's potential issue in others system areas. -->
                            small(v-if='$parent.$store.getters.getUserById(note.owner)') author: {{ $parent.$store.getters.getUserById(note.owner).profile.name }}
                            small created: {{ note.createdAt | formatDate }}
                            small updated: {{ note.updatedAt | formatDate }}
                    footer.card-footer(v-if='note.isVisible')
                        a(@click='updateNote(note._id, index)' class='card-footer-item') <i class="fa fa-edit"></i> Update
                        a(@click='deleteNote(note._id, index)' class='card-footer-item') <i class="fa fa-trash"></i> Remove

</template>

<script>
  import Candidates from '../api/Candidates'
  import Notes from '../api/Notes'
  import Experience from '@/components/profile/Experience'
  import Education from '@/components/profile/Education'
  import Language from '@/components/profile/Language'
  import Salary from '@/components/profile/Salary'
  import Files from '@/components/profile/Files'

  export default {
    name: 'profile',
    data () {
      return {
        id: this.$route.params.id,
        details: null,
        notes: [],
        newNote: null
      }
    },
    mounted () {
      this.getCandidate(this.id)
      this.getNotes(this.id)
    },
    components: {
      Experience,
      Education,
      Language,
      Salary,
      Files
    },
    methods: {
      getCandidate: function (id) {
        Candidates.get(id)
          .then(res => {
            this.details = res.body[0]
          })
          .catch(err => {
            console.log(err)
          })
      },
      getNotes: function (id) {
        Notes.get(id)
          .then(res => {
            this.notes = res.body
            this.sortNotes()
            this.addNotesVisibilityStatus()
          })
          .catch(err => {
            console.log(err)
          })
      },
      sortNotes: function () {
        this.notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      },
      addNotesVisibilityStatus: function () {
        this.notes.map(el => {
          this.$set(el, 'isVisible', false)
        })
      },
      hasSocialLinks: function () {
        const socialLinks = this.details.contact.social
        let hasLinks = false
        for (let link in socialLinks) {
          if (socialLinks[link].length) {
            hasLinks = true
            break
          }
        }
        return hasLinks
      },
      addNote: function () {
        Notes.addNote(this.newNote, this.details._id)
          .then(() => {
            this.getNotes(this.details._id)
          })
          .catch(err => {
            console.log(err)
          })
      },
      updateNote: function (noteID, index) {
        Notes.updateNote(noteID, this.notes[index])
          .catch(err => {
            console.log(err)
          })
      },
      deleteNote: function (noteID, index) {
        const message = 'Delete note?'
        if (window.confirm(message)) {
          Notes.deleteNote(noteID)
            .then(() => {
              this.notes.splice(index, 1)
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      deleteCandidate: function (candidateId) {
        const message = 'Delete candidate?'
        if (window.confirm(message)) {
          Candidates.deleteCandidate(candidateId)
            .then(() => {
              this.$router.push('/')
            }, () => {
              this.addErrorMessage()
            })
            .catch(err => {
              console.error(err)
              this.addErrorMessage()
            })
        }
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>

    @import ~assets/sass/mixins

    .profile-main-info
        padding: 0.75rem
        margin-bottom: 1rem
        .box
            padding: 0
        .title
            margin: 0
        hr
            border-top: 2px dashed white
            background: $color5
        .avatar-box
            margin: 15px 0
            img
                margin: 0 auto
                display: block
        .profile-basic-info
            padding-left: 4%
            p
                margin-bottom: 20px

    h4
        font-weight: $fw-semi-bold
        margin-bottom: 20px

    .top-box
        background-color: $color5
        color: #fff

    .box
        border-radius: 0
        .title
            color: #fff

        .button
            display: block
            text-align: left

        i
            position: relative
            margin-right: 10px

    .new-note
        margin-bottom: 50px

        .textarea
            margin-bottom: 20px

    .card-header-title
        font-weight: $fw-reg

    .card
        margin-bottom: 20px

        .textarea
            margin-bottom: 20px

        small
            margin-right: 20px

    .card-footer
        i
            margin-right: 10px

</style>
