// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import App from './Dashboard'
import router from './router'
import store from './store'
import User from './api/User'
import filters from './filters'
import Notifications from 'vue-notification'
import NotificationHelper from './/mixins/NotificationHelper'
import wysiwyg from 'vue-wysiwyg'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VeeValidate)
Vue.use(Notifications)
Vue.use(wysiwyg)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  filters,
  template: '<App/>',
  components: {App},
  mixins: [NotificationHelper],
  beforeMount () {
    User.check()
      .then(res => {
        if (res.status === 202) {
          this.$store.commit('isLoggedIn', true)
          this.$store.commit('setUserInfo', res.bodyText)
        } else {
          this.$router.push('/login')
        }
      })
      .catch(() => {
        this.$router.push('/login')
      })
  },
  mounted () {
    router.beforeEach((to, from, next) => {
      User.check()
        .then(res => {
          if (res.status === 202) {
            next({path: to})
          }
        })
        .catch(() => {
          this.$store.commit('isLoggedIn', false)
          let toPath = to.path.replace(/\//g, '')

          if (toPath === 'registration') {
            next({path: '/registration'})
          } else {
            next({path: '/login'})
          }
        })
      next()
    })
  }
})

