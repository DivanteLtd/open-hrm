import Vue from 'vue'

const Files = {
  add: function (file) {
    return Vue.http.post('files', file)
  }
}

export default Files
