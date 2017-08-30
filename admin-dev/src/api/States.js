import Vue from 'vue'

const States = {
  getAll: function () {
    return Vue.http.get('state')
  },
  delete: function (stateId) {
    return Vue.http.delete('state' + '/' + stateId)
  },
  add: function (state) {
    return Vue.http.post('state', state)
  }
}

export default States
