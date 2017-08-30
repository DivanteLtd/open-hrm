import Vue from 'vue'

const Sources = {
  getAll: function () {
    return Vue.http.get('source')
  },
  delete: function (statusId) {
    return Vue.http.delete('source' + '/' + statusId)
  },
  add: function (source) {
    return Vue.http.post('source', source)
  }
}

export default Sources
