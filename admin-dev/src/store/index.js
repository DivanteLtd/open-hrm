import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: '',
    activeUser: {
      name: '',
      email: '',
      role: ''
    },
    users: [],
    states: [],
    sources: [],
    positions: []
  },
  getters: {
    getActiveUserInfo: state => {
      return state.activeUser
    },
    getIsLogged: state => {
      return state.isLoggedIn
    },
    getUserById: state => id => {
      return state.users.find(user => user._id === id)
    },
    getStateById: state => id => {
      return state.states.find(state => state._id === id)
    },
    getSourceById: state => id => {
      return state.sources.find(source => source._id === id)
    },
    getPositionById: state => id => {
      return state.positions.find(position => position._id === id)
    },
    getUserName: (state, getters) => id => {
      const user = getters.getUserById(id)
      return user ? user.profile.name : ''
    },
    getStateName: (state, getters) => id => {
      const positionState = getters.getStateById(id)
      return positionState ? positionState.name : ''
    },
    getSourceName: (state, getters) => id => {
      const source = getters.getSourceById(id)
      return source ? source.name : ''
    },
    getPositionName: (state, getters) => id => {
      const position = getters.getPositionById(id)
      return position ? position.name : ''
    }
  },
  mutations: {
    setUserInfo (state, payload) {
      const userInfo = JSON.parse(payload)
      state.activeUser.name = userInfo.profile.name
      state.activeUser.email = userInfo.email
      state.activeUser.role = userInfo.role
      state.activeUser._id = userInfo._id
    },
    setUsers (state, payload) {
      state.users = payload
    },
    setStates (state, payload) {
      state.states = payload
    },
    setSources (state, payload) {
      state.sources = payload
    },
    setPositions (state, payload) {
      state.positions = payload
    },
    isLoggedIn (state, isLogged) {
      state.isLoggedIn = isLogged
    }
  }
})
