<template lang="pug">
    .container
        .is-clearfix.box-header
            h1.is-pulled-left Add new candidate
            button(@click='addNewCandidate' class='button is-primary is-pulled-right is-clearfix' ) Submit
        .box
            form(@submit.prevent='addNewCandidate' id="candidate-form")
                div.columns
                    div.column.is-half
                        fieldset
                            legend Lead info

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Full name
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='fullName' type='text' v-model='candidate.contact.fullName' v-validate="'required'")
                                            p(class="help is-danger" v-show="errors.has('fullName')") {{ errors.first('fullName') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Email
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='email' type='email' v-model='candidate.contact.email' v-validate="'required|email'")
                                            p(class="help is-danger" v-show="errors.has('email')") {{ errors.first('email') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Phone
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='phone' type='text' v-model='candidate.contact.phone' v-validate="'numeric'")
                                            p(class="help is-danger" v-show="errors.has('phone')") {{ errors.first('phone') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label City
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='city' type='text' v-model='candidate.contact.city')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Country
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='city' type='text' v-model='candidate.contact.country')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Position
                                .field-body
                                    .field
                                        .control
                                            .select
                                                select(v-model='candidate.subtitle' v-validate="'required'" name="position")
                                                    option
                                                    option(v-for='position in $store.state.positions'
                                                      :value='position._id') {{ position.name }}
                                            p(class="help is-danger" v-show="errors.has('position')") {{ errors.first('position') }}

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label State
                                .field-body
                                    .field
                                        .control
                                            .select
                                                select(v-model='candidate.state' v-validate="'required'" name="state")
                                                    option
                                                    option(v-for='state in $store.state.states'
                                                      :value='state._id') {{ state.name }}
                                            p(class="help is-danger" v-show="errors.has('state')") {{ errors.first('state') }}
                        fieldset
                            legend Languages
                            LanguageFields(:language="candidate.language")

                        fieldset
                            legend Education
                            EducationFields(:education="candidate.education")

                        fieldset
                            legend Experience
                            ExperienceFields(:experience="candidate.experience")


                        fieldset
                            legend Social networks

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label linkedin.com/
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='linkedin' type='text' v-model='candidate.contact.social.linkedin')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label goldenline.pl/
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='goldenline' type='text' v-model='candidate.contact.social.goldenline')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label facebook.com/
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='facebook' type='text' v-model='candidate.contact.social.facebook')

                        .field.is-horizontal
                            .field-label.is-normal
                                label.label Tags
                            .field-body
                                .field
                                    .control
                                        input(class='input' name='tags' type='text' v-model='candidate.tags')

                        .field.is-horizontal
                            .field-label.is-normal
                                label.label New Note
                            .field-body
                                .field
                                    .control
                                        wysiwyg(class='textarea' name='note' type='text' v-model='candidate.note' rows="6" resize="none")


                    div.column.is-half
                        fieldset
                            legend Additional

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Recruiter
                                .field-body
                                    .field
                                        .control
                                            .select
                                                select(v-model='candidate.additional.recruiter' v-validate="'required'" name="recruiter")
                                                    option
                                                    option(v-for='user in $store.state.users'
                                                      :value='user._id') {{ user.profile.name }}
                                            p(class="help is-danger" v-show="errors.has('recruiter')") {{ errors.first('recruiter') }}

                        fieldset
                            legend Source

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Source
                                .field-body
                                    .field
                                        .control
                                            .select
                                                select(v-model='candidate.source' v-validate="'required'" name="source")
                                                    option
                                                    option(v-for='source in $store.state.sources'
                                                      :value='source._id') {{ source.name }}
                                            p(class="help is-danger" v-show="errors.has('source')") {{ errors.first('source') }}


                        fieldset
                            legend Last company

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Company name
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='companyName' type='text' v-model='candidate.contact.companyName')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Company Position
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='companyPosition' type='text' v-model='candidate.contact.companyPosition')

                        fieldset
                            legend Salary

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Contract
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='contract' type='text' v-model='candidate.salary.contract')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Net
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='net' type='number' v-model='candidate.salary.net')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Gross
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='gross' type='number' v-model='candidate.salary.gross')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Cost
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='cost' type='number' v-model='candidate.salary.cost')

                            .field.is-horizontal
                                .field-label.is-normal
                                    label.label Currency
                                .field-body
                                    .field
                                        .control
                                            input(class='input' name='currency' type='text' v-model='candidate.salary.currency')


                .field
                    .control.is-pulled-right-text
                        button.button.is-primary Submit
</template>

<script>
  import Candidates from '../api/Candidates'
  import LanguageFields from '@/components/addCandidate/LanguageFields'
  import EducationFields from '@/components/addCandidate/EducationFields'
  import ExperienceFields from '@/components/addCandidate/ExperienceFields'

  export default {
    name: 'add-candidate',
    components: {
      LanguageFields,
      EducationFields,
      ExperienceFields
    },
    data () {
      return {
        candidate: {
          contact: {
            fullName: '',
            email: '',
            phone: '',
            social: {
              linkedin: '',
              goldenline: '',
              facebook: ''
            },
            companyName: '',
            companyPosition: '',
            city: ''
          },
          salary: {
            contract: '',
            net: '',
            gross: '',
            cost: '',
            currency: ''
          },
          subtitle: '',
          tags: '',
          experience: [{language: '', level: '', position: '', company: ''}],
          language: [{language: '', level: ''}],
          education: [{from: '', to: '', school: ''}],
          additional: {
            recruiter: ''
          },
          source: '',
          note: ''
        }
      }
    },
    methods: {
      addNewCandidate () {
        this.$validator.validateAll()
        if (!this.errors.any()) {
          Candidates.addCandidate(this.candidate)
            .then(res => {
              this.addSuccessMessage('User has been added!')
              Object.assign(this.$data, this.$options.data())
              this.$validator.clean()
            }, res => {
              this.addErrorMessage()
            })
            .catch((err) => {
              console.error(err)
              this.addErrorMessage()
            })
        }
      }
    }
  }
</script>

