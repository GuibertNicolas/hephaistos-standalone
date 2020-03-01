import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import createRouter from './router'

const state = {
  user: {}
}

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

axios.defaults.withCredentials = true

new Vue({
  data: state,
  router: createRouter(state),
  vuetify,
  render: h => h(App)
}).$mount('#app')
