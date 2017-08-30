import Vue from 'vue'

const Mediums = {
  getAll: function () {
    return Vue.http.get('medium')
  },
  delete: function (mediumId) {
    return Vue.http.delete('medium' + '/' + mediumId)
  },
  add: function (medium) {
    return Vue.http.post('medium', medium)
  }
}

export default Mediums
