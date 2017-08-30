import Vue from 'vue'

const User = {
  login: function (user) {
    return Vue.http.post('auth', user)
  },
  check: function () {
    return Vue.http.get('auth' + '/check')
  },
  getAll: function () {
    return Vue.http.get('user')
  },
  put: function (user) {
    return Vue.http.put('user', user)
  },
  add: function (user) {
    return Vue.http.post('user/', user)
  },
  addReg: function (user) {
    return Vue.http.post('auth/new', user)
  },
  delete: function (userId) {
    return Vue.http.delete('user/' + userId)
  },
  getActiveUser: function (userId) {
    return Vue.http.get(`user/${userId}/`)
  },
  logout: function () {
    return Vue.http.get('auth')
  }
}

export default User
