import Vue from 'vue'

const Positions = {
  getAll: function () {
    return Vue.http.get('position')
  },
  delete: function (positionId) {
    return Vue.http.delete('position' + '/' + positionId)
  },
  add: function (position) {
    return Vue.http.post('position', position)
  }
}

export default Positions
