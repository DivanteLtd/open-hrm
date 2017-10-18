<template lang="pug">
    section.profile-box
        header.profile-box-header Uploaded files
        div.profile-box-content
            ul
                li
                    span Link
                    button Get
            div.dropbox
                form(enctype="multipart/form-data" @change="newFile($event.target.name, $event.target.files)")
                    input(type="file" multiple="multiple")
                    p Drag your file here
</template>

<script>
  import Files from '../../api/Files'

  export default {
    data () {
      return {}
    },
    methods: {
      newFile (fieldName, fileList) {
        const formData = new FormData()
        formData.append('lid', this.$route.params.id)
        if (!fileList.length) return

        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name)
          })

        this.save(formData)
      },
      save (formData) {
        Files.add(formData).then(res => {
          this.addSuccessMessage('File has been added!')
        }, res => {
          if (res.data.error) {
            this.addErrorMessage(res.data.error)
          } else {
            this.addErrorMessage()
          }
        }).catch(err => {
          console.error(err)
          this.addErrorMessage()
        })
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
    $element-height: 100px

    .dropbox
        min-height: $element-height
        background: rgba(129, 146, 182, 0.4)
        border: 1px white dashed
        &:hover
            cursor: pointer
            background: rgba(129, 146, 182, 0.6)
        form
            position: relative
        input
            opacity: 0
            display: block
            height: $element-height
            width: 100%
        p
            position: absolute
            left: calc(50% - 70px)
            top: calc(50% - 12px)
            color: white
            text-align: center

</style>
