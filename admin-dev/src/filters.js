import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDate', value => {
  return moment(value).format('YYYY-MM-DD HH:mm')
})
